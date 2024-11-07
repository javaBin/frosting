<script setup lang="ts">
import {Icon} from "@iconify/vue";

const props = defineProps<{
  language: string
}>()
</script>

<template>
  <span class="px-2">
    <v-tooltip  v-if="props.language === 'ENGLISH'" text="English">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="openmoji:flag-united-kingdom" />
      </template>
    </v-tooltip>
    <v-tooltip  v-if="props.language === 'NORWEGIAN'" text="Norwegian">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="openmoji:flag-norway" />
      </template>
    </v-tooltip>
  </span>
</template>