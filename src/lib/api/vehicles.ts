import { EditVehicleData, NewVehicleData, Vehicle } from "../interfaces";
import axios from "./axios";

export async function createVehicle(vehicleData: NewVehicleData): Promise<Vehicle> {
    const {data} = await axios.postForm<Vehicle>("/vehicles/register", vehicleData);
    return data;
}

export async function getVehicleDetails(vehicleId: number): Promise<Vehicle> {
    const {data} = await axios.get<Vehicle>(`/vehicles/${vehicleId}`);
    return data;
}

export async function editVehicle(vehicleId: number, vehicleData: EditVehicleData): Promise<Vehicle> {
    const {data} = await axios.postForm<Vehicle>(`/vehicles/${vehicleId}`, vehicleData);
    return data;
}