import { getApiUrl } from "./get-apiurl";

export const makeRequest = async <T>(opts: {
    path: string;
    method: "POST" | "GET" | "DELETE" | "PUT";
    data?: { [key: string]: unknown } | FormData
    token?: string;
    query?: { [key: string]: string | number }
}): Promise<T> => {

    const apiUrl = getApiUrl(opts.path);
    const options: RequestInit = {
        method: opts.method,
    };

    if (opts.data) {
        options.body = opts.data instanceof FormData ? opts.data : JSON.stringify(opts.data);
    }

    if (!(opts.data instanceof FormData)) {
        options.headers = {
            "Content-Type": "application/json"
        }
    }
    if (opts.token) {
        options.headers = {
            "Authorization": `Bearer ${opts.token}`,
            ...options.headers,
        }
    }

    let searchParams: URLSearchParams | null = null;
    if (opts.query) {
        searchParams = new URLSearchParams();
        for (const key of Object.keys(opts.query)) {
            searchParams.append(key, opts.query[key].toString());
        }
    }

    const req = await fetch(apiUrl, options);
    if (req.status >= 300) {
        let msg;
        try {
            msg = await req.json();
        } catch (e) {
            throw new Error(`${req.status}: ${req.statusText}`);
        }
        if (msg.message) {
            throw new Error(`${req.status}: ${msg.message}`);
        }
        throw new Error(`${req.status}: ${req.statusText}`);
    }

    const obj = await req.json();
    return obj;
}