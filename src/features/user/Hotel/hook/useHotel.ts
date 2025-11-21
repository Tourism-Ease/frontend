import { useQuery } from "@tanstack/react-query";
import { getHotelById } from "../api/hotel.api";
import type { Hotel } from "../api/hotel.api";
export const useHotel = (id: string) => {
  return useQuery<Hotel>({
    queryKey: ["hotel", id],
    queryFn: () => getHotelById(id),
    enabled: !!id,
  });
};
