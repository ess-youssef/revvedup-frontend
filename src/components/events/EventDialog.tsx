import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEvent } from "@/lib/api/events";
import Loading from "../common/Loading";
import { useState } from "react";
import { Button } from "primereact/button";
import { toggleEventAttendance } from "@/lib/api/events";
import { useUserStore } from "@/store";
import { PrimeIcons } from "primereact/api";
import { Dialog } from "primereact/dialog";
import CreateOrEditEventDialog from "./CreateOrEditEventDialog";
import { deleteEvent } from "@/lib/api/events";

interface EventDialogProps {
    id: number;
    closeDialog: () => void
}

export default function EventDialog({ id, closeDialog }: EventDialogProps) {

    const client = useQueryClient();
    const { user } = useUserStore();
    const isAdmin = user && user.role === "ADMIN";
    const [editEventDialogVisible, setEditEventDialogVisible] = useState(false);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["event", id, user],
        queryFn: () => getEvent(id)
    });

    const { mutate: editMutate, isPending } = useMutation({
        mutationFn: () => toggleEventAttendance(id),
        onSuccess: (updateEvent) => {
            client.setQueryData(["event", id, user], updateEvent);
        }
    });

    const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
        mutationFn: () => deleteEvent(id ?? 0),
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ["events"]
            });
            closeDialog();
        }
    });

    const doToggleEventAttendance = () => {
        editMutate();
    }

    const doDelete = () => {
        deleteMutate()
    }

    const showEditEventDialog = () => {
        setEditEventDialogVisible(true)
    }

    const hideEditEventDialog = () => {
        setEditEventDialogVisible(false)
    }

    if (isLoading) {
        return <Loading className="w-full" />;
    }

    if (data) {
        return (
            <div className="space-y-10">
                <div className="space-y-1">
                    <p className="text-xs text-primary uppercase tracking-widest space-x-2">
                        <i className="text-[0.7rem] pi pi-map-marker"></i>
                        <span>{data.location}</span>
                    </p>
                    <h1 className="text-2xl font-bold text-gray-900">{data.title}</h1>
                    <p className="text-sm text-primary">
                        Starts on {new Date(data.start_date).toLocaleDateString()}{data.start_date !== data.end_date && " and ends on " + new Date(data.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{data.description}</p>
                </div>
                <div className="flex items-center gap-3">
                    {user && <Button className="w-full grow" label={`${data.attended_by_user ? "Desist" : "Attend"} (${data.attendance_count} attendees)`} loading={isPending} onClick={doToggleEventAttendance} />}
                    {isAdmin && <Button className="w-full shrink basis-[10%]" icon={PrimeIcons.PENCIL} onClick={showEditEventDialog} text />}
                    {isAdmin && <Button className="w-full shrink basis-[10%]" icon={PrimeIcons.TRASH} onClick={doDelete} loading={isDeletePending} text severity="danger" />}
                </div>
                <Dialog className="w-11/12 max-w-2xl" header="Edit event" visible={editEventDialogVisible} onHide={hideEditEventDialog}>
                    <CreateOrEditEventDialog id={id} closeDialog={hideEditEventDialog} />
                </Dialog>
            </div>  
        );
    }
}