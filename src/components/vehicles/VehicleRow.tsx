import { deleteMyVehicles } from "@/lib/api/users";
import { VehicleWithUser } from "@/lib/interfaces";
import { getImagePath } from "@/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { RefObject, useState } from "react";
import { PrimeIcons } from "primereact/api";
import { Toast } from "primereact/toast";

interface ListingRowProps {
    vehicle: VehicleWithUser,
    toastRef: RefObject<Toast>
}


export default function VehicleRow({ vehicle, toastRef }: ListingRowProps) {

    const client = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: () => deleteMyVehicles(vehicle.id),
        onSuccess: () => {
            toastRef.current?.show({ severity: "success", summary: "Success", detail: "Vehicle deleted successfully" });
            client.invalidateQueries({
                queryKey: ["myVehicles"]
            });
        }
    });
    const [vehicleDialogVisible, setVehicleDialogVisible] = useState(false);

    const router = useRouter();

    const goToEdit = () => {
        router.push(`/vehicles/edit/${vehicle.id}`);
    }

    const doDeleteVehicle = () => {
        mutate()
    }

    const showVehicleDialog = () => {
        setVehicleDialogVisible(true);
    }

    const closeVehicleDialog = () => {
        setVehicleDialogVisible(false);
    }

    return (
        <div className="flex justify-between items-center mt-5">
            <div className="flex items-center gap-5">
                <Image className="object-cover rounded-md" src={getImagePath(vehicle.images[0].image_path)} alt="Car image" width={140} height={60} />
                <div>
                    <p className="tracking-widest uppercase text-primary text-sm">{vehicle.make}</p>
                    <h2 className="text-2xl font-bold text-gray-900">{vehicle.model}</h2>
                    <p>{vehicle.year}</p>
                    <p>{vehicle.description}</p>
                </div>
            </div>
            <div className="space-x-5">
                <Button size="small" loading={isPending} severity="danger" onClick={doDeleteVehicle} icon={PrimeIcons.TRASH} text />
                <Button label="Edit" size="small" icon={PrimeIcons.PENCIL} onClick={goToEdit} />
            </div>
        </div>
    );
}