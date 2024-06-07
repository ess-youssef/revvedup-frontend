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
    token: string | null;
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

export interface SellData {
    buyer: number
}

export type RegisterResponse = Message;

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

export type LogoutResponse = Message;

export type SellingResponse = Message;

export type DeleteResponse = Message;

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

export interface NewListing {
    price: number;
    mileage: number;
    description: string;
    vehicle: number;
}

export type EditListing = Omit<NewListing, "vehicle">;

export type NewListingResponse = ListingWithUserAndVehicle;
export type EditListingResponse = ListingWithUserAndVehicle;

export interface ListingWithVehicle extends Listing {
    vehicle: Vehicle;
}

export interface ListingWithUser extends Listing {
    author: User;
}

export type ListingWithUserAndVehicle = ListingWithVehicle & ListingWithUser;

export type VehicleWithUser = Vehicle & VehicleWithOwner;

export interface NewVehicleData {
    make: string;
    model: string;
    year: number;
    description: string;
    photos: File[]
}

export interface EditVehicleData extends NewVehicleData {
    deletedPhotos?: any[];
}
 
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

export interface NewPostData {
    title: string;
    content: string;
}

export interface EditPostData extends NewPostData {};

export interface Post {
    id: number;
    title: string;
    content: string;
    author: User;
    comments_count: number;
    upvotes_count: number;
    upvoted_by_user: boolean;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    content: string;
    author: User;
    upvotes_count: number;
    upvoted_by_user: boolean;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    attendance_count: number;
    attended_by_user: boolean;
    created_at: string;
    updated_at: string;
}

export interface NewEventData {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
}

export interface EditEventData extends NewEventData {}