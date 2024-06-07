import Loading from "@/components/common/Loading";
import MainLayout from "@/components/layouts/MainLayout";
import VehicleRow from "@/components/vehicles/VehicleRow";
import { userVehicles} from "@/lib/api/users";
import { VehicleWithUser } from "@/lib/interfaces";
import { useUserStore } from "@/store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Toast } from "primereact/toast";
import { ReactNode, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function MyVehicles() {

    const router = useRouter();
    const toastRef = useRef<Toast>(null);
    const { user } = useUserStore();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["myVehicles"],
        queryFn: () => userVehicles(user?.id ?? -1),
        enabled: user != null
    });

    const myVehiclesItem = (vehicle: VehicleWithUser) => {
      return <VehicleRow vehicle={vehicle} toastRef={toastRef} />
    }

    const goToNewVehicle = () => {
        router.push("/vehicles/new");
    }

    if (isLoading) {
        return <Loading />;
    }

    if (data) {
        return (
            <>
                <div className="flex justify-start gap-5 items-center">
                    <h1 className="text-3xl font-bold">My vehicles</h1>
                    <Button label="Add vehicle" onClick={goToNewVehicle} size="small" icon={PrimeIcons.PLUS} text />
                </div>
                <DataView
                    layout="list"
                    value={data}
                    itemTemplate={myVehiclesItem}
                    gutter
                />
                <Toast ref={toastRef} />
            </>
        )
    }
}

MyVehicles.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="p-10 space-y-5" auth>
            {page}
        </MainLayout>
    );
}