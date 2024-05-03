export interface PaginatedResponse<T> {
    data: T[],
    links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
    },
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: { url: string | null, label: string, active: boolean }[],
        path: string;
        per_page: number;
        to: number;
        total: number;
    }
}

export interface TokenStorage {
    token: string;
}

export type TokenLocalStorage = TokenStorage | null;

export interface Message {
    message: string;
}

export interface RegisterData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export type RegisterResponse = Message;

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}

const UserRoleValues = ["REGULAR", "ADMIN"] as const;
type UserRole = typeof UserRoleValues[number];

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    profile_picture: string;
    role: UserRole;
}

const ListingStatusValues = ["FORSALE", "SOLD"] as const;
type ListingStatus = typeof ListingStatusValues[number];

export interface Listing {
    id: number;
    price: number;
    mileage: number;
    description: string;
    status: ListingStatus;
}

export interface ListingWithVehicle extends Listing {
    vehicle: Vehicle;
}

export interface ListingWithUser extends Listing {
    user: User;
}

export type ListingWithUserAndVehicle = ListingWithVehicle & ListingWithUser;
 
export interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    description: string;
    images: VehicleImage[]
}

export interface VehicleWithOwner extends Vehicle {
    owner: User;
}

export interface VehicleImage {
    id: number;
    image_path: string;
}