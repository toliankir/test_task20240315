export const getApiUrl = (): string => {
    return import.meta.env.VITE_API_URL || (window as any).apiUrl;
}