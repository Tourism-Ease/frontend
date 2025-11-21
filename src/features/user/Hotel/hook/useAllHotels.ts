import { useQuery } from "@tanstack/react-query";
import { getAllHotels } from "../api/hotel.api";

export const useAllHotels = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: getAllHotels,
  });
};
