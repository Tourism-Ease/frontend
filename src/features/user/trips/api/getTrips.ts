import http from "../../../../lib/axios";
import type { Trip } from "../types/Trip";

export const getTrips = async (): Promise<Trip[]> => {
    const res = await http.get("/trips");
    return res.data.data;
};
