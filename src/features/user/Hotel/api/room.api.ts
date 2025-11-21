import http from "../../../../lib/axios";

export interface Room {
  _id: string;
  hotel: string;
  name: string;
  price: number;
  capacity: number;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export const getRoomsByHotelId = async (hotelId: string): Promise<Room[]> => {
  const { data } = await http.get("/room-types");

  // API returns: { results, paginationResult, data: [...] }
  const rooms = data.data;

  return rooms.filter((room: Room) => room.hotel === hotelId);
};
