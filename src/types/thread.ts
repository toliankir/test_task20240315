import { MessageFile } from "./message-file";

export interface Thread {
    id: number;
    name: string;
    email: string;
    homepage: string | null;
    text: string;
    files: MessageFile[];
    createdAt: string;
}
