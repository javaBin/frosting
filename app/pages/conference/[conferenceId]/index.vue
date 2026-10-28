<script setup lang="ts">
import type { Conference } from "@/types/conference"

const route = useRoute()
const {
  conferencesLoaded,
  conferencesError,
  fetchConferences,
  findConference,
} = useConferences()

const conferenceId = String(route.params.conferenceId)

void fetchConferences()

const conference = computed<Conference | undefined>(() =>
  findConference(conferenceId),
)

const retryAction = [
  {
    label: "Retry",
    icon: "i-lucide-rotate-cw",
    onClick: () => void fetchConferences(),
  },
]
</script>

<template>
  <div class="mx-2">
    <SessionsBrowser v-if="conference" :conference="conference" />

    <UAlert
      v-else-if="conferencesError"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Couldn't load conferences"
      description="The conference list is unavailable right now."
      :actions="retryAction"
    />

    <UAlert
      v-else-if="conferencesLoaded"
      color="neutral"
      variant="subtle"
      icon="i-lucide-search-x"
      title="Conference not found"
      description="It may be outside the conferences Cupcake shows. Pick one from the menu above."
    />

    <UProgress v-else indeterminate class="w-full" />
  </div>
</template>
