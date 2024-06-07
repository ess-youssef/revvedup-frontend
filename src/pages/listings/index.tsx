import { getListings } from "@/lib/api/listings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import Listing from "@/components/listings/Listing";
import Loading from "@/components/common/Loading";
import { useInView } from "react-intersection-observer";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useDebouncedState } from "@/utils";

export default function Listings() {
    const [search, debouncedSearch, setSearch] = useDebouncedState("", 300);
    const { data, isLoading, isError, error, fetchNextPage } = useInfiniteQuery({
        queryKey: ["listings", debouncedSearch],
        queryFn: (context) => getListings(context.pageParam, debouncedSearch === "" ? null : debouncedSearch),
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

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Latest listings</h1>
                <div>
                    <IconField>
                        <InputIcon className="pi pi-search"></InputIcon>
                        <InputText className="w-full" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
                    </IconField>
                </div>
            </div>
            {
                data
                    ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                            {data.pages.flatMap(page => page.data).map(listing => (
                                <Listing key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )
                    : isLoading 
                        ? <Loading />
                        : <></>
            }
            
            <div ref={ref}></div>
        </>
    );
}

Listings.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="space-y-16 p-10">
            {page}
        </MainLayout>
    );
}