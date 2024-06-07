import MainLayout from "@/components/layouts/MainLayout";
import CreateOrEditVehicle from "@/components/vehicles/CreateOrEditVehicle";
import { ReactNode } from "react";

export default function CreateVehicle() {
    return <CreateOrEditVehicle />
}

CreateVehicle.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="flex gap-10 px-10 py-14 items-start mx-auto max-w-5xl" auth>
            {page}
        </MainLayout>
    );
}