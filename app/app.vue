<script setup lang="ts">
const selectedConference = ref<Conference | undefined>()

const selectConference = (conference: Conference) => {
  selectedConference.value = conference;
}

</script>

<template>
  <v-app>
    <Nav @selectConference="selectConference($event)"/>

    <v-main>
      <NuxtPage :conference="selectedConference" />
    </v-main>
  </v-app>
</template>
