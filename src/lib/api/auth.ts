import { LoginData, LoginResponse, LogoutResponse } from "../interfaces";
import axios from "./axios";

export async function login(loginData: LoginData): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>("/auth/login", loginData);
    return data;
}

export async function logout(): Promise<LogoutResponse> {
    const { data } = await axios.post<LogoutResponse>("/auth/logout");
    return data;
}
