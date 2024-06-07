import Loading from "@/components/common/Loading";
import MainLayout from "@/components/layouts/MainLayout";
import { getPosts } from "@/lib/api/posts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "@/components/posts/PostCard";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import CreateOrEditPostDialog from "@/components/posts/CreateOrEditPostDialog";
import { PrimeIcons } from "primereact/api";
import PostsList from "@/components/posts/PostsList";

export default function Community() {

    const [newPostDialogVisible, setNewPostDialogVisible] = useState(false);
    const { data, isLoading, isError, error, fetchNextPage } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: (context) => getPosts(context.pageParam),
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

    const showNewPostDialog = () => {
        setNewPostDialogVisible(true);
    }

    const hideNewPostDialog = () => {
        setNewPostDialogVisible(false);
    }

    if (isLoading) {
        return <Loading />;
    }

    if (data) {
        return (
            <div className="mx-auto max-w-4xl space-y-5">
                <div className="flex justify-start gap-5 items-center">
                    <h1 className="text-3xl font-bold">Latest posts</h1>
                    <Button label="Create post" onClick={showNewPostDialog} size="small" icon={PrimeIcons.PLUS} text />
                </div>
                <PostsList data={data} />
                <div ref={ref}></div>
                <Dialog className="w-11/12 max-w-3xl" header="Create a new post" visible={newPostDialogVisible} onHide={hideNewPostDialog}>
                    <CreateOrEditPostDialog closeDialog={hideNewPostDialog} />
                </Dialog>
            </div>
        );
    }

    return <></>;
}

Community.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="p-10">
            {page}
        </MainLayout>
    );
}