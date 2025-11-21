// import { useParams } from "react-router";
// import { useHotel } from "../hook/useHotel";
// import HotelImages from "../components/HotelImages";

import HotelCard from "../components/HotelCard";
import { useAllHotels } from "../hook/useAllHotels";

export default function HotelPage() {
  // const { id } = useParams();
  // const { data: hotel, isLoading, error } = useHotel(id!);

  const { data: hotels, isLoading, error } = useAllHotels();

  if (isLoading) return <div className="p-6">Loading hotels...</div>;
  if (error) return <div className="p-6">Error loading hotels</div>;
  if (!hotels || hotels.length === 0)
    return <div className="p-6">No hotels found</div>;

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading hotel</div>;
  // if (!hotel) return <div>No hotel found</div>;

  return (
    <>
      <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.map((hotel: any) => (
          <HotelCard
            key={hotel.id}
            id={hotel.id}
            name={hotel.name}
            city={hotel.address.city}
            country={hotel.address.country}
            stars={hotel.stars}
            image={hotel.imageCoverUrl}
            description={hotel.description}
          />
        ))}
      </div>
      {/* <div>
        <HotelImages cover={hotel.imageCoverUrl} images={hotel.imagesUrls} />
      </div> */}
    </>
  );
}
