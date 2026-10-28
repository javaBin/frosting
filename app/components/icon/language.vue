<script setup lang="ts">
import type { Language } from "@/types/session"
import { languageDisplay } from "~/utils/sessionDisplay"

const props = defineProps<{
  language: Language
  full?: boolean
}>()
</script>

<template>
  <span class="px-2">
    <IconTooltip :spec="languageDisplay[props.language]" :full="props.full" />
  </span>
</template>
