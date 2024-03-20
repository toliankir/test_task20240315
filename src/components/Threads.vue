<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { AppStore } from '../store';
import { useStore } from 'vuex';
import { makeRequest } from '../helpers/make-request';
import { wrapError } from '../helpers/wrap-error';
import { Thread } from '../types/thread';

const limit = 10;
const store = useStore<AppStore>();

const state = reactive<{
    errorMessage: string | null;
    threads: Thread[],
    offset: number,
}>({
    errorMessage: null,
    threads: [],
    offset: 0,
});




onMounted(() => {

    // fetchArticles()
});

const fetchArticles = async () => {
    if (!store.state.token) {
        state.errorMessage = "Login first"
        return;
    }
    try {
        const result = await makeRequest<Thread[]>({
            path: "/message/thread",
            method: "GET",
            token: store.state.token!,
            query: {
                offset: state.offset,
                limit: limit
            }
        });
        if (result.length === 0) {
            return;
        }
        state.threads = result;
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}

const fetchNext = () => {
    if (state.threads.length === limit) {
        state.offset = state.offset + limit;
        fetchArticles()
    }
}

const fetchPrev = () => {
    if (state.offset > 0) {
        state.offset = state.offset - limit;
        fetchArticles()
    }
}

const getRoute = (thread: Thread) => {
    return {
        name: "threadMessage",
        params: {
            id: thread.id
        }
    }
}
</script>

<template>

    <div class="flex justify-center items-center flex-col relative">
        <p class="font-bold text-blue-700 uppercase">Threads</p>
        <div class="w-full my-2" v-for="thread of state.threads">
            <router-link :to=getRoute(thread)>
                <div class="bg-gray-200 p-3 flex w-full rounded items-center">
                    <div class="w-1/5 flex items-center">
                        <span
                            class="bg-gray-300 mr-3 rounded-full w-10 h-10 flex justify-center items-center font-bold uppercase border-4 border-white">{{
            thread.id }}</span>
                        <span class="font-bold">{{ thread.name }}</span>
                    </div>
                    <span class="font-bold w-1/5">{{ thread.email }}</span>
                    <span class="text-sm w-1/5">{{ thread.createdAt }}</span>
                    <span class="w-2/5 text-sm bg-red">{{ thread.text }}</span>
                </div>
            </router-link>
        </div>
    </div>
    <div v-if="state.errorMessage" class="font-semibold text-red-600">
        <p>Error: {{ state.errorMessage }}</p>
    </div>
</template>

<style scoped></style>
