import MainLayout from "@/components/layouts/MainLayout";
import CreateOrEditListing from "@/components/listings/CreateOrEditListing";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

export default function EditListing() {

    const router = useRouter();
    const params = useParams<{id: string}>();

    useEffect(() => {
        if (params && !params.id) {
            router.push("/404");
        }
    }, [params]);

    return <CreateOrEditListing id={params?.id ? parseInt(params.id) : undefined} />
}

EditListing.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="flex gap-10 px-10 py-14 items-center mx-auto max-w-5xl" auth>
            {page}
        </MainLayout>
    );
}