<script setup lang="ts">
const {
  conferences,
  conferencesError,
  conferencesLoaded,
  fetchConferences,
  conferenceLink,
} = useConferences()

void fetchConferences()

const route = useRoute()
const conferenceCount = computed(() => conferences.value.length)

// Settled once a load has either succeeded or failed; before the first request
// starts, and while one runs, there is nothing to choose from yet
const settled = computed(
  () => conferencesLoaded.value || conferencesError.value !== null,
)

const currentConference = computed(() => {
  const id = route.params.conferenceId
  if (!id) return undefined
  return conferences.value.find((c) => c.id === id)
})

const buttonLabel = computed(() => {
  if (!settled.value) return "Loading…"
  if (conferencesError.value) return "Conferences unavailable"
  if (currentConference.value) return currentConference.value.name
  return "Select Conference"
})

const conferenceItems = computed(() => [
  ...(conferencesError.value
    ? [
        [
          { label: "Failed to load conferences", disabled: true },
          {
            label: "Retry",
            icon: "i-lucide-rotate-cw",
            onSelect: () => void fetchConferences(),
          },
        ],
      ]
    : []),

  conferences.value.map((c) => ({
    label: c.name,
    to: conferenceLink(c),
  })),

  ...(conferencesLoaded.value &&
  !conferencesError.value &&
  conferenceCount.value === 0
    ? [[{ label: "No conferences found", disabled: true }]]
    : []),
])
</script>

<template>
  <UHeader title="Cupcake" to="/">
    <UDropdownMenu :items="conferenceItems" :content="{ align: 'start' }">
      <UButton
        variant="ghost"
        color="neutral"
        trailing-icon="i-lucide-chevron-down"
        :label="buttonLabel"
        :loading="!settled"
        :disabled="!settled"
        class="font-medium"
      />
    </UDropdownMenu>

    <template #right>
      <UColorModeButton variant="ghost" color="neutral" />
    </template>
  </UHeader>
</template>
