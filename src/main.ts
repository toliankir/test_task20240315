import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { store } from './store';
import { router } from './router';
import { InMemoryCache } from '@apollo/client';
import { createApolloProvider } from '@vue/apollo-option';
import VueApolloComponents from '@vue/apollo-components'

const app = createApp(App);

const cache = new InMemoryCache()
const apolloClient = createApollo({
    cache,
    uri: 'http://localhost:3000/graphql'
})

const apolloProvider = createApolloProvider({
    defaultClient: apolloClient,
})

store.commit('initialiseStore');

app.use(router);
app.use(store);
app.use(apolloProvider);
app.use(VueApolloComponents)

app.mount('#app');
function createApollo(arg0: { cache: InMemoryCache; uri: string; }) {
    throw new Error('Function not implemented.');
}

