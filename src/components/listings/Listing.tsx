import { ListingWithUserAndVehicle } from "@/lib/interfaces";
import { getImagePath } from "@/utils";
import Image from "next/image";
import Link from "next/link";

interface ListingProps {
    listing: ListingWithUserAndVehicle
}

export default function Listing({ listing }: ListingProps) {
    return (
        <Link href={`/listings/${listing.id}`} className="space-y-1 w-72 hover:scale-105 active:scale-95 transition-all justify-self-center">
            <div className="relative rounded-md overflow-hidden h-44">
                {/* <img className="w-full" src={getImagePath(listing.vehicle.images[0].image_path)} alt="Listing pic" /> */}
                <Image className="w-full object-cover object-center" src={getImagePath(listing.vehicle.images[0].image_path)} alt="Listing pic" fill />
                <div className="bg-primary bg-opacity-85 rounded-md py-1 px-3 text-sm text-white absolute bottom-3 left-3">
                    {listing.price} MAD
                </div>
                <div className="bg-gray-100 bg-opacity-85 rounded-md py-1 px-3 text-sm text-neutral-900 absolute top-3 right-3">
                    { listing.status === "FORSALE" ? "For sale" : "Sold" }
                </div>
            </div>
            <h2 className="text-neutral-800 font-bold text-xl">{listing.vehicle.model}</h2>
            <p className="text-sm text-neutral-600 text-ellipsis line-clamp-3">{listing.description}</p>
        </Link>
    )
}

