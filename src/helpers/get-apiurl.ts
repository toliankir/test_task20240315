export const getApiUrl = (path: string, opts?: {
    searchPramas?: URLSearchParams,
    protocol?: "http" | "ws"
}): URL => {
    const apiUrl = new URL(import.meta.env.VITE_API_URL || (window as any).apiUrl);
    apiUrl.pathname = path;
    apiUrl.protocol = opts?.protocol ? `${opts.protocol}:` : "http:";

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