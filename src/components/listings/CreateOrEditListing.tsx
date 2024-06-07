import { z } from "zod";
import { Toast } from "primereact/toast";
import { ReactNode, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { createNewListing, editListing, getListingDetails } from "@/lib/api/listings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Errors from "@/components/forms/Errors";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import MainLayout from "@/components/layouts/MainLayout";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { useUserStore } from "@/store";
import { userVehicles } from "@/lib/api/users";
import { Dropdown } from "primereact/dropdown";
import { useRouter } from "next/router";

const ListingSchema = z.object({
    price: z.number(),
    mileage: z.number(),
    description: z.string().min(1),
    vehicle: z.number().optional()
});

type ListingForm = z.infer<typeof ListingSchema>;

interface CreateOrEditListingProps {
    id?: number // ID of the listing to edit
}

export default function CreateOrEditListing({ id }: CreateOrEditListingProps) {

    const { user } = useUserStore();
    const router = useRouter();

    const { data: listing, isLoading: isListingLoading, isError: isListingError, error: listingError } = useQuery({
        queryKey: ["userListing"],
        queryFn: () => getListingDetails(id ?? -1),
        enabled: id !== undefined
    });

    const { data: userVehiclesData, isLoading: isUserVehiclesLoading } = useQuery({
        queryKey: ["userVehicles"],
        queryFn: () => userVehicles(user?.id ?? -1),
        enabled: user != null
    });
    
    const { mutate, isPending, error } = useMutation({
        // @ts-ignore
        mutationFn: (data) => id ? editListing(id, data) : createNewListing(data),
        onSuccess: () => {
            toastRef.current?.show({ severity: "success", summary: "Success", detail: `${id ? "Edited" : "Created"} successfully` });
            if (id) {
                router.push("/listings/me");
            } else {
                router.push("/listings");
            }
        },
        onError: (error: AxiosError) => {
            
        }
    });

    const { handleSubmit, formState: { errors }, control, setValue, setError } = useForm<ListingForm>({
        resolver: zodResolver(ListingSchema),
    });
    const toastRef = useRef<Toast>(null);

    const createNew: SubmitHandler<ListingForm> = (data) => {
        if (!id && data.vehicle === undefined) {
            setError("vehicle", {
                message: "Choose your vehicle",
                type: "required"
            });
        }
        // @ts-ignore
        mutate(data);
    }

    useEffect(() => {
        if (listing) {
            setValue("price", listing.price);
            setValue("mileage", listing.mileage);
            setValue("description", listing.description);
        }
    }, [listing]);

    if (id === undefined || (id && listing)) {
        return (
            <>
                <Toast ref={toastRef} />
                <div className="basis-1/2">
                    <h1 className="text-gray-900 font-bold text-3xl !mt-0 mb-5">{ id ? "Edit" : "New " } listing</h1>
                    <p className="text-gray-600">
                        <strong>Price:</strong> Set a competitive price based on market trends and the car's specifics.<br />
                        <strong>Mileage:</strong> Clearly state the car’s mileage to indicate its usage and condition.<br />
                        <strong>Description:</strong> Provide a detailed and honest description, highlighting key features and any recent updates or repairs.<br />
                    </p>
                    <Errors error={error} />
                </div>
                <form className="space-y-10 basis-1/2" onSubmit={handleSubmit(createNew)}>
                    <div>
                        <FloatLabel>
                            <div className="p-inputgroup flex-1">
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            id={field.name}
                                            className="w-full"
                                            value={field.value}
                                            useGrouping={false}
                                            onChange={(e) => field.onChange(e.value)}
                                        />
                                    )}
                                />
                                <span className="p-inputgroup-addon">MAD</span>
                            </div>
                            <label htmlFor="price">Price</label>
                        </FloatLabel>
                        {errors.price?.message && <p className="text-red-500 text-sm mt-1">{errors.price?.message}</p>}
                    </div>
                    <div>
                        <FloatLabel>
                            <div className="p-inputgroup flex-1">
                                <Controller
                                    name="mileage"
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            id={field.name}
                                            className="w-full"
                                            value={field.value}
                                            useGrouping={false}
                                            onChange={(e) => field.onChange(e.value)}
                                        />
                                    )}
                                />
                                <span className="p-inputgroup-addon">Km</span>
                            </div>
                            <label htmlFor="mileage">Mileage</label>
                        </FloatLabel>
                    {errors.mileage?.message && <p className="text-red-500 text-sm mt-1">{errors.mileage?.message}</p>}
                    </div>
                    <div>
                        <FloatLabel>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <InputTextarea
                                        id={field.name}
                                        className="w-full"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                    />
                                )}
                            />
                            <label htmlFor="description">Description</label>
                        </FloatLabel>
                        {errors.description?.message && <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>}
                    </div>
                    { !id && <div>
                        <FloatLabel>
                            <Controller
                                name="vehicle"
                                control={control}
                                render={({ field }) => (
                                    <Dropdown
                                        id={field.name}
                                        className="w-full"
                                        value={field.value}
                                        loading={ isUserVehiclesLoading }
                                        onChange={(e) => field.onChange(e)}
                                        options={userVehiclesData ?? []}
                                        optionLabel="model"
                                        optionValue="id"
                                    />
                                )}
                            />
                            <label htmlFor="vehicle">Vehicle</label>
                        </FloatLabel>
                        {errors.description?.message && <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>}
                    </div> }
                    <Button
                        label={
                            isPending
                                ? id ? "Editing..." : "Creating..."
                                : id ? "Edit" : "Create"
                        }
                        type="submit"
                        loading={isPending}
                    />
                </form>
            </>
        );
    }
}