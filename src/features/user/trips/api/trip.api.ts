import http from "../../../../lib/axios";
import type { Trip } from "../types/Trip";


export const getTrip = async (id: string): Promise<Trip> => {
    const res = await http.get(`/trips/${id}`);
    return res.data.data;
};
