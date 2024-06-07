import Loading from "@/components/common/Loading";
import MainLayout from "@/components/layouts/MainLayout";
import ListingRow from "@/components/listings/ListingRow";
import { getMyListings } from "@/lib/api/listings";
import { Listing, ListingWithVehicle } from "@/lib/interfaces";
import { useUserStore } from "@/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DataView } from "primereact/dataview";
import { Toast } from "primereact/toast";
import { ReactNode, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function MyListings() {

    const toastRef = useRef<Toast>(null);
    const { user } = useUserStore();
    const { data, isLoading, isError, error, fetchNextPage } = useInfiniteQuery({
        queryKey: ["myListings"],
        queryFn: (context) => getMyListings(user?.id ?? -1, context.pageParam),
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

    const listingItem = (listing: ListingWithVehicle) => {
      return <ListingRow listing={listing} toastRef={toastRef} />
    }

    if (isLoading) {
        return <Loading />;
    }

    if (data) {
        return (
            <>
                <h1 className="text-3xl font-bold">My listings</h1>
                <DataView
                    layout="list"
                    value={data.pages.flatMap(page => page.data)}
                    itemTemplate={listingItem}
                    gutter
                />
                <div ref={ref}></div>
                <Toast ref={toastRef} />
            </>
        )
    }
}

MyListings.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="p-10 space-y-5" auth>
            {page}
        </MainLayout>
    );
}