import { Comment } from "@/lib/interfaces";
import { getFullName } from "@/utils";
import { useUserStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, toggleCommentUpvote } from "@/lib/api/comments";
import { useEffect } from "react";
import { BlockUI } from "primereact/blockui";

const escapeHTML = (str: string) =>
    str.replace(
      /[&<>'"]/g,
      (tag: string) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
    );

interface CommentProps {
    comment: Comment,
    postId: number
}

export default function CommentItem({ comment, postId }: CommentProps) {

    const { user } = useUserStore();
    const client = useQueryClient();
    const createdAtDate = new Date(comment.created_at);
    const createdAt = createdAtDate.toLocaleDateString() + " " + createdAtDate.toLocaleTimeString();

    const { mutate: upvoteMutate, isPending: isUpvotePending } = useMutation({
        mutationFn: () => toggleCommentUpvote(postId, comment.id),
        onSuccess: () => {
            const shouldAdd = !comment.upvoted_by_user;
            comment.upvoted_by_user = !comment.upvoted_by_user;
            comment.upvotes_count += (shouldAdd ? 1 : (-1));
        }
    });

    const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
        mutationFn: () => deleteComment(postId, comment.id),
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ["postComments", postId]
            });
        }
    });

    const doToggleUpvote = () => {
        if (user != null) {
            upvoteMutate();
        }
    }

    const doDeleteComment = () => {
        deleteMutate()
    }

    return (
        <div className="bg-gray-50 rounded-lg overflow-hidden">
            <BlockUI blocked={isDeletePending || isUpvotePending}>    
                <div className="px-5 py-4 space-y-2">
                    <p className="text-xs text-gray-600"><span className="text-primary font-bold">{getFullName(comment.author)}</span> commented</p>
                    <div dangerouslySetInnerHTML={{
                        __html: comment.content
                    }} />
                </div>
                <div className="space-x-3 flex justify-between items-center border-t border-dashed py-2 px-5">
                    <span className="text-gray-600 text-xs">
                        At {createdAt}
                    </span>
                    <div className="space-x-2">
                        {user && user.id === comment.author.id && <span 
                            className={"rounded-full bg-red-100 py-1 px-2 text-xs cursor-pointer text-red-600"}
                            onClick={doDeleteComment}
                        >
                            <i className="pi pi-trash text-xs"></i> Delete
                        </span>}
                        <span 
                            className={`rounded-full bg-primary py-1 px-2 text-xs cursor-pointer ${comment.upvotes_count ? "text-white" : "bg-opacity-5 text-primary"}`}
                            onClick={user != null ? doToggleUpvote : undefined}
                        >
                            {comment.upvotes_count} <i className="pi pi-arrow-up text-xs"></i>
                        </span>
                    </div>
                </div>
            </BlockUI>
        </div>
    );
}