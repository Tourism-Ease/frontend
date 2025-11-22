interface TripInfoProps {
  duration: string;
  pickUp: {
    time: string;
    place: string;
  };
}

export default function TripInfo({ duration, pickUp }: TripInfoProps) {
  return (
    <div className="flex flex-col gap-2.5 lg:flex-row lg:justify-between text-lg font-semibold mb-8">
      <p className="px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium border border-green-200 shadow-sm">
        Duration: {duration}
      </p>
      <p className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200 shadow-sm">
        Pick-up: {pickUp.place}, {pickUp.time}
      </p>
    </div>
  );
}
