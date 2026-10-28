import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"
import { createGzip } from "node:zlib"
import { defineEventHandler, getRequestHeaders, readRawBody } from "h3"
import type { H3Event } from "h3"

const backend =
  process.env.CUPCAKE_BACKEND ??
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8080"
    : "https://cupcake-backend.javazone.no")

// Hop-by-hop headers, plus the ones describing the wire encoding: fetch negotiates
// its own encoding with the backend and hands us a decoded body
const skippedRequestHeaders = new Set([
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "content-length",
  "accept-encoding",
])

// fetch has already decoded the body, so the upstream encoding and length no longer
// describe what we send. CORS headers are meaningless on a same-origin response.
const isSkippedResponseHeader = (key: string) =>
  [
    "connection",
    "keep-alive",
    "transfer-encoding",
    "content-encoding",
    "content-length",
    "set-cookie",
  ].includes(key) || key.startsWith("access-control-")

const shouldProxy = (url: string) =>
  url.startsWith("/api") && !url.startsWith("/api/_nuxt_icon")

// The API's large session lists compress about 3x; nothing else is worth the CPU
const shouldGzip = (event: H3Event, upstream: Response) =>
  /\bgzip\b/.test(event.node.req.headers["accept-encoding"] ?? "") &&
  (upstream.headers.get("content-type") ?? "").includes("json")

export default defineEventHandler(async (event) => {
  const url = event.node.req.url ?? ""
  if (!shouldProxy(url)) return

  const headers = new Headers()
  for (const [key, value] of Object.entries(getRequestHeaders(event))) {
    if (value !== undefined && !skippedRequestHeaders.has(key)) {
      headers.set(key, value)
    }
  }

  const upstream = await fetch(backend + url, {
    method: event.method,
    headers,
    body: ["GET", "HEAD"].includes(event.method)
      ? undefined
      : await readRawBody(event),
    redirect: "manual",
  })

  const res = event.node.res
  res.statusCode = upstream.status

  for (const [key, value] of upstream.headers) {
    if (!isSkippedResponseHeader(key)) res.setHeader(key, value)
  }
  const cookies = upstream.headers.getSetCookie()
  if (cookies.length > 0) res.setHeader("set-cookie", cookies)

  if (!upstream.body) {
    res.end()
    return
  }

  // Stream rather than buffer: the body goes out as it arrives from the backend
  const body = Readable.from(upstream.body)

  if (shouldGzip(event, upstream)) {
    res.setHeader("content-encoding", "gzip")
    res.setHeader("vary", "accept-encoding")
    await pipeline(body, createGzip(), res)
  } else {
    await pipeline(body, res)
  }
})
