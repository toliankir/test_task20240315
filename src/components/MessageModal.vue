<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { AppStore } from '../store';
import * as gqlBuilder from 'gql-query-builder';
import { getGraphqlClient } from '../helpers/graphql';
import gql from 'graphql-tag';
import { wrapError } from '../helpers/wrap-error';

const store = useStore<AppStore>();
const state = reactive<{
    errorMessage: string | null;
    name: string | null;
    text: string | null;
    homepage: string | null;
    htmlData: string | null;
}>({
    errorMessage: null,
    name: null,
    text: null,
    homepage: null,
    htmlData: null,
});


onMounted(() => {
    (window as any).mtcaptcha.renderUI();
})

const { replyTo, cancelReply } = defineProps(["replyTo", "cancelReply"]);

const createMessage = async () => {
    state.errorMessage = null;
    if (!store.state.token) {
        state.errorMessage = "Login first"
        return;
    }
    try {
        const token = (window as any).mtcaptcha.getVerifiedToken();
        if (!token) {
            state.errorMessage = `Fill captcha`;
            return;
        }
        if (!state.name || !state.text) {
            state.errorMessage = `Fill all required data`;
            return;
        }

        const { query, variables } = gqlBuilder.mutation({
            operation: 'saveMessage',
            fields: ["id"],
            variables: {
                message: {
                    value: {
                        email: store.getters.getDataFromToken.email,
                        homepage: state.homepage,
                        name: state.name,
                        replayToId: replyTo,
                        text: state.text,
                        captchaToken: token
                    },
                    type: "SaveMessageRequestDto",
                    required: true
                }
            }
        });

        await getGraphqlClient(store.state.token).mutate({ mutation: gql`${query}`, variables });
        cancelReply();
    } catch (e) {
        state.errorMessage = wrapError(e);
    }
}
</script>

<template>
    <div class="bg-gray-300 left-0 top-0 fixed w-full h-full bg-opacity-75 flex justify-center items-center z-50">
        <div class="w-full md:w-1/2 bg-white p-5 rounded">
            <p v-if="replyTo" class="font-bold text-blue-700">Replay to message {{ replyTo }}</p>
            <p v-if="!replyTo" class="font-bold text-blue-700">Create new thread</p>
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

            <div class="my-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Homepage</label>
                <input type="text" v-model="state.homepage"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="http://site.com" required />
            </div>

            <div class="mtcaptcha"></div>

            <div class="text-center mt-5 mb-2 flex justify-around">
                <button @click="cancelReply"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    Cancel</button>

                <button @click="createMessage"
                    class="bg-blue-700 hover:bg-blue-800 text-white hover:cursor-pointer inline-block px-5 py-2.5 font-semibold rounded-lg">
                    {{ replyTo ? "Replay" : "Create" }}
                </button>
            </div>
            <div v-if="state.errorMessage" class="font-semibold text-red-600">
                <p>Error: {{ state.errorMessage }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
