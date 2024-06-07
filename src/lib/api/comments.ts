import { Message } from "@/lib/interfaces";
import axios from "./axios";

export async function toggleCommentUpvote(postId: number, commentId: number): Promise<Message> {
    const { data } = await axios.post<Message>(`/posts/${postId}/comments/${commentId}/toggle-upvote`);
    return data;
}

export async function addNewComment(postId: number, commentContent: string): Promise<Message> {
    const { data } = await axios.post<Message>(`/posts/${postId}/comments`, {
        content: commentContent
    });
    return data;
}

export async function deleteComment(postId: number, commentId: number) {
    const { data } = await axios.delete<Message>(`/posts/${postId}/comments/${commentId}`,);
    return data;
}