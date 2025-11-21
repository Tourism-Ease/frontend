import { useQuery } from "@tanstack/react-query";
import { getTrips } from "../api/getTrips";
import type { Trip } from "../types/Trip";

export default function useTrips() {
    return useQuery<Trip[]>({
        queryKey: ["trips"],
        queryFn: getTrips,
    });
}
