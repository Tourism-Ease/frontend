interface TripInfoProps {
  duration: string;
  pickUp: {
    time: string;
    place: string;
  };
}

export default function TripInfo({ duration, pickUp }: TripInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm font-medium">
      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 shadow-sm">
        Duration: {duration}
      </span>
      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 shadow-sm">
        Pick-up: {pickUp.place}, {pickUp.time}
      </span>
    </div>
  );
}
