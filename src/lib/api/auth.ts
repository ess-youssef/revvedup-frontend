import { LoginData, LoginResponse } from "../interfaces";
import axios from "./axios";

export async function login(loginData: LoginData): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>("/auth/login", loginData);
    return data;
}
