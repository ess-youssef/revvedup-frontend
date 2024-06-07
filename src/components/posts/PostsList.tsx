import { InfiniteData } from "@tanstack/react-query";
import PostCard from "./PostCard";
import { PaginatedResponse, Post } from "@/lib/interfaces";

interface PostsListProps {
    data: InfiniteData<PaginatedResponse<Post>>;
    edit?: boolean;
}

export default function PostsList({ data, edit }: PostsListProps) {
    return (
        <div className="space-y-3">
            {data.pages.flatMap(page => page.data).map(post => (
                <PostCard key={post.id} post={post} edit={edit} />
            ))}
        </div>
    );
}