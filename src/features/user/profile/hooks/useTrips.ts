import { useQuery } from "@tanstack/react-query";
import { getMyTrips } from "../api/profile.api";
import type { TripsResponse } from "../types";

export const useTrips = () => {
  return useQuery<TripsResponse>({
    queryKey: ["trips"],
    queryFn: getMyTrips,
  });
};
