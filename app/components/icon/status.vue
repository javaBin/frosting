<script setup lang="ts">
import {Icon} from "@iconify/vue";

const props = defineProps<{
  status: string
}>()
</script>

<template>
  <span class="px-2">
    <v-tooltip  v-if="props.status === 'APPROVED'" text="Approved">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:task-approved" />
      </template>
    </v-tooltip>
    <v-tooltip  v-if="props.status === 'SUBMITTED'" text="Submitted">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:task-view" />
      </template>
    </v-tooltip>
    <v-tooltip  v-if="props.status === 'REJECTED'" text="Rejected">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:task-remove" />
      </template>
    </v-tooltip>
    <v-tooltip  v-if="props.status === 'HISTORIC'" text="Historic">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:task-asset-view" />
      </template>
    </v-tooltip>
    <v-tooltip  v-if="props.status === 'Draft'" text="Draft">
      <template v-slot:activator="{ props }">
        <Icon v-bind="props" icon="carbon:task-add" />
      </template>
    </v-tooltip>
  </span>
</template>
