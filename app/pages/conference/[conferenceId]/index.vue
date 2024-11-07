<script setup lang="ts">
const route = useRoute()

const { findConference, conferenceTitle } = useConferences()
const { sessionLink } = useSessions()

const {
  data: conferences,
  status: conferenceStatus
} = await useFetch<Conference[]>(`http://localhost:8080/api/conferences`)

const {
  data: sessions,
  status
} = await useLazyFetch<Session[]>(`http://localhost:8080/api/conferences/${route.params.conferenceId}/sessions`)

const headers = [
  {title: "Speaker", key: "speakers"},
  {title: "Title", key: "title"},
  {title: "Format", key: "format", filterable: false, align: "center"},
  {title: "Status", key: "status", filterable: false, align: "center"},
  {title: "Language", key: "language", filterable: false, align: "center"},
  {title: "Length", key: "length"},
  {title: "Location", key: "location", value: "speakers"},
  {title: "", key: "id", filterable: false, sortable: false, align: "center"}
]

const search = ref('')

const conference = computed(() => {
  if (conferenceStatus.value === "success") {
    return findConference(route.params.conferenceId, conferences.value)
  }
})

</script>

<template>
  <v-container>

    <h1 v-if="conference">{{ conferenceTitle(conference) }}</h1>

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
    />

    <v-data-table
        v-if="status === 'success' && conferenceStatus === 'success'"
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
      <template v-slot:[`item.id`]="{ value }">
        <v-btn v-if="value" :to="sessionLink(conference, value)"><v-icon>mdi-file-document-outline</v-icon></v-btn>
      </template>
      <template v-slot:[`item.status`]="{ value }">
        <IconStatus :status="value" />
      </template>
      <template v-slot:[`item.format`]="{ value }">
        <IconFormat :format="value" />
      </template>
      <template v-slot:[`item.language`]="{ value }">
        <IconLanguage :language="value" />
      </template>
    </v-data-table>
  </v-container>
</template>