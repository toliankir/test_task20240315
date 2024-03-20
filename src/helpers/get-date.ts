import { Message } from "../types/message";
import { Thread } from "../types/thread";

export const getDate = (message: Message | Thread) => {
    return new Date(message.createdAt).toLocaleString();
}