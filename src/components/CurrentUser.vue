<script setup lang="ts">
import { useStore } from 'vuex';
import { AppStore } from '../store';
import { router } from '../router';

const store = useStore<AppStore>();

const signOut = async () => {
    store.dispatch('signOut');
    router.push('/');
}

const refreshToken = async () => {
    await store.dispatch('refreshToken');
}
</script>

<template>
    <div class="flex justify-center items-center flex-col">
        <p class="font-bold text-blue-700 uppercase">Current user</p>
        <div v-if="store.state.token" class="w-1/2">
            <p class="my-2"><span class="font-bold">Email:</span> {{ store.getters.getDataFromToken.email }}</p>
            <p class="my-2 break-all"><span class="font-bold">Token:</span> {{ store.state.token }}</p>
            <p class="my-2"><span class="font-bold">Token expire at:</span> {{ store.getters.getDataFromToken.exp }}</p>
            <p class="my-2 break-all"><span class="font-bold">Refresh token:</span> {{ store.state.refreshToken }}</p>
            <p class="my-2"><span class="font-bold">Refresh token expire at:</span> {{
            store.getters.getDataFromRefreshToken.exp }}</p>


            <div class="text-center mt-5 mb-2 flex justify-around">
                <button @click="refreshToken"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Refresh token</button>

                <button @click="signOut"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Sign out</button>
            </div>

        </div>
        <div v-if="!store.state.token" class="w-1/2 md:w-1/3 text-center">
            <p>Require user sign in</p>
        </div>
    </div>
</template>

<style scoped></style>
