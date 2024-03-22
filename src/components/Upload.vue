<script setup lang="ts">
import { reactive } from 'vue';
import { useStore } from 'vuex';
import { AppStore } from '../store';
import { wrapError } from '../helpers/wrap-error';
import { makeRequest } from '../helpers/make-request';

const { messageId } = defineProps(["messageId"]);
const store = useStore<AppStore>();
const state = reactive<{
    files: any,
    errorMessage: string | null;
    show: boolean;
}>({
    errorMessage: null,
    files: null,
    show: false,
});

const fileChange = (e: any) => {
    state.files = e.target.files;
}

const hide = () => {
    state.show = false;
}

const show = () => {
    state.show = true;
}

const upload = async () => {
    try {
        if (!store.state.token) {
            state.errorMessage = "Login first";
            return;
        }
        if (!state.files) {
            state.errorMessage = "Select a file";
            return;
        }
        const formData = new FormData();
        formData.set('messageId', messageId);
        formData.append('file', state.files[0], state.files[0].name);

        await makeRequest<{
            token: string;
            refreshToken: string;
        }>({
            path: "file/upload",
            method: "POST",
            token: store.state.token,
            data: formData
        });

        hide();
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}
</script>

<template>
    <div>
        <svg @click="show" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6 stroke-blue-700 hover:cursor-pointer mr-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
    </div>
    <div v-if="state.show"
        class="bg-gray-300 left-0 top-0 fixed w-full h-full bg-opacity-75 flex justify-center items-center z-50">
        <div class="w-full md:w-1/2  bg-white p-5 rounded text-left text-base">
            <p class="font-bold text-blue-700">Upload file for message {{ messageId }}</p>
            <div class="mt-3 mb-10">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File</label>
                <input @change="fileChange" type="file" class="block w-full text-gray-900 text-sm
                  file:mr-4 file:py-2.5 file:px-5 file:rounded-lg
                  file:border-0 file:text-sm
                  file:bg-blue-700 file:text-white
                  hover:file:bg-puple-800" />
            </div>
            <div class="text-center mt-5 mb-2 flex justify-around">
                <button @click="hide"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Cancel</button>
                <button @click="upload"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Upload
                </button>
            </div>
            <div v-if="state.errorMessage" class="font-semibold text-red-600">
                <p>Error: {{ state.errorMessage }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
