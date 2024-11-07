<script setup lang="ts">

const emit = defineEmits<{
  selectConference: [value: Conference]
}>()

const {
  data: conferences
} = await useFetch<Conference[]>(`http://localhost:8080/api/conferences`)

const selected = ref<Conference | undefined>()

const menuTitle = computed(() => {
  if (selected.value === undefined) {
    return "Select conference";
  }

  return selected.value.name
})

const chooseConference = (conference: Conference) => {
  selected.value = conference;

  emit('selectConference', conference)
}

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
          {{ menuTitle }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
            v-for="(item, index) in conferences"
            :key="index"
            :value="index"
        >
          <v-list-item-title @click="chooseConference(item)">{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer />

    <NavThemeToggle/>
  </v-toolbar>
</template>
