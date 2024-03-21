<script setup lang="ts">
import { useStore } from 'vuex';
import { AppStore } from '../store';
import { onMounted, onUnmounted, reactive } from 'vue';

const store = useStore<AppStore>();
const TOKEN_CHECK_INTERVAL = 5000;
const state = reactive<{
  tokenExpired: boolean;
}>({
  tokenExpired: false,
});

const checkToken = () => {
  if (store.state.token) {
    state.tokenExpired = new Date() > store.getters.getDataFromToken.exp;
  }
}
onMounted(() => {
  checkToken();
})

const interval = setInterval(() => checkToken(), TOKEN_CHECK_INTERVAL);

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto">
    <header class="px-2 border-b flex items-center justify-between h-14">
      <p class="uppercase font-bold text-blue-700">Test task 20240415</p>

      <div class="flex">
        <router-link class="mx-3 uppercase font-bold text-blue-700" to="/thread">Threads</router-link>
        <router-link v-if="!store.state.token" class="mr-5 uppercase font-bold text-blue-700" to="/sign-up">Sign
          in</router-link>
        <div v-if="store.state.token">
          <router-link class="mx-3 text-blue-700" to="/current-user">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6 inline-block">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span class="text-red-500" v-if="state.tokenExpired">Token expire!</span>
            <span v-if="store.state.token">({{ store.getters.getDataFromToken.email }})</span>
          </router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped></style>
