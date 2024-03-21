<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { AppStore } from '../store';
import { useStore } from 'vuex';
import { wrapError } from '../helpers/wrap-error';
import { Thread } from '../types/thread';
import gql from 'graphql-tag';
import * as gqlBuilder from 'gql-query-builder';
import { getGraphqlClient } from '../helpers/graphql';
import { getDate } from '../helpers/get-date';
import Modal from './Modal.vue';

type SortColumn = 'name' | 'email' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const limit = 10;
const store = useStore<AppStore>();

const state = reactive<{
    errorMessage: string | null;
    threads: Thread[];
    offset: number;
    sortColumn: SortColumn;
    sortOrder: SortOrder;
    showCreateThread: boolean;
}>({
    errorMessage: null,
    threads: [],
    offset: 0,
    sortColumn: 'createdAt',
    sortOrder: 'desc',
    showCreateThread: false,
});

onMounted(async () => {
    fetchThreads();

    getGraphqlClient().subscribe({
        query: gql`subscription {
                    messageAdd { id } }`
    }).subscribe(
        () => { 
            if (state.offset === 0) {
                fetchThreads();
            }
         },
    )
});

const fetchThreads = async () => {
    state.errorMessage = null;
    try {
        const { query, variables } = gqlBuilder.query({
            operation: 'threads',
            fields: ["id", "name", "email", "text", "createdAt"],
            variables: {
                sort: {
                    value: {
                        column: state.sortColumn,
                        order: state.sortOrder,
                    },
                    type: "SortRequestDto"
                }
            }
        });
        const { data }
            = await getGraphqlClient().query({ query: gql`${query}`, variables });
        state.threads = data.threads;
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}

const fetchNext = () => {
    if (state.threads.length === limit) {
        state.offset = state.offset + limit;
        fetchThreads()
    }
}

const fetchPrev = () => {
    if (state.offset > 0) {
        state.offset = state.offset - limit;
        fetchThreads()
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

const showSort = (column: SortColumn, order: SortOrder) => {
    return state.sortColumn === column && state.sortOrder === order;
}

const setSort = (column: SortColumn) => {
    if (state.sortColumn === column) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        state.sortColumn = column;
        state.sortOrder = 'desc'
    }
    fetchThreads()
}

const showCreateThread = () => {
    state.errorMessage = null;
    if (!store.state.token) {
        state.errorMessage = "Login first";
        return;
    }
    state.showCreateThread = true;
}

const cancelCreateThread = () => {
    state.showCreateThread = false;
}
</script>

<template>
    <Modal v-if="state.showCreateThread" :reply-to="null" :cancel-reply="cancelCreateThread" />
    <div v-if="state.errorMessage" class="font-semibold text-red-600">
        <p>Error: {{ state.errorMessage }}</p>
    </div>
    <div class="flex justify-center items-center flex-col relative">
        <div class="flex w-full">
            <div class="w-1/3"></div>
            <div class="w-1/3 text-center font-bold text-blue-700 uppercase">Threads</div>
            <div class="w-1/3 text-right">
                <button @click="showCreateThread"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-4 py-2 font-semibold rounded-lg">
                    Create thread</button>
            </div>
        </div>

        <div class="flex w-full mt-3 select-none">
            <div @click="setSort('name')" class="w-1/5 pl-16 flex text-blue-700 hover:cursor-pointer">Name
                <svg v-if="showSort('name', 'asc')" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
                <svg v-if="showSort('name', 'desc')" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
            <div @click="setSort('email')" class="w-1/5 flex text-blue-700 hover:cursor-pointer">Email
                <svg v-if="showSort('email', 'asc')" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
                <svg v-if="showSort('email', 'desc')" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
            <div @click="setSort('createdAt')" class="w-1/5 flex text-blue-700 hover:cursor-pointer">Created at
                <svg v-if="showSort('createdAt', 'asc')" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
                <svg v-if="showSort('createdAt', 'desc')" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </div>
        <div class="w-full my-2" v-for="thread of state.threads">
            <router-link :to=getRoute(thread)>
                <div class="bg-gray-200 hover:bg-gray-300 p-3 flex w-full rounded items-center">
                    <div class="w-1/5 flex items-center">
                        <span
                            class="bg-gray-300 mr-3 rounded-full w-10 h-10 flex justify-center items-center font-bold uppercase border-4 border-white text-sm">{{
        thread.id }}</span>
                        <span class="font-bold">{{ thread.name }}</span>
                    </div>
                    <span class="font-bold w-1/5">{{ thread.email }}</span>
                    <span class="text-sm w-1/5">{{ getDate(thread) }}</span>
                    <span class="w-2/5 text-sm bg-red">{{ thread.text }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped></style>
