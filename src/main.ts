import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { store } from './store';
import { router } from './router';

const app = createApp(App);

store.commit('initialiseStore');

app.use(router);
app.use(store);

app.mount('#app');

