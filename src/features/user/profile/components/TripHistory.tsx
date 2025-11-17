import { useTrips } from "../hooks/useTrips";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

export default function TripHistory() {
  const { data: tripsData, isLoading } = useTrips();

  if (isLoading) return <p>Loading trips...</p>;

  if (!tripsData?.trips?.length)
    return <p className="text-gray-500">No trips found.</p>;

  return (
    <div className="space-y-4">
      {tripsData.trips.map((trip) => (
        <Card key={trip.id}>
          <CardHeader>
            <CardTitle className="text-lg">{trip.destination}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">{trip.date}</p>
                <p className="text-sm capitalize">{trip.status}</p>
              </div>
              <p className="font-bold text-lg">${trip.price}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
