<script setup lang="ts">
import { reactive } from 'vue';
import { router } from '../router';
import { makeRequest } from '../helpers/make-request';
import { wrapError } from '../helpers/wrap-error';

const state = reactive<{
    email: string;
    errorMessage: string | null;
}>({
    email: "",
    errorMessage: null,
});

async function startLoginFlow(e: any) {
    e.preventDefault();
    try {
        state.errorMessage = null;
        if (!state.email) {
            state.errorMessage = "Fill all data";
            return;
        }

        await makeRequest({
            path: "auth/start-login",
            method: "POST",
            data: {
                email: state.email,
            }
        });

        router.push('sign-in');
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}
</script>

<template>
    <div class="flex justify-center items-center flex-col">
        <p class="font-bold text-blue-700 uppercase">Sign up</p>
        <p class="text-blue-700">One time password will be send to your email, use it for login. (In develop version the password is 1234)</p>
        <form class="w-1/2 md:w-1/3">
            <div class="my-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="text" v-model="state.email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="test@mail.com" required />
            </div>

            <div class="text-center mt-5 mb-2">
                <button @click="startLoginFlow"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Sign up</button>
            </div>
        </form>
        <div v-if="state.errorMessage" class="font-semibold text-red-600">
            <p>Error: {{ state.errorMessage }}</p>
        </div>
    </div>
</template>

<style scoped></style>
