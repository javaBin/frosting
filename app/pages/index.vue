<script setup lang="ts">
</script>

<template>
<div v-if="$attrs.conference">
  <Event :conference="$attrs.conference" />
</div>

</template>