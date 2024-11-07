<script setup lang="ts">
const {
  data: conferences
} = await useFetch<Conference[]>(`http://localhost:8080/api/conferences`)

const { conferenceLink } = useConferences()
</script>

<template>
  <v-toolbar>
    <v-toolbar-title>
      <v-btn to="/">
        Cupcake
      </v-btn>
    </v-toolbar-title>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
            color="primary"
            v-bind="props"
        >
          Select Conference
        </v-btn>
      </template>
      <v-list>
        <v-list-item
            v-for="(item, index) in conferences"
            :key="index"
        >
          <v-list-item-title>
            <v-btn flat :to="conferenceLink(item)">
              {{ item.name }}
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer/>

    <NavThemeToggle/>
  </v-toolbar>
</template>
