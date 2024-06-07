import { Post } from "@/lib/interfaces";
import { getFullName } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { togglePostUpvote } from "@/lib/api/posts";
import { useState, MouseEvent, useRef } from "react";
import { useUserStore } from "@/store";
import Link from "next/link";
import { Dialog } from "primereact/dialog";
import CreateOrEditPostDialog from "./CreateOrEditPostDialog";
import { useRouter } from "next/router";

interface PostCardProps {
    post: Post;
    edit?: boolean;
}

export default function PostCard({ post, edit }: PostCardProps) {

    const user = useUserStore();
    const router = useRouter();
    const [editPostDialogVisible, setEditPostDialogVisible] = useState(false);
    const { mutate } = useMutation({
        mutationFn: () => togglePostUpvote(post.id),
        onSuccess: () => {
            const shouldAdd = !post.upvoted_by_user;
            post.upvoted_by_user = !post.upvoted_by_user;
            post.upvotes_count += (shouldAdd ? 1 : (-1));
        }
    });

    const doToggleUpvote = () => {
        if (user != null) {
            mutate();
        }
    }

    const showEditPostDialog = () => {
        setEditPostDialogVisible(true);
    }

    const hideEditPostDialog = () => {
        setEditPostDialogVisible(false);
    }

    const handleClick = () => {
        router.push(`/community/posts/${post.id}`);
    }

    return (
        <div className="block bg-gray-50 rounded-lg p-5">
            <div className="text-xs text-primary">
                {getFullName(post.author)}
            </div>
            <Link href={`/community/posts/${post.id}`} className="text-2xl font-bold text-gray-900 mt-3 hover:underline">
                {post.title}
            </Link>
            <div className="text-gray-600 mb-5 line-clamp-3 text-ellipsis" dangerouslySetInnerHTML={{
                __html: post.content
            }} />
            <div className="flex items-center justify-between">
                <div className="space-x-3">
                    <span 
                        className={`rounded-full bg-primary py-2 px-3 text-sm cursor-pointer ${post.upvoted_by_user ? "text-white" : "bg-opacity-5 text-primary"}`}
                        onClick={user != null ? doToggleUpvote : undefined}
                    >
                        {post.upvotes_count} <i className="pi pi-arrow-up text-xs"></i>
                    </span>
                    <span className="rounded-full bg-primary bg-opacity-5 text-primary py-2 px-3 text-sm">
                        {post.comments_count} comments
                    </span>       
                </div>
                <div className="space-x-3">
                    {edit && (
                        <>
                            <span
                                className="rounded-full bg-primary py-2 px-3 text-sm cursor-pointer bg-opacity-5 text-primary"
                                onClick={showEditPostDialog}
                            >
                                <i className="pi pi-pencil text-xs"></i> Edit
                            </span>
                            <span
                                className="rounded-full bg-primary py-2 px-3 text-sm cursor-pointer bg-opacity-5 text-primary"
                                onClick={handleClick}
                            >
                                <i className="pi pi-arrow-up-right text-xs"></i> Go to post
                            </span>
                        </>
                    )}
                </div>
            </div>
            {edit && (
                <Dialog header="Edit post" visible={editPostDialogVisible} onHide={hideEditPostDialog}>
                    <CreateOrEditPostDialog closeDialog={hideEditPostDialog} id={post.id} />
                </Dialog>
            )}
        </div>
    );
}