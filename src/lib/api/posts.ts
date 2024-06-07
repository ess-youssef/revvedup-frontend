import { PaginatedResponse, Post, Message, Comment, NewPostData } from "../interfaces";
import axios from "./axios";

export async function getPosts(page: number = 1): Promise<PaginatedResponse<Post>> {
    const { data } = await axios.get<PaginatedResponse<Post>>("/posts", {
        params: { page }
    });
    return data;
}

export async function getUserPosts(userId: number, page: number = 1): Promise<PaginatedResponse<Post>> {
    const { data } = await axios.get<PaginatedResponse<Post>>(`/users/${userId}/posts`, {
        params: { page }
    });
    return data;
}

export async function createPost(newPost: NewPostData): Promise<Post> {
    const { data } = await axios.post<Post>(`/posts`, newPost);
    return data;
}

export async function editPost(postId: number, editedPost: NewPostData): Promise<Post> {
    const { data } = await axios.put<Post>(`/posts/${postId}`, editedPost);
    return data;
}

export async function getPostDetails(postId: number): Promise<Post> {
    const { data } = await axios.get<Post>(`/posts/${postId}`);
    return data;
}

export async function getPostComments(postId: number, page: number = 1): Promise<PaginatedResponse<Comment>> {
    const { data } = await axios.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments`, {
        params: { page }
    });
    return data;
}

export async function deletePost(postId: number): Promise<Message> {
    const { data } = await axios.delete<Message>(`/posts/${postId}`);
    return data;
}

export async function togglePostUpvote(postId: number): Promise<Message> {
    const { data } = await axios.post<Message>(`/posts/${postId}/toggle-upvote`);
    return data;
}