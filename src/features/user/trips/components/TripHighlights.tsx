interface TripHighlightsProps {
    highlights: string[];
}

export default function TripHighlights({ highlights }: TripHighlightsProps) {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Highlights</h2>
            {highlights.length ? (
                <div className="flex flex-wrap gap-2">
                    {highlights.map((h, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium hover:bg-blue-200 transition">
                            {h}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No highlights provided</p>
            )}
        </div>
    );
}
