<script setup lang="ts">
import type { Format } from "@/types/session"
import { formatDisplay } from "~/utils/sessionDisplay"

const props = defineProps<{
  format: Format
  full?: boolean
}>()
</script>

<template>
  <span class="px-2">
    <IconTooltip :spec="formatDisplay[props.format]" :full="props.full" />
  </span>
</template>
