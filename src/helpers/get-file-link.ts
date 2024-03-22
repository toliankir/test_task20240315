export const getFileLink = (filename: string, messageId: number): string => {
    const apiUrl = new URL(import.meta.env.VITE_API_URL || (window as any).apiUrl);
    apiUrl.pathname = `file/${messageId}/${filename}`;
    return apiUrl.toString();
} 