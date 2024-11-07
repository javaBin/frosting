<script setup lang="ts">
import {Icon} from "@iconify/vue";

const props = defineProps<{
  format: string
}>()
</script>

<template>
  <span class="px-2">
    <v-tooltip v-if="props.format === 'LIGHTNING_TALK'" text="Lightning Talk">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:lightning"/>
      </template>
    </v-tooltip>
    <v-tooltip v-if="props.format === 'WORKSHOP'" text="Workshop">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:laptop"/>
      </template>
    </v-tooltip>
    <v-tooltip v-if="props.format === 'PRESENTATION'" text="Presentation">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:group-presentation"/>
      </template>
    </v-tooltip>
    <v-tooltip v-if="props.format === 'PANEL'" text="Panel Debate">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:forum"/>
      </template>
    </v-tooltip>
  </span>
</template>