import { Event, NewEventData, EditEventData, Message } from '@/lib/interfaces';
import axios from './axios';

export async function getMonthEvents(month: string, year: string): Promise<Event[]> {
    const { data } = await axios.get<Event[]>("/events", {
        params: { month, year }
    });
    return data;
}

export async function getEvent(eventId: number): Promise<Event> {
    const { data } = await axios.get<Event>(`/events/${eventId}`);
    return data;
}

export async function toggleEventAttendance(eventId: number): Promise<Event> {
    const { data } = await axios.post<Event>(`/events/${eventId}/attend`);
    return data;
}

export async function createEvent(eventData: NewEventData): Promise<Event> {
    const { data } = await axios.post<Event>(`/events/register`, eventData);
    return data;
}

export async function editEvent(eventId: number, eventData: EditEventData): Promise<Event> {
    const { data } = await axios.put<Event>(`/events/${eventId}`, eventData);
    return data;
}

export async function deleteEvent(eventId: number): Promise<Message> {
    const { data } = await axios.delete<Message>(`/events/${eventId}`);
    return data;
}