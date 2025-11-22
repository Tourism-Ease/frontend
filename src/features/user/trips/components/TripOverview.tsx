interface TripOverviewProps {
    overview: string;
}

export default function TripOverview({ overview }: TripOverviewProps) {
    return (
        <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Overview</h3>
            <p className="text-lg text-gray-800">{overview}</p>
        </div>
    );
}
