<script setup lang="ts">
import type { DisplaySpec } from "~/utils/sessionDisplay"

const props = defineProps<{
  spec?: DisplaySpec
  full?: boolean
}>()
</script>

<template>
  <span v-if="props.spec" class="inline-flex items-center gap-1.5">
    <UTooltip :text="props.spec.description">
      <Icon :name="props.spec.icon" class="cursor-help shrink-0" />
    </UTooltip>

    <span v-if="props.full" class="text-sm">
      {{ props.spec.description }}
    </span>
  </span>
</template>
