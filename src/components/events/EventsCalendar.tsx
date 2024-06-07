import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DatesSetArg, EventClickArg } from '@fullcalendar/core';
import { useQuery } from "@tanstack/react-query";
import { getMonthEvents } from '@/lib/api/events';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import EventDialog from './EventDialog';
import { useUserStore } from '@/store';
import CreateOrEditEventDialog from './CreateOrEditEventDialog';
import { Button } from 'primereact/button';

export default function EventsCalendar() {

    const { user } = useUserStore();
    const isAdmin = user && user.role === "ADMIN";
    const [displayedMonth, setDisplayedMonth] = useState(["", ""]);
    const [clickedEvent, setClickedEvent] = useState<number | null>(null);
    const [eventDialogVisible, setEventDialogVisible] = useState(false);
    const [createEventDialogVisible, setCreateEventDialogVisible] = useState(false);
    const { data, isLoading } = useQuery({
        queryKey: ["events", displayedMonth], 
        queryFn: () => getMonthEvents(displayedMonth[0], displayedMonth[1])
    });

    const parsedEvents = data === undefined ? [] : data.map(event => {
        return {
            id: event.id.toString(),
            title: event.title,
            start: new Date(event.start_date),
            end: new Date(event.end_date),
            backgroundColor: "#8b5cf6",
            borderColor: "#8b5cf6"
        }
    });

    function onDatesSet(arg: DatesSetArg) {
        const startDate = new Date(arg.startStr);
        const day = startDate.getDate();
        let month = startDate.getMonth() + 1;
        let year = startDate.getFullYear();
        if (day !== 1) {
            month = (month + 1) % 12;
            if (month === 0) {
                month = 12;
            } else if (month === 1) {
                year++;
            }
        }
        setDisplayedMonth([
            month.toString(),
            year.toString(),
        ]);
    }

    function showEvent(arg: EventClickArg) {
        setClickedEvent(parseInt(arg.event.id));
        setEventDialogVisible(true);
    }

    function hideEvent() {
        setEventDialogVisible(false);
    }

    function showCreateEventDialog() {
        setCreateEventDialogVisible(true);
    }

    function hideCreateEventDialog() {
        setCreateEventDialogVisible(false);
    }

    return (
        <>
            {isAdmin && (
                <div className="flex justify-end">
                    <Button label="Create event" onClick={showCreateEventDialog} />
                </div>
            )}
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                datesSet={onDatesSet}
                events={parsedEvents}
                eventClick={showEvent}
            />
            {clickedEvent && (
                <Dialog className="w-11/12 max-w-2xl" visible={eventDialogVisible} onHide={hideEvent}>
                    <EventDialog id={clickedEvent} closeDialog={hideEvent} />
                </Dialog>
            )}
            {isAdmin && user.role === "ADMIN" && (
                <Dialog className="w-11/12 max-w-2xl" header="Create event" visible={createEventDialogVisible} onHide={hideCreateEventDialog}>
                    <CreateOrEditEventDialog closeDialog={hideCreateEventDialog}  />
                </Dialog>
            )}
        </>
    );
}