import { useUserStore } from "@/store";
import { DeleteResponse, PaginatedResponse, RegisterData, RegisterResponse, User, Vehicle, VehicleWithUser } from "../interfaces";
import axios from "./axios";

export async function me(): Promise<User> {
    const { data } = await axios.get<User>("/users/me");
    return data;
}

export async function registerUser(registerData: RegisterData): Promise<RegisterResponse> {
    const { data } = await axios.post<RegisterResponse>("/users/register", registerData);
    return data;
}

export async function userVehicles(userId: number): Promise<VehicleWithUser[]> {
    const { data } = await axios.get<VehicleWithUser[]> (`/users/${userId}/vehicles`);
    return data;
}

export async function deleteMyVehicles(id: number): Promise<DeleteResponse> {
    const{data} = await axios.delete<DeleteResponse>(`/vehicles/${id}`)
    return data;
}

export async function users(page: number = 1, search: string | null): Promise<PaginatedResponse<User>> {
    const { data } = await axios.get<PaginatedResponse<User>>("/users/all", {
        params: search == null ? { page } : { page, search }
    });
    return data;
}