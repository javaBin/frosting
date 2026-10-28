import type { Speaker } from "./speaker"

// Mirror the backend enums (serialized by name); UNKNOWN is its fallback for unrecognised values
export type Format =
  "LIGHTNING_TALK" | "PRESENTATION" | "WORKSHOP" | "PANEL" | "UNKNOWN"

export type Status =
  "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "HISTORIC" | "UNKNOWN"

export type Language = "ENGLISH" | "NORWEGIAN" | "UNKNOWN"

export interface Session {
  id: string
  title: string
  abstract: string
  format: Format
  status: Status
  language: Language
  length?: number
  speakers: Speaker[]
}
