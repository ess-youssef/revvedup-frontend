import { deleteListing } from "@/lib/api/listings";
import { ListingWithVehicle, PaginatedResponse } from "@/lib/interfaces";
import { getImagePath } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { RefObject, useRef, useState } from "react";
import BuyerChoiceDialog from "./BuyerChoiceDialog";

interface ListingRowProps {
    listing: ListingWithVehicle,
    toastRef: RefObject<Toast>
}


export default function ListingRow({ listing, toastRef }: ListingRowProps) {

    const client = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: () => deleteListing(listing.id),
        onSuccess: () => {
            toastRef.current?.show({ severity: "success", summary: "Success", detail: "Listing deleted successfully" });
            client.invalidateQueries({
                queryKey: ["myListings"]
            });
        }
    });
    const [sellDialogVisible, setSellDialogVisible] = useState(false);

    const router = useRouter();

    const goToEdit = () => {
        router.push(`/listings/edit/${listing.id}`);
    }

    const doDeleteListing = () => {
        mutate()
    }

    const showSellDialog = () => {
        setSellDialogVisible(true);
    }

    const closeSellDialog = () => {
        setSellDialogVisible(false);
    }

    return (
        <div className="flex justify-between items-center mt-5">
            <div className="flex items-center gap-5">
                <Image className="object-cover rounded-md" src={getImagePath(listing.vehicle.images[0].image_path)} alt="Car image" width={140} height={60} />
                <div>
                    <p className="tracking-widest uppercase text-primary text-sm">{listing.vehicle.make}</p>
                    <h2 className="text-2xl font-bold text-gray-900">{listing.vehicle.model}</h2>
                    <p>{listing.price} MAD • {listing.mileage} KM</p>
                </div>
                <div className="rounded-md py-1 px-3 text-purple bg-purple-200 text-xs">
                    { listing.status === "SOLD" ? "Sold" : "For sale" }
                </div>
            </div>
            <div className="space-x-5">
                <Button size="small" loading={isPending} severity="danger" onClick={doDeleteListing} icon={PrimeIcons.TRASH} text />
                { listing.status === "FORSALE" && (
                    <>
                        <Button label="Edit" size="small" icon={PrimeIcons.PENCIL} onClick={goToEdit} />
                        <Button label="Sell" size="small" icon={PrimeIcons.DOLLAR} onClick={showSellDialog} severity="success" />
                    </>
                ) }
            </div>
            <Dialog className="w-11/12 max-w-xl" header="Choose the buyer" visible={sellDialogVisible} onHide={closeSellDialog}>
                <BuyerChoiceDialog id={listing.id} closeDialog={closeSellDialog} />
            </Dialog>
        </div>
    );
}