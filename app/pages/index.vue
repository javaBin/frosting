<script setup lang="ts">
import {Icon} from "@iconify/vue";
</script>

<template>
  <v-container class="my-12">
    <v-banner>
      <v-banner-icon>
        <img src="~/assets/marius_duke.svg" alt="Duke"/>
      </v-banner-icon>
      <v-banner-text>
        <h1 class="text-h1">Cupcake</h1>
        <p class="my-6 text-body-1">Access to all the JavaZone talks through the years</p>

        <v-btn href="/login">
          <template v-slot:prepend>
            <Icon icon="logos:slack-icon"/>
          </template>
          Sign in with slack
        </v-btn>

      </v-banner-text>
    </v-banner>

  </v-container>
</template>