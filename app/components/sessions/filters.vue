<script setup lang="ts">
import type { Filters } from "@/types/filters"
import {
  filterItems,
  formatDisplay,
  languageDisplay,
  statusDisplay,
} from "~/utils/sessionDisplay"

const model = defineModel<Filters>({ required: true })

const open = ref(false)

const formatItems = filterItems(formatDisplay)
const statusItems = filterItems(statusDisplay)
const languageItems = filterItems(languageDisplay)

const hasAnyFilters = computed(() =>
  Boolean(
    model.value.format ||
    model.value.status ||
    model.value.language ||
    (model.value.city ?? "").trim() ||
    (model.value.county ?? "").trim(),
  ),
)

function clearAll() {
  model.value = {
    format: undefined,
    status: undefined,
    language: undefined,
    city: undefined,
    county: undefined,
  }
}
</script>

<template>
  <UCollapsible v-model:open="open" class="rounded-lg border border-default/60">
    <!-- trigger -->
    <UButton
      variant="ghost"
      color="neutral"
      class="w-full justify-between"
      trailing-icon="i-lucide-chevron-down"
    >
      <div class="flex items-center gap-3 min-w-0">
        <span class="font-semibold whitespace-nowrap">Filters</span>

        <div class="flex flex-wrap items-center gap-2 min-w-0">
          <UBadge v-if="model.format" variant="subtle">
            Format: {{ model.format }}
            <UButton
              size="xs"
              variant="link"
              icon="i-lucide-x"
              @click.stop="model.format = undefined"
            />
          </UBadge>

          <UBadge v-if="model.status" variant="subtle">
            Status: {{ model.status }}
            <UButton
              size="xs"
              variant="link"
              icon="i-lucide-x"
              @click.stop="model.status = undefined"
            />
          </UBadge>

          <UBadge v-if="model.language" variant="subtle">
            Language: {{ model.language }}
            <UButton
              size="xs"
              variant="link"
              icon="i-lucide-x"
              @click.stop="model.language = undefined"
            />
          </UBadge>

          <UBadge v-if="(model.city ?? '').trim()" variant="subtle">
            City: {{ model.city }}
            <UButton
              size="xs"
              variant="link"
              icon="i-lucide-x"
              @click.stop="model.city = undefined"
            />
          </UBadge>

          <UBadge v-if="(model.county ?? '').trim()" variant="subtle">
            County: {{ model.county }}
            <UButton
              size="xs"
              variant="link"
              icon="i-lucide-x"
              @click.stop="model.county = undefined"
            />
          </UBadge>
        </div>
      </div>

      <template #trailing>
        <div class="flex items-center gap-2">
          <UButton
            v-if="hasAnyFilters"
            size="xs"
            variant="ghost"
            color="neutral"
            icon="i-lucide-eraser"
            @click.stop="clearAll"
          >
            Clear
          </UButton>
          <UIcon
            name="i-lucide-chevron-down"
            class="transition-transform duration-200"
          />
        </div>
      </template>
    </UButton>

    <template #content>
      <div class="p-3 border-t border-default/60">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <UCard>
            <template #header>Format</template>
            <USelectMenu
              v-model="model.format"
              :items="formatItems"
              value-key="value"
              label-key="label"
              placeholder="Any"
              class="w-full"
              :ui="{ content: 'min-w-72' }"
            />
          </UCard>

          <UCard>
            <template #header>Status</template>
            <USelectMenu
              v-model="model.status"
              :items="statusItems"
              value-key="value"
              label-key="label"
              placeholder="Any"
              class="w-full"
              :ui="{ content: 'min-w-72' }"
            />
          </UCard>

          <UCard>
            <template #header>Language</template>
            <USelectMenu
              v-model="model.language"
              :items="languageItems"
              value-key="value"
              label-key="label"
              placeholder="Any"
              class="w-full"
              :ui="{ content: 'min-w-72' }"
            />
          </UCard>

          <UCard>
            <template #header>Location</template>
            <div class="flex flex-col gap-3">
              <UInput v-model="model.city" placeholder="City" />
              <UInput v-model="model.county" placeholder="County" />
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UCollapsible>
</template>
