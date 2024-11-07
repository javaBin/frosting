<script setup lang="ts">
import {useConferences} from "~/coomposables/conferences";

const route = useRoute()

const { findConference } = useConferences()

const {
  data: conferences,
  status: conferenceStatus
} = await useFetch<Conference[]>(`http://localhost:8080/api/conferences`)

const {
  data: sessions,
  status
} = await useLazyFetch<Session[]>(`http://localhost:8080/api/conferences/${route.params.id}/sessions`)

const headers = [
  {title: "Speaker", key: "speakers"},
  {title: "Title", key: "title"},
  {title: "Format", key: "format"},
  {title: "Status", key: "status"},
  {title: "Language", key: "language"},
  {title: "Length", key: "length"},
  {title: "Location", key: "location", value: "speakers"},
]

const search = ref('')

const conferenceTitle = computed(() => {
  if (conferenceStatus.value === "success") {
    const conf = findConference(route.params.id, conferences.value)

    if (conf !== undefined) {
      return conf.name;
    }
  }

  return "Javazone";
})
</script>

<template>
  <v-container>

    <h1>{{ conferenceTitle }}</h1>
    <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
        class="ma-2"
    ></v-text-field>

    <v-progress-circular
        color="primary"
        indeterminate
        class="ma-16"
        v-if="status === 'pending'"
    ></v-progress-circular>

    <v-data-table
        v-if="status === 'success'"
        :items="sessions"
        :headers="headers"
        density="compact"
        :search="search"
        items-per-page="100">
      <template v-slot:[`item.speakers`]="{ value }">
        <v-list lines="two" density="compact">
          <v-list-item v-for="(speaker, index) in value" :idx="index" :title="speaker.name" :subtitle="speaker.email"/>
        </v-list>
      </template>
      <template v-slot:[`item.location`]="{ value }">
        <v-list lines="two" density="compact">
          <v-list-item v-for="(speaker, index) in value" :idx="index" :title="speaker.postcode"
                       :subtitle="speaker.location"/>
        </v-list>
      </template>
    </v-data-table>
  </v-container>
</template>