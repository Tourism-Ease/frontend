import { useQuery } from "@tanstack/react-query";
import { getRoomsByHotelId } from "../api/room.api";
import type { Room } from "../api/room.api";

export const useRooms = (hotelId: string) => {
  return useQuery<Room[]>({
    queryKey: ["rooms", hotelId],
    queryFn: () => getRoomsByHotelId(hotelId),
    enabled: !!hotelId,
  });
};
