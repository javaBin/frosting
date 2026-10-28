<template>
  <div>
    <Nav />

    <!-- Same side padding as the header's container but no max width: the
         session table needs the full window on wide screens -->
    <main class="flex-1 px-4 py-4 sm:px-6 lg:px-8">
      <slot></slot>
    </main>
  </div>
</template>
<script setup lang="ts"></script>
