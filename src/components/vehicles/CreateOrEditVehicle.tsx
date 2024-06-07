import { z } from "zod";
import { Toast } from "primereact/toast";
import React, { ReactNode, useEffect, useRef, useState } from "react";
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
import { createVehicle, editVehicle, getVehicleDetails } from "@/lib/api/vehicles";
import { Tooltip } from "primereact/tooltip";
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, ItemTemplateOptions } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import Image from "next/image";
import { getImagePath } from "@/utils";
import { EditVehicleData, NewVehicleData } from "@/lib/interfaces";
import { useRouter } from "next/router";

const VehicleSchema = z.object({
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().min(1),
    description: z.string().min(1),
    deletedPhotos: z.number().array().optional()
});

type VehicleForm = z.infer<typeof VehicleSchema>;

interface CreateOrEditVehicleProps {
    id?: number // ID of the listing to edit
}

export default function CreateOrEditVehicle({ id }: CreateOrEditVehicleProps) {

    const router = useRouter();
    const { user } = useUserStore();
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);

    const { data: vehicle, isLoading: isVehicleLoading, isError: isVehicleError, error: vehicleError } = useQuery({
        queryKey: ["userVehicle"],
        queryFn: () => getVehicleDetails(id ?? -1),
        enabled: id !== undefined
    });
    
    const { mutate, isPending, error } = useMutation({
        // @ts-ignore
        mutationFn: (data) => id ? editVehicle(id, data) : createVehicle(data),
        onSuccess: () => {
            toastRef.current?.show({ severity: "success", summary: "Success", detail: `${id ? "Edited" : "Created"} successfully` });
            router.push("/vehicles/me");
        },
        onError: (error: AxiosError) => {
            
        }
    });

    const { handleSubmit, formState: { errors }, control, getValues, setValue, setError } = useForm<VehicleForm>({
        resolver: zodResolver(VehicleSchema),
    });
    const toastRef = useRef<Toast>(null);

    const createNew: SubmitHandler<VehicleForm> = (data) => {
        const newData: any = {
            ...data,
            photos: fileUploadRef.current?.getFiles() ?? []
        };
        if (!id) {
            delete newData.deletedPhotos;
        } else {
            newData._method = "PUT"
        }
        // @ts-ignore
        mutate(newData);
    }

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let _totalSize = totalSize;
        let files = e.files;

        for (let i = 0; i < files.length; i++) {
            _totalSize += files[i].size || 0;
        }

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toastRef.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 20480;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 20 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    {/* @ts-ignore */}
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    useEffect(() => {
        if (vehicle) {
            setValue("make", vehicle.make);
            setValue("model", vehicle.model);
            setValue("year", vehicle.year);
            setValue("description", vehicle.description);
        }
    }, [vehicle]);

    if (id === undefined || vehicle) {
        return (
            <>
                <Toast ref={toastRef} />
                <div className="basis-1/2 space-y-5">
                    <h1 className="text-gray-900 font-bold text-3xl !mt-0">{ id ? "Edit " : "New " } vehicle</h1>
                    <p className="text-gray-600">
                        {/* TODO: Replace with new GPT data */}
                        <strong>Model:</strong> Specify the exact model of your vehicle.<br />
                        <strong>Mileage:</strong> Provide the manufacturer's name.<br />
                        <strong>Year:</strong> Indicate the vehicle's year of manufacture.<br />
                        <strong>Description:</strong> Offer a detailed and honest description, highlighting key features and any recent updates or repairs.<br />
                    </p>
                    <Errors error={error} />
                </div>
                <form className="space-y-10 basis-1/2" onSubmit={handleSubmit(createNew)}>
                    <div>
                        <FloatLabel>
                            <Controller
                                name="make"
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        id={field.name}
                                        className="w-full"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                )}
                            />
                            <label htmlFor="make">Make</label>
                        </FloatLabel>
                        {errors.make?.message && <p className="text-red-500 text-sm mt-1">{errors.make?.message}</p>}
                    </div>
                    <div>
                        <FloatLabel>
                            <Controller
                                name="model"
                                control={control}
                                render={({ field }) => (
                                    <InputText
                                        id={field.name}
                                        className="w-full"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                )}
                            />
                            <label htmlFor="model">Model</label>
                        </FloatLabel>
                    {errors.model?.message && <p className="text-red-500 text-sm mt-1">{errors.model?.message}</p>}
                    </div>
                    <div>
                        <FloatLabel>
                            <Controller
                                name="year"
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
                            <label htmlFor="year">Year</label>
                        </FloatLabel>
                    {errors.year?.message && <p className="text-red-500 text-sm mt-1">{errors.year?.message}</p>}
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
                    <div className="grid gap-4 grid-cols-3">
                        <Controller 
                            name="deletedPhotos"
                            control={control}
                            render={({ field }) => (
                                <>
                                    {vehicle?.images.map(image => {
                                        if (!field.value?.includes(image.id)) {
                                            return (
                                                <div key={image.id} className="relative rounded-md w-36 h-24 overflow-hidden">
                                                    <Image className="grid gap-5 object-cover" src={getImagePath(image.image_path)} alt="Vehicle image" fill />
                                                    <div
                                                        className="bg-red-500 opacity-0 hover:opacity-65 absolute h-full w-full text-white flex justify-center items-center cursor-pointer"
                                                        onClick={
                                                            () => {
                                                                field.onChange([...(field.value ?? []), image.id])
                                                            }
                                                        }
                                                    >
                                                        <p>Delete</p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return <React.Fragment key={image.id}></React.Fragment>
                                    })}
                                </>
                            )}
                        />
                    </div>
                    <div>
                        <h2 className="text-primary font-bold text-xl mb-5">Images</h2>
                        <div>
                            <Toast ref={toastRef}></Toast>

                            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                            <FileUpload ref={fileUploadRef} name="demo[]" url="/api/upload" multiple accept="image/*" maxFileSize={1000000}
                                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                        </div>
                    </div>
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