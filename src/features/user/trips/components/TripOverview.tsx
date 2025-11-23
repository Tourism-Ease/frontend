interface TripOverviewProps {
    overview: string;
}

export default function TripOverview({ overview }: TripOverviewProps) {
    return (
        <div className="mb-8">
            <p className="text-lg text-gray-800">{overview}</p>
        </div>
    );
}
