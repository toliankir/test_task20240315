export const getApiUrl = (path: string, opts?: {
    searchPramas?: URLSearchParams,
    protocol?: "http" | "https" | "ws" | "wss"
}): URL => {
    const apiUrl = new URL(import.meta.env.VITE_API_URL || (window as any).apiUrl);
    apiUrl.pathname = path;
    switch (opts?.protocol) {
        case "ws":
        case "wss":
            if (apiUrl.protocol === 'http:') {
                apiUrl.protocol = 'ws:'
            }
            if (apiUrl.protocol === 'https:') {
                apiUrl.protocol = 'wss:'
            }
            break;
        default:
            break;
    }

    if (opts?.searchPramas) {
        for (const key of opts.searchPramas.keys()) {
            const value = opts.searchPramas.get(key)
            if (value) {
                apiUrl.searchParams.append(key, value);
            }
        }
    }

    return apiUrl;
}