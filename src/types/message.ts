import { Thread } from "./thread";

export interface Message extends Thread {
    parentId: number;
    threadId: number;
    path: number[];
}
