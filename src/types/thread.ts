export interface Thread {
    id: number;
    name: string;
    email: string;
    homepage: string | null;
    text: string;
    files: string[];
    createdAt: string;
}
