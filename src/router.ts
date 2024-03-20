import { createRouter, createWebHistory } from "vue-router";
import Messages from './components/Messages.vue';
import SignUp from './components/SignUp.vue';
import SignIn from './components/SignIn.vue';
import CurrentUser from './components/CurrentUser.vue';
import Main from './components/Main.vue';
import Threads from './components/Threads.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { name: "main", path: '/', component: Main },
        { name: "signUp", path: '/sign-up', component: SignUp },
        { name: "signIn", path: '/sign-in', component: SignIn },
        { name: "currentUser", path: '/current-user', component: CurrentUser },
        { name: "thread", path: '/thread', component: Threads },
        { name: "threadMessage", path: '/thread/:id/message', component: Messages },
    ]
})
