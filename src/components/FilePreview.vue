<script setup lang="ts">
import { reactive } from 'vue';
import { getFileLink } from '../helpers/get-file-link';
import { MessageFile } from '../types/message-file';

const { file, messageId } = defineProps(["file", "messageId"]);
const state = reactive<{
    show: boolean;
}>({
    show: false,
});

const hide = () => {
    state.show = false;
}

const show = () => {
    state.show = true;
}

const isImage = (file: MessageFile): boolean => {
    return ['image/jpeg', 'image/png'].includes(file.mime)
}
</script>

<template>
    <span @click="show" class="text-sm mx-2 underline hover:cursor-pointer">
        {{ file.filename }}
    </span>
    <div v-if="state.show"
        class="bg-gray-300 left-0 top-0 fixed w-full h-full bg-opacity-75 flex justify-center items-center z-50">
        <div class="w-full md:w-1/2  bg-white p-5 rounded text-left text-base">
            <p class="font-bold text-blue-700">{{ file.filename }}</p>
            <div class="w-full flex justify-center items-center m-3">
                <img v-if="isImage(file)" :src="getFileLink(file.filename, messageId)">
                <a class="underline text-blue-700 hoder:cursor-pointer" v-if="!isImage(file)" target="_blank" :href="getFileLink(file.filename, messageId)">{{ getFileLink(file.filename,
        messageId) }}</a>
            </div>
            <div class="text-center mt-5 mb-2 flex justify-around">
                <button @click="hide"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Close</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
