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
            <p>Duration: {duration}</p>
            <p>Pick-up: {pickUp.place}, {pickUp.time}</p>
        </div>
    );
}
