<script setup lang="ts">
import {useAsyncData} from "#app";

const props = defineProps<{
  conference: Conference
}>()

const {
  data: sessions,
  status
} = await useLazyAsyncData<Session[]>(`Conference - ${props.conference.id}`, () => $fetch(`http://localhost:8080/api/conferences/${props.conference.id}/sessions`), {
  watch: [props]
})

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
</script>

<template>
  <v-container>
    <h1>{{ props.conference.name }}</h1>

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