import { RegisterData, RegisterResponse } from "../interfaces";
import axios from "./axios";

export async function registerUser(registerData: RegisterData): Promise<RegisterResponse> {
    const { data } = await axios.post<RegisterResponse>("/users/register", registerData);
    return data;
}