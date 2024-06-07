import MainLayout from "@/components/layouts/MainLayout";
import CreateOrEditVehicle from "@/components/vehicles/CreateOrEditVehicle";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { ReactNode, useEffect} from "react";

export default function EditVehicle() {

    const router = useRouter();
    const params = useParams<{id: string}>();

    useEffect(() => {
        if (params && !params.id) {
            router.push("/404");
        }
    }, [params])


    return <CreateOrEditVehicle id={params?.id ? parseInt(params.id) : undefined} />
}

EditVehicle.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="flex gap-10 px-10 py-14 items-start mx-auto max-w-5xl" auth>
            {page}
        </MainLayout>
    );
}