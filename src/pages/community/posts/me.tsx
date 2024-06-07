import Loading from "@/components/common/Loading";
import MainLayout from "@/components/layouts/MainLayout";
import CreateOrEditPostDialog from "@/components/posts/CreateOrEditPostDialog";
import PostsList from "@/components/posts/PostsList";
import { getUserPosts } from "@/lib/api/posts";
import { useUserStore } from "@/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function MyPosts() {

    const toastRef = useRef<Toast>(null);
    const { user } = useUserStore();
    const [newPostDialogVisible, setNewPostDialogVisible] = useState(false);
    const { data, isLoading, isError, error, fetchNextPage } = useInfiniteQuery({
        queryKey: ["myPosts"],
        queryFn: (context) => getUserPosts(user?.id ?? -1, context.pageParam),
        getNextPageParam: (lastPageData) => {
            const { current_page, last_page } = lastPageData.meta;
            return current_page === last_page ? null : current_page + 1
        },
        initialPageParam: 1,
        enabled: user != null
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
                    <h1 className="text-3xl font-bold">My posts</h1>
                    <Button label="Create post" onClick={showNewPostDialog} size="small" icon={PrimeIcons.PLUS} text />
                </div>
                <PostsList data={data} edit />
                <div ref={ref}></div>
                <Toast ref={toastRef} />
                <Dialog header="Create a new post" visible={newPostDialogVisible} onHide={hideNewPostDialog}>
                    <CreateOrEditPostDialog closeDialog={hideNewPostDialog} />
                </Dialog>
            </div>
        )
    }
}

MyPosts.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="p-10 space-y-5" auth>
            {page}
        </MainLayout>
    );
}