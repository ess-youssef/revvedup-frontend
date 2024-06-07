import EventsCalendar from "@/components/events/EventsCalendar";
import { ReactNode } from "react";
import MainLayout from "@/components/layouts/MainLayout";

export default function Events() {
    return (
        <div className="space-y-5">
            <EventsCalendar />
        </div>
    );
}

Events.getLayout = (page: ReactNode) => {
    return (
        <MainLayout className="p-10 space-y-5">
            {page}
        </MainLayout>
    );
}