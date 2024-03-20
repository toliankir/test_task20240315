<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { AppStore } from '../store';
import { useStore } from 'vuex';
import { makeRequest } from '../helpers/make-request';
import { wrapError } from '../helpers/wrap-error';
import { useRoute } from 'vue-router';
import { Message } from '../types/message';


const limit = 25;

const state = reactive<{
    errorMessage: string | null;
    messages: Message[];
    offset: number;
    name: string | null;
    text: string | null;
    replyToId: number | null
}>({
    errorMessage: null,
    messages: [],
    offset: 0,
    name: null,
    text: null,
    replyToId: null,
});

const route = useRoute();
const store = useStore<AppStore>();

onMounted(() => {
    if (route.params.id) {
        fetchMessages(parseInt(route.params.id.toString()), 0, limit)
    }
});

const fetchMessages = async (thradId: number, offset: number, limit: number) => {
    state.errorMessage = null;
    if (!store.state.token) {
        state.errorMessage = "Login first"
        return;
    }
    try {
        const result = await makeRequest<Message[]>({
            path: `/message/thread/${thradId}/message`,
            method: "GET",
            token: store.state.token!,
            query: {
                offset,
                limit,
            }
        });

        state.messages = result;
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}

const getMessagePadding = (message: Message) => {
    return {
        "padding-left": `${(message.path.length - 1) * 35}px`
    };
}

const getDate = (message: Message) => {
    return new Date(message.createdAt).toLocaleString();
}

const showReply = (message: Message) => {
    state.replyToId = message.id;
}

const reply = async (e: any) => {
    e.preventDefault()
    state.errorMessage = null;
    if (!store.state.token) {
        state.errorMessage = "Login first"
        return;
    }
    try {
        await makeRequest({
            path: `/message`,
            method: "POST",
            token: store.state.token!,
            data: {
                name: state.name,
                email: store.getters.getDataFromToken.email,
                text: state.text,
                replayToId: state.replyToId
            }
        });
        await fetchMessages(parseInt(route.params.id.toString()), state.offset, limit);
        state.replyToId = null;
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}

const cancelReply = (e: any) => {
    e.preventDefault();
    state.replyToId = null;
}
</script>

<template>
    <div class="flex justify-center items-center flex-col relative">
        <p class="font-bold text-blue-700 uppercase">Messages</p>
        <div class="my-2 w-full" v-for="message of state.messages" :style="getMessagePadding(message)">
            <div class="bg-gray-200 p-3 flex w-full rounded items-center">
                <div class="w-1/5 flex items-center">
                    <span
                        class="bg-gray-300 mr-3 rounded-full w-10 h-10 flex justify-center items-center font-bold uppercase border-4 border-white">{{
            message.id }}</span>
                    <span class="font-bold">{{ message.name }}</span>
                </div>
                <span class="font-bold w-1/5">{{ message.email }}</span>
                <span class="text-sm w-2/5">{{ getDate(message) }}</span>
                <div class="text-sm w-1/5 text-right">
                    <button @click="showReply(message)"
                        class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-4 py-2 font-semibold rounded-lg">
                        Replay</button>
                </div>
            </div>
            <div class="p-2">
                {{ message.text }}
            </div>
        </div>
    </div>
    <div v-if="state.errorMessage" class="font-semibold text-red-600">
        <p>Error: {{ state.errorMessage }}</p>
    </div>
    <div v-if="state.replyToId"
        class="bg-gray-300 left-0 top-0 fixed w-full h-full bg-opacity-75 flex justify-center items-center z-50">
        <form class="w-full md:w-1/2 bg-white p-5 rounded">
            <p class="font-bold text-blue-700">Replay to message {{ state.replyToId }}</p>
            <div class="my-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input type="text" v-model="state.name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Name" required />
            </div>

            <div class="my-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="text" :value="store.getters.getDataFromToken.email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="test@mail.com" disabled />
            </div>

            <div class="my-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Text</label>
                <textarea type="text" v-model="state.text"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Text" required>
                    </textarea>
            </div>

            <div class="text-center mt-5 mb-2 flex justify-around">
                <button @click="cancelReply"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Cancel</button>

                <button @click="reply"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Replay</button>
            </div>
        </form>
    </div>
</template>

<style scoped></style>
