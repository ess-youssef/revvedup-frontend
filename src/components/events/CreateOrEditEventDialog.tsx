import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import { useRef, useEffect } from "react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";
import { BlockUI } from "primereact/blockui";
import { getEvent, deleteEvent, editEvent, createEvent } from "@/lib/api/events";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import Errors from "../forms/Errors";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

const EventSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1),
    start_date: z.date(),
    end_date: z.date(),
    location: z.string().min(1).max(100)
});

type EventForm = z.infer<typeof EventSchema>;

interface EventDialogProps {
    id?: number;
    closeDialog: () => void;
}

export default function CreateOrEditEventDialog({ id, closeDialog }: EventDialogProps) {
    const client = useQueryClient();
    const toastRef = useRef<Toast>(null);

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<EventForm>({
        resolver: zodResolver(EventSchema)
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ["editEvent", id],
        queryFn: () => getEvent(id ?? 0),
        enabled: !!id
    });

    const { mutate, isPending, error: createEditError } = useMutation({
        mutationFn: (context: EventForm) => id ? editEvent(id, context) : createEvent(context),
        onSuccess: () => {
            toastRef.current?.show({ severity: "success", summary: "Success", detail: `${id ? "Edited" : "Created"} successfully` });
            client.invalidateQueries({
                queryKey: ["events"]
            });
            client.invalidateQueries({
                queryKey: ["event"]
            });
            closeDialog();
        },
        onError: (error: AxiosError) => {}
    });

    const doSendEventForm: SubmitHandler<EventForm> = (data) => {
        mutate(data);
    }

    useEffect(() => {
        if (data) {
            setValue("title", data.title);
            setValue("description", data.description);
            setValue("start_date", new Date(data.start_date));
            setValue("end_date", new Date(data.end_date));
            setValue("location", data.location);
        }
    }, [data]);

    return (
        <BlockUI blocked={!!id && isLoading}>
            <form className="space-y-10 mt-5" onSubmit={handleSubmit(doSendEventForm)}>
                <Errors error={createEditError} />
                <div>
                    <FloatLabel>
                        <Controller
                            name="title"
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
                        <label htmlFor="title">Title</label>
                    </FloatLabel>
                    {errors.title?.message && <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>}
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
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            )}
                        />
                        <label htmlFor="description">Description</label>
                    </FloatLabel>
                    {errors.description?.message && <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>}
                </div>
                <div className="flex items-center gap-5">
                    <div className="grow">
                        <FloatLabel>
                            <Controller
                                name="start_date"
                                control={control}
                                render={({ field }) => (
                                    <Calendar 
                                        className="w-full"
                                        dateFormat="yy-mm-dd"
                                        value={field.value}
                                        onChange={(e) => {
                                            const day = e.value?.getDate() ?? 1;
                                            const month = e.value?.getMonth() ?? 1;
                                            const year = e.value?.getFullYear() ?? 2000;
                                            e.value?.setUTCHours(0);
                                            e.value?.setDate(day);
                                            e.value?.setMonth(month);
                                            e.value?.setFullYear(year);
                                            field.onChange(e.value);
                                        }}
                                    />
                                )}
                            />
                            <label htmlFor="start_date">Start date</label>
                        </FloatLabel>
                        {errors.start_date?.message && <p className="text-red-500 text-sm mt-1">{errors.start_date?.message}</p>}
                    </div>
                    <div className="grow">
                        <FloatLabel>
                            <Controller
                                name="end_date"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        className="w-full"
                                        dateFormat="yy-mm-dd"
                                        value={field.value}
                                        onChange={(e) => {
                                            const day = e.value?.getDate() ?? 1;
                                            const month = e.value?.getMonth() ?? 1;
                                            const year = e.value?.getFullYear() ?? 2000;
                                            e.value?.setUTCHours(0);
                                            e.value?.setDate(day);
                                            e.value?.setMonth(month);
                                            e.value?.setFullYear(year);
                                            field.onChange(e.value);
                                        }}
                                    />
                                )}
                            />
                            <label htmlFor="end_date">End date</label>
                        </FloatLabel>
                        {errors.end_date?.message && <p className="text-red-500 text-sm mt-1">{errors.end_date?.message}</p>}
                    </div>
                </div>
                <div>
                    <FloatLabel>
                        <Controller
                            name="location"
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
                        <label htmlFor="location">Location</label>
                    </FloatLabel>
                    {errors.location?.message && <p className="text-red-500 text-sm mt-1">{errors.location?.message}</p>}
                </div>
                <Button label={id ? "Edit" : "Create"} type="submit" loading={isPending} />
            </form>
        </BlockUI>
    );
}