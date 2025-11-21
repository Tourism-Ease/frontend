import { useQuery } from "@tanstack/react-query";
import { profileAPI } from "../api/profile.api";
import type { TripsResponse } from "../types";

export const useTrips = () =>
  useQuery<TripsResponse>({
    queryKey: ["trips"],
    queryFn: profileAPI.getTrips,
  });
