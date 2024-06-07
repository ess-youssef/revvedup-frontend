import { Listing, ListingWithUserAndVehicle, PaginatedResponse, NewListing, NewListingResponse, EditListingResponse, EditListing, ListingWithVehicle, SellingResponse, SellData, DeleteResponse } from "../interfaces";
import axios from "./axios";

export async function getListings(page: number = 1, search: string | null): Promise<PaginatedResponse<ListingWithUserAndVehicle>> {
    const { data } = await axios.get<PaginatedResponse<ListingWithUserAndVehicle>>("/listings", {
        params: search == null ? { page } : { page, search }
    });
    return data;
}

export async function getListingDetails(id: number): Promise<ListingWithUserAndVehicle> {
    const { data } = await axios.get<ListingWithUserAndVehicle>(`/listings/${id}`);
    return data;
}

export async function createNewListing(newListingData: NewListing): Promise<NewListingResponse> {
    const {data} = await axios.post<NewListingResponse>(`/listings/create`, newListingData);
    return data;
}

export async function editListing(id: number, newListingData: EditListing): Promise<EditListingResponse> {
    const {data} = await axios.put<EditListingResponse>(`/listings/${id}`, newListingData);
    return data;
}

export async function getMyListings(userId: number, page: number = 1): Promise<PaginatedResponse<ListingWithVehicle>> {
    const {data} = await axios.get<PaginatedResponse<ListingWithVehicle>>(`/users/${userId}/listings`, {
        params: { page }
    });
    return data;
}

export async function deleteListing(id: number): Promise<DeleteResponse> {
    const{data} = await axios.delete<DeleteResponse>(`/listings/${id}`)
    return data;
}

export async function sell(id:number, sellData: SellData): Promise<SellingResponse> {
    const {data} = await axios.post<SellingResponse>(`/listings/${id}/sell`, sellData);
    return data;
}