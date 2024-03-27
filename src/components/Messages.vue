<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { AppStore } from '../store';
import { useStore } from 'vuex';
import { wrapError } from '../helpers/wrap-error';
import { useRoute } from 'vue-router';
import { Message } from '../types/message';
import { getGraphqlClient } from '../helpers/graphql';
import gql from 'graphql-tag';
import * as gqlBuilder from 'gql-query-builder';
import { getDate } from '../helpers/get-date';
import MessageModal from './MessageModal.vue';
import Upload from './Upload.vue';
import FilePreview from './FilePreview.vue';

const route = useRoute();
const store = useStore<AppStore>();
const graphClient = getGraphqlClient();

const limit = 25;
const threadId = parseInt(route.params.id.toString());

const state = reactive<{
    errorMessage: string | null;
    messages: Message[];
    offset: number;
    replyToId: number | null
}>({
    errorMessage: null,
    messages: [],
    offset: 0,
    replyToId: null,
});

onMounted(async () => {
    await fetchMessages(threadId, 0, limit);

    graphClient.subscribe({
        query: gql`subscription {
                    messageAdd { 
                        id
                        path
                    } }`
    }).subscribe(
        ({ data }) => {
            if (data.messageAdd?.path && Array.isArray(data.messageAdd.path)) {
                const path = data.messageAdd.path as number[];
                const pathStr = path.slice(0, path.length - 1).join();
                const sameMessage = state.messages.find(e => e.path.join('').indexOf(pathStr) === 0);
                if (sameMessage) {
                    fetchMessages(threadId, state.offset, limit);
                }
            }
        },
    );

    graphClient.subscribe({
        query: gql`subscription {
                    fileUploaded { 
                        messageId
                        filename
                        mime
                    } }`
    }).subscribe(
        ({ data }) => {
            const updatedMessage = state.messages.find(e => e.id === data.fileUploaded.messageId);
            if (updatedMessage && !updatedMessage.files.includes(data.fileUploaded.filename)) {
                fetchMessages(threadId, state.offset, limit);
            }
        },
    );
});

const fetchMessages = async (thradId: number, offset: number, limit: number) => {
    state.errorMessage = null;
    try {
        const { query, variables } = gqlBuilder.query({
            operation: 'threadMessages',
            fields: ["id", "name", "email", "text", "createdAt", "path", { files: ["filename", "mime"] }],
            variables: {
                id: { value: thradId, type: "Float", required: true },
                pagination: {
                    value: {
                        offset,
                        limit,
                    },
                    type: "PaginationRequestDto"
                }
            }
        });

        const result
            = await graphClient.query({ query: gql`${query}`, variables, fetchPolicy: 'network-only' });

        if (result.data.threadMessages.length > 0) {
            state.messages = result.data.threadMessages;
        }
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}

const getMessagePadding = (message: Message) => {
    return {
        "padding-left": `${(message.path.length - 1) * 35}px`
    };
}

const showReply = (message: Message) => {
    if (!store.state.token) {
        state.errorMessage = "Login first";
        return;
    }
    state.replyToId = message.id;
}

const cancelReply = () => {
    state.replyToId = null;
}

const next = () => {
    if (state.messages.length === limit) {
        state.offset = state.offset + limit;
        fetchMessages(parseInt(route.params.id.toString()), state.offset, limit);
    }
}

const prev = () => {
    if (state.offset > 0) {
        state.offset = state.offset - limit;
        fetchMessages(parseInt(route.params.id.toString()), state.offset, limit)
    }
}
</script>

<template>
    <MessageModal v-if="state.replyToId" :reply-to="state.replyToId" :cancel-reply="cancelReply" />
    <div v-if="state.errorMessage" class="font-semibold text-red-600">
        <p>Error: {{ state.errorMessage }}</p>
    </div>
    <div class="flex justify-center items-center flex-col relative">
        <p class="font-bold text-blue-700 uppercase">Messages</p>
        <div class="my-2 w-full" v-for="message of state.messages" :style="getMessagePadding(message)">
            <div class="bg-gray-200 p-3 flex w-full rounded items-center">
                <div class="w-1/5 flex items-center">
                    <span
                        class="bg-gray-300 mr-3 rounded-full w-10 h-10 flex justify-center items-center font-bold uppercase border-4 border-white text-sm">{{
        message.id }}</span>
                    <span class="font-bold">{{ message.name }}</span>
                </div>
                <span class="font-bold w-1/5">{{ message.email }}</span>
                <span class="text-sm w-2/5">{{ getDate(message) }}</span>

                <div class="text-sm w-1/5 text-right flex items-center justify-end">
                    <Upload :message-id="message.id" />
                    <button @click="showReply(message)"
                        class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-4 py-2 font-semibold rounded-lg">
                        Replay</button>
                </div>
            </div>
            <div class="p-2" v-html="message.text"></div>
            <div v-if="message.files.length > 0" class="p-2 bg-blue-100 rounded">
                <p class="text-sm">Attached files:</p>
                <FilePreview v-for="file of message.files" :file="file" :message-id="message.id" />
            </div>
        </div>
        <div class="flex">
            <p @click="prev" class="text-blue-700 select-none font-bold mx-3 hover:cursor-pointer">Prev</p>
            <p @click="next" class="text-blue-700 select-none font-bold mx-3 hover:cursor-pointer">Next</p>
        </div>
    </div>
</template>

<style scoped></style>
