import { useQuery } from "@tanstack/react-query";
import { getTrip } from "../api/trip.api";

export default function useTrip(id: string) {
    return useQuery({
        queryKey: ["trip", id],
        queryFn: () => getTrip(id),
    });
}
