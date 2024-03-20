<script setup lang="ts">
  import Header from './components/Header.vue';
</script>

<template>
  <div class="max-w-screen-xl mx-auto">
    <Header />
  </div>

  <div class="relative max-w-screen-xl mx-auto p-3">
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
