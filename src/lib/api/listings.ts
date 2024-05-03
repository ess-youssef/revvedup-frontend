import { Listing, ListingWithUserAndVehicle, PaginatedResponse } from "../interfaces";
import axios from "./axios";

export async function listListings(page: number = 1): Promise<PaginatedResponse<ListingWithUserAndVehicle>> {
    const { data } = await axios.get<PaginatedResponse<ListingWithUserAndVehicle>>("/listings", {
        params: { page }
    });
    return data;
}