import Loading from "@/components/common/Loading";
import MainLayout from "@/components/layouts/MainLayout";
import Listing from "@/components/listings/Listing";
import { getListingDetails } from "@/lib/api/listings";
import { ListingWithUserAndVehicle, VehicleImage } from "@/lib/interfaces";
import { getFullName, getImagePath } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { ReactNode, useEffect } from "react";

export default function ListingDetails() {

    const router = useRouter();
    const params = useParams<{id: string}>();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["listing", params?.id ?? 0],
        queryFn: () => getListingDetails(parseInt(params.id)),
        enabled: !!(params && params.id)
    });

    const imageTemplate = (item: VehicleImage) => {
        return (
            <div className="h-[33rem]">
                <Image className="object-cover rounded-md" src={getImagePath(item.image_path)} alt="Vehicle image" fill />
            </div>
        );
    }

    const copyEmail = () => {
        navigator.clipboard.writeText(data?.author.email ?? "");
    }

    useEffect(() => {
        if (params && !params.id) {
            router.push("/404");
        }
    }, [params]);
    
    if (isLoading) {
        return <Loading className="w-full" />;
    }

    if (data) {
        return (
            <>
                <div className="grow-0 basis-3/5 space-y-4">
                    <Galleria
                        value={data.vehicle.images} 
                        changeItemOnIndicatorHover
                        showThumbnails={false} 
                        showIndicators 
                        item={imageTemplate} 
                    />
                    <h2 className="text-2xl font-black text-gray-700 ">Description</h2>
                    <p className="text-gray-600">
                        {data.description}
                    </p>
                </div>
                <div className="grow basis-2/5 space-y-5">
                    <div className="space-y-1">
                        <h1 className="font-bold text-4xl text-gray-800">
                            {data.vehicle.model}
                        </h1>
                        <p className="uppercase text-primary text-sm tracking-widest">
                            {data.vehicle.make}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-5 rounded-lg bg-yellow-100">
                            <p className="text-center text-yellow-700 text-xl tracking-widest uppercase">Price</p>
                            <p className="text-center text-yellow-900 text-2xl font-bold">{data.price} MAD</p>
                        </div>
                        <div className="p-5 rounded-lg bg-red-100">
                            <p className="text-center text-red-700 text-xl tracking-widest uppercase">Status</p>
                            <p className="text-center text-red-900 text-2xl font-bold">{data.status === "FORSALE" ? "For sale" : "Sold"}</p>
                        </div>
                        <div className="p-5 rounded-lg bg-purple-100 col-span-2">
                            <p className="text-center text-primary text-xl tracking-widest uppercase">Mileage</p>
                            <p className="text-center text-gray-900 text-2xl font-bold">{data.mileage} KM</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <p className="font-bold text-gray-900">Sold by</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar size="large" label={data.author.firstname[0].toUpperCase()} />
                                <p className="text-gray-900 font-medium">{getFullName(data.author)}</p>
                            </div>
                            <Button size="small" icon="pi pi-envelope" label="Contact" onClick={copyEmail} />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

ListingDetails.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="flex gap-10 p-10">
            {page}
        </MainLayout>
    );
}