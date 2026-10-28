<script setup lang="ts">
import type { Conference } from "@/types/conference"
import type { Session } from "@/types/session"
import type { Filters } from "@/types/filters"

const props = defineProps<{
  conference: Conference
}>()

const { sessions, sessionsPending, sessionsError, fetchSessions } =
  useSessionData(props.conference.id)
void fetchSessions()

const search = ref("")
const page = ref(1)
const pageSize = ref(50)

const filters = reactive<Filters>({
  format: undefined,
  status: undefined,
  language: undefined,
  city: undefined,
  county: undefined,
})

const TEXT_QUERY_DEBOUNCE_MS = 200

type TextQuery = { search: string; city: string; county: string }

const readTextQuery = (): TextQuery => ({
  search: search.value.toLowerCase().trim(),
  city: (filters.city ?? "").trim().toUpperCase(),
  county: (filters.county ?? "").trim().toUpperCase(),
})

// Typed fields apply after a pause in typing, so the table re-renders once per
// query rather than once per keystroke. The select filters apply at once.
const textQuery = ref<TextQuery>(readTextQuery())
let textQueryTimer: ReturnType<typeof setTimeout> | undefined

watch([search, () => filters.city, () => filters.county], () => {
  clearTimeout(textQueryTimer)
  textQueryTimer = setTimeout(() => {
    textQuery.value = readTextQuery()
  }, TEXT_QUERY_DEBOUNCE_MS)
})
onBeforeUnmount(() => clearTimeout(textQueryTimer))

const searchableText = (session: Session): string =>
  [
    session.title,
    session.format,
    session.status,
    session.language,
    session.length ?? "",
    ...session.speakers.map((s) => s.name),
    ...session.speakers.map((s) => s.city ?? ""),
    ...session.speakers.map((s) => s.county ?? ""),
    ...session.speakers.map((s) => s.location ?? ""),
  ]
    .join(" ")
    .toLowerCase()

// Built once per sessions load instead of once per session per query
const searchTextById = computed(
  () => new Map(sessions.value.map((s) => [s.id, searchableText(s)])),
)

const filteredSessions = computed(() => {
  const { search: needle, city, county } = textQuery.value
  const { format, status, language } = filters
  const searchText = searchTextById.value

  return sessions.value.filter(
    (s) =>
      (!format || s.format === format) &&
      (!status || s.status === status) &&
      (!language || s.language === language) &&
      (!city ||
        s.speakers.some((sp) =>
          (sp.city ?? "").toUpperCase().includes(city),
        )) &&
      (!county ||
        s.speakers.some((sp) =>
          (sp.county ?? "").toUpperCase().includes(county),
        )) &&
      (!needle || (searchText.get(s.id) ?? "").includes(needle)),
  )
})

const total = computed(() => filteredSessions.value.length)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value)),
)

watch(
  [
    textQuery,
    () => filters.format,
    () => filters.status,
    () => filters.language,
    pageSize,
  ],
  () => {
    page.value = 1
  },
)

watch([total, pageSize], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
  if (total.value === 0) page.value = 1
})

const paginatedSessions = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredSessions.value.slice(start, start + pageSize.value)
})

const rangeText = computed(() => {
  if (sessionsPending.value) return "Loading sessions…"
  if (total.value === 0) return "Showing 0–0 of 0"
  const start = (page.value - 1) * pageSize.value + 1
  const end = Math.min(page.value * pageSize.value, total.value)
  return `Showing ${start}–${end} of ${total.value}`
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="sessionsError" class="text-red-500">Failed to load sessions</div>

    <div class="flex items-center gap-3">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search sessions (use filters below to narrow down by type, language or location)"
        class="w-full"
      />

      <USelect
        v-model="pageSize"
        :items="
          [25, 50, 100, 200].map((n) => ({ label: `${n}/page`, value: n }))
        "
        class="w-36"
      />
    </div>

    <SessionsFilters v-model="filters" />

    <div class="flex items-center justify-between gap-3">
      <div class="text-sm text-muted">{{ rangeText }}</div>
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="pageSize"
      />
    </div>

    <UProgress v-if="sessionsPending" indeterminate class="w-full" />
    <SessionsTable
      v-else
      :sessions="paginatedSessions"
      :conference="conference"
    />

    <div class="flex justify-end">
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="pageSize"
      />
    </div>
  </div>
</template>
