import MainLayout from "@/components/layouts/MainLayout";
import CreateOrEditListing from "@/components/listings/CreateOrEditListing";
import { ReactNode } from "react";

export default function NewListing() {
    return <CreateOrEditListing />
}

NewListing.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="flex gap-10 p-10 items-center mx-auto max-w-5xl" auth>
            {page}
        </MainLayout>
    );
}