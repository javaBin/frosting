<script setup lang="ts">
import {Icon} from "@iconify/vue";

const route = useRoute()

const {findConference, conferenceTitle} = useConferences()
const {sessionLink} = useSessions()

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

const ready = computed(() => {
  return status.value === 'success' && conferenceStatus.value === 'success';
})

const selectedFormat = ref<string | undefined>()
const selectedLanguage = ref<string | undefined>()
const selectedStatus = ref<string | undefined>()

const selectFormat = ((format: string) => {
  selectedFormat.value = format;
})

const selectStatus = ((status: string) => {
  selectedStatus.value = status;
})

const selectLanguage = ((language: string) => {
  selectedLanguage.value = language;
})

const clearFormat = (() => {
  selectedFormat.value = undefined;
})

const clearStatus = (() => {
  selectedStatus.value = undefined;
})


const clearLanguage = (() => {
  selectedLanguage.value = undefined;
})

const filteredSessions = computed(() => {
  return sessions.value?.filter((session) => {
    return selectedFormat.value === undefined || session.format === selectedFormat.value.toLocaleUpperCase();
  }).filter((session) => {
    return selectedStatus.value === undefined || session.status === selectedStatus.value.toLocaleUpperCase();
  }).filter((session) => {
    return selectedLanguage.value === undefined || session.language === selectedLanguage.value.toLocaleUpperCase();
  });
})
</script>

<template>
  <v-container>

    <h1 v-if="ready">{{ conferenceTitle(conference) }}</h1>

    <div v-if="ready" class="mx-2">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <b>Filters:</b>
            <span class="mx-2" v-if="selectedFormat">Format: {{ selectedFormat }}</span>
            <span class="mx-2" v-if="selectedStatus">Status: {{ selectedStatus }}</span>
            <span class="mx-2" v-if="selectedLanguage">Language: {{ selectedLanguage }}</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div class="d-flex ga-3 justify-center">
              <v-card class="w-25 d-flex flex-column">
                <v-card-title>Format</v-card-title>
                <v-card-text>
                  <div class="d-flex flex-column ga-3">
                    <IconBtn title="Presentation" icon="carbon:group-presentation" @select="selectFormat"/>
                    <IconBtn title="Lightning Talk" icon="carbon:lightning" @select="selectFormat"/>
                    <IconBtn title="Workshop" icon="carbon:laptop" @select="selectFormat"/>
                    <IconBtn title="Panel Debate" icon="carbon:forum" @select="selectFormat"/>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="clearFormat">Clear</v-btn>
                </v-card-actions>
              </v-card>
              <v-card class="w-25 d-flex flex-column">
                <v-card-title>Status</v-card-title>
                <v-card-text>
                  <div class="d-flex flex-column ga-3">
                    <IconBtn title="Approved" icon="carbon:task-approved" @select="selectStatus"/>
                    <IconBtn title="Submitted" icon="carbon:task-view" @select="selectStatus"/>
                    <IconBtn title="Rejected" icon="carbon:task-remove" @select="selectStatus"/>
                    <IconBtn title="Historic" icon="carbon:task-asset-view" @select="selectStatus"/>
                    <IconBtn title="Draft" icon="carbon:task-add" @select="selectStatus"/>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="clearStatus">Clear</v-btn>
                </v-card-actions>
              </v-card>
              <v-card class="w-25 d-flex flex-column">
                <v-card-title>Language</v-card-title>
                <v-card-text>
                  <div class="d-flex flex-column ga-3">
                    <IconBtn title="English" icon="openmoji:flag-united-kingdom" @select="selectLanguage"/>
                    <IconBtn title="Norwegian" icon="openmoji:flag-norway" @select="selectLanguage"/>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="clearLanguage">Clear</v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <v-text-field
        v-if="ready"
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
        v-if="!ready"
    />

    <v-data-table
        v-if="ready"
        :items="filteredSessions"
        :headers="headers"
        density="comfortable"
        :search="search"
        items-per-page="100">
      <template v-slot:[`item.speakers`]="{ value }">
        <v-list lines="two" density="comfortable">
          <v-list-item v-for="(speaker, index) in value" :idx="index" :title="speaker.name" :subtitle="speaker.email"/>
        </v-list>
      </template>
      <template v-slot:[`item.location`]="{ value }">
        <v-list lines="two" density="comfortable">
          <v-list-item v-for="(speaker, index) in value" :idx="index" :title="speaker.postcode"
                       :subtitle="speaker.location"/>
        </v-list>
      </template>
      <template v-slot:[`item.id`]="{ value }">
        <v-btn v-if="value" :to="sessionLink(conference, value)">
          <v-icon>mdi-file-document-outline</v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.status`]="{ value }">
        <IconStatus :status="value"/>
      </template>
      <template v-slot:[`item.format`]="{ value }">
        <IconFormat :format="value"/>
      </template>
      <template v-slot:[`item.language`]="{ value }">
        <IconLanguage :language="value"/>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>
.filter {
  flex-direction: column;
}
</style>