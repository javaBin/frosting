<script setup lang="ts">
const route = useRoute()

const {findConference, conferenceTitle, conferenceLink} = useConferences()
const {findSession, duration} = useSessions()

const {
  data: conferences,
  status: conferenceStatus
} = await useFetch<Conference[]>(`http://localhost:8080/api/conferences`)

const {
  data: sessions,
  status
} = await useLazyFetch<Session[]>(`http://localhost:8080/api/conferences/${route.params.conferenceId}/sessions`)

const conference = computed(() => {
  if (conferenceStatus.value === "success") {
    return findConference(route.params.conferenceId, conferences.value);
  }

  return undefined;
})

const session = computed(() => {
  if (status.value === "success") {
    const session = findSession(route.params.sessionId, sessions.value)

    return session;
  }

  return undefined
})

const sessionLength = computed(() => {
  return duration(session.value);
})

</script>

<template>
  <v-container>
    <h1 v-if="conference">
      <NuxtLink :to="conferenceLink(conference)">{{ conferenceTitle(conference) }}</NuxtLink>
    </h1>

    <div v-if="session">
      <h2 class="my-2">
        {{ session.title }}
        <span v-if="sessionLength"> ({{ sessionLength }})</span>
        <IconFormat :format="session.format"/>
        <IconStatus :status="session.status"/>
        <IconLanguage :language="session.language"/>
      </h2>

      <div class="my-2">
        {{ session.abstract }}
      </div>

      <h2>Speakers</h2>

      <div class="d-flex flex-wrap ga-3 my-2 justify-center">
        <v-card v-for="(speaker, idx) in session.speakers" :key="idx" class="w-25">
          <v-card-title>{{ speaker.name }}</v-card-title>

          <v-card-text v-if="speaker.bio">{{ speaker.bio }}</v-card-text>

          <v-card-actions>
            <v-list density="compact" lines="two">
              <v-list-item v-if="speaker.email" title="E-mail" :subtitle="speaker.email" />
              <v-list-item v-if="speaker.postcode" title="Postcode" :subtitle="speaker.postcode" />
              <v-list-item v-if="speaker.location" title="Location" :subtitle="speaker.location" />
            </v-list>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <v-progress-circular
        color="primary"
        indeterminate
        class="ma-16"
        v-if="status === 'pending' || conferenceStatus === 'pending'"
    />
  </v-container>
</template>

