<script setup lang="ts">
import type { Status } from "@/types/session"
import { statusDisplay } from "~/utils/sessionDisplay"

const props = defineProps<{
  status: Status
  full?: boolean
}>()
</script>

<template>
  <span class="px-2">
    <IconTooltip :spec="statusDisplay[props.status]" :full="props.full" />
  </span>
</template>
