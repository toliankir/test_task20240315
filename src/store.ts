import { createStore } from "vuex";
import { makeRequest } from "./helpers/make-request";
import { parseToken } from "./helpers/parse-token";
import { wrapError } from "./helpers/wrap-error";
export interface AppStore {
    token: string | null;
    refreshToken: string | null;
    error: string | null;
}

export const store = createStore<AppStore>({
    state() {
        return {
            token: null,
            refreshToken: null,
            error: null,
        }
    },
    mutations: {
        initialiseStore(state) {
            if (localStorage.getItem('store')) {
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem('store')!))
                );
            }
        },
        setTokens(state: AppStore, opts: { token: string, refreshToken: string }) {
            state.token = opts.token;
            state.refreshToken = opts.refreshToken;
        },
        setError(state: AppStore, error: string | null) {
            state.error = error;
        }
    },
    actions: {
        async signIn(context, opts: {
            email: string;
            password: string;
        }): Promise<void> {
            try {
                context.commit('setError', null);

                const result = await makeRequest<{
                    token: string;
                    refreshToken: string;
                }>({
                    path: "auth/login",
                    method: "POST",
                    data: {
                        username: opts.email,
                        password: opts.password
                    }
                });

                context.commit('setTokens', {
                    token: result.token,
                    refreshToken: result.refreshToken
                });
            } catch (e) {
                context.commit('setError', wrapError(e));
            }
        },
        async refreshToken(context): Promise<void> {
            if (!this.state.refreshToken) {
                throw new Error("Login first");
            }
            const result = await makeRequest<{
                token: string;
                refreshToken: string;
            }>({
                path: "auth/refresh",
                method: "GET",
                token: this.state.refreshToken
            });

            context.commit('setTokens', {
                token: result.token,
                refreshToken: this.state.refreshToken
            });
        },
        signOut(context) {
            context.commit('setTokens', {
                token: null,
                refreshToken: null
            });
        }
    },
    getters: {
        getDataFromToken(state) {
            return parseToken(state.token);
        },
        getDataFromRefreshToken(state) {
            return parseToken(state.refreshToken);
        },
    }
});

store.subscribe((_mutation, state) => {
    localStorage.setItem('store', JSON.stringify(state));
});
