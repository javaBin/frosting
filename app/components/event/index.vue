<script setup lang="ts">
const props = defineProps<{
  conference: Conference
}>()

const {
  data: sessions,
  status
} = await useLazyFetch<Session[]>(`http://localhost:8080/api/conferences/${props.conference.id}/sessions`)

const headers = [
  {title: "Title", key: "title"},
  {title: "Abstract", key: "abstract"},
  {title: "Format", key: "format"},
  {title: "Status", key: "status"},
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

    <v-data-table v-if="status === 'success'" :items="sessions" :headers="headers" density="comfortable" :search="search"
                  items-per-page="100">
    </v-data-table>
  </v-container>
</template>