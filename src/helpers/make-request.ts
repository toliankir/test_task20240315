import { getApiUrl } from "./get-apiurl";

export const makeRequest = async <T>(opts: {
    path: string;
    method: "POST" | "GET" | "DELETE" | "PUT";
    data?: { [key: string]: unknown }
    token?: string;
    query?: { [key: string]: string | number }
}): Promise<T> => {

    const apiUrl = getApiUrl();
    const options: RequestInit = {
        method: opts.method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (opts.data) {
        options.body = JSON.stringify(opts.data);
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

    const req = await fetch(`${apiUrl}${opts.path}${ searchParams ? `?${searchParams.toString()}` : ""}`, options);
    if (req.status >= 300) {
        throw new Error(`${req.status}: ${req.statusText}`);
    }

    const obj = await req.json();
    return obj;
}