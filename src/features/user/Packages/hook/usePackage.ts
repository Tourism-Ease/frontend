import { useQuery } from "@tanstack/react-query";
import { getPackage } from "../api/Package.api";
import type { PackageType } from "../types/Package";

export default function usePackage(id: string) {
    return useQuery<PackageType>({
        queryKey: ["package", id],
        queryFn: async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await getPackage(id);
            const mapped: PackageType = {
                id: response.id,
                title: response.title,
                shortDesc: response.shortDesc,
                description: response.description,
                durationDays: response.durationDays,
                imageCover: response.imageCover,
                imageCoverUrl: response.imageCoverUrl,
                images: response.images || [],
                imagesUrls: response.imagesUrls || [],
                hotel: response.hotel,
                destination: response.destination,
                pickupLocations: response.pickupLocations,
                itinerary: response.itinerary,
                transportation: response.transportation,
                capacity: response.capacity,
                departureDate: response.departureDate,
                availableSeats: response.availableSeats,
                prices: {
                    egyptianPrice: response.egyptianPrice,
                    childrenPrice: response.childrenPrice,
                    foreignerPrice: response.foreignerPrice,
                },
            };
            return mapped;
        },
    });
}

