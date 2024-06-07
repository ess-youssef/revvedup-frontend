import { ReactNode, useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useUserStore } from "@/store";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFullName } from "@/utils";
import Loading from "@/components/common/Loading";
import { useMutation } from "@tanstack/react-query";
import { getPostDetails, togglePostUpvote } from "@/lib/api/posts";
import Comments from "@/components/posts/Comments";
import { Editor } from "primereact/editor";
import NewCommentForm from "@/components/posts/NewCommentForm";

export default function PostDetails() {

    const user = useUserStore();
    const router = useRouter();
    const params = useParams<{id: string}>();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["post", params?.id ?? 0],
        queryFn: () => getPostDetails(parseInt(params.id)),
        enabled: !!(params && params.id)
    });

    const { mutate } = useMutation({
        // @ts-ignore
        mutationFn: () => togglePostUpvote(data.id),
        onSuccess: () => {
            if (data) {
                const shouldAdd = !data.upvoted_by_user;
                data.upvoted_by_user = !data.upvoted_by_user;
                data.upvotes_count += (shouldAdd ? 1 : (-1));
            }
        }
    });

    useEffect(() => {
        if (params && !params.id) {
            router.push("/404");
        }
    }, [params])

    const doToggleUpvote = () => {
        if (user != null) {
            mutate();
        }
    }
        
    if (isLoading) {
        return <Loading className="w-full" />;
    }

    if (data) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-xs text-primary">
                    {getFullName(data.author)}
                </div>
                <h2 className="text-5xl font-bold text-gray-900 mt-3 mb-5">
                    {data.title}
                </h2>
                <div className="text-gray-600 mb-5" dangerouslySetInnerHTML={{
                    __html: data.content
                }} />
                <div className="space-x-3 mb-10">
                    <span 
                        className={`rounded-full bg-primary py-2 px-3 text-sm cursor-pointer ${data.upvoted_by_user ? "text-white" : "bg-opacity-5 text-primary"}`}
                        onClick={user != null ? doToggleUpvote : undefined}
                    >
                        {data.upvotes_count} <i className="pi pi-arrow-up text-xs"></i>
                    </span>
                    <span className="rounded-full bg-primary bg-opacity-5 text-primary py-2 px-3 text-sm">
                        {data.comments_count} comments
                    </span>       
                </div>
                <div className="mt-10 space-y-5">
                    <NewCommentForm postId={parseInt(params.id)} />
                    <Comments postId={parseInt(params.id)} />
                </div>
            </div>                
        );
    }
}

PostDetails.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="p-10 space-y-10">
            {page}
        </MainLayout>
    );
}