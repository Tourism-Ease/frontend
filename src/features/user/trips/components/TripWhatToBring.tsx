interface TripWhatToBringProps {
    items: string[];
}

export default function TripWhatToBring({ items }: TripWhatToBringProps) {
    return (
        <div>
            {items.length ? (
                <div className="flex flex-wrap gap-2">
                    {items.map((w, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200 transition">
                            {w}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No specific items</p>
            )}
        </div>
    );
}
