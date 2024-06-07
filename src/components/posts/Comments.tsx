import { getListings } from "@/lib/api/listings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import Listing from "@/components/listings/Listing";
import Loading from "@/components/common/Loading";
import { useInView } from "react-intersection-observer";
import { getPostComments } from "@/lib/api/posts";
import CommentItem from "./CommentItem";

interface CommentsProps {
    postId: number;
}

export default function Comments({ postId }: CommentsProps) {
    const { data, isLoading, isError, error, fetchNextPage } = useInfiniteQuery({
        queryKey: ["postComments", postId],
        queryFn: (context) => getPostComments(postId, context.pageParam),
        getNextPageParam: (lastPageData) => {
            const { current_page, last_page } = lastPageData.meta;
            return current_page === last_page ? null : current_page + 1
        },
        initialPageParam: 1
    });

    const { ref, inView, entry } = useInView();

    useEffect(() => {
        if (inView && data && !isLoading) {
            fetchNextPage()
        }
    }, [inView, data, isLoading]);

    if (isLoading) {
        return <Loading />;
    }

    if (data) {
        if (data.pages[0].data.length > 0) {
            return (
                <>
                    <div className="space-y-5">
                        {data.pages.flatMap(page => page.data).map(comment => (
                            <CommentItem key={comment.id} postId={postId} comment={comment} />
                        ))}
                    </div>
                    <div ref={ref}></div>
                </>
            );
        } else {
            return (
                <div className="text-gray-400 text-sm">
                    No comments
                </div>
            );
        }
    }

    return <></>;

}