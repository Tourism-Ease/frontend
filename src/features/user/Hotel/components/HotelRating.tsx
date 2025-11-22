interface HotelRatingProps {
  averageRating: number;
}

export default function HotelRating({ averageRating }: HotelRatingProps) {
  // Calculate filled and empty stars
  const fullStars = Math.floor(averageRating);
  const halfStar = averageRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="lg:w-1/2 sm:w-full mt-6 border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-md bg-white">
      
      {/* Rating Number */}
      <div className="text-center sm:text-left">
        <p className="text-3xl font-extrabold text-gray-900">{averageRating.toFixed(1)}</p>
        <p className="text-gray-500 text-sm">Average Rating</p>
      </div>

      {/* Stars */}
      <div className="flex items-center mt-3 sm:mt-0 gap-1">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={`full-${i}`} className="text-yellow-400 text-xl">★</span>
          ))}
        {halfStar === 1 && <span className="text-yellow-400 text-xl">☆</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300 text-xl">★</span>
          ))}
      </div>

      {/* Optional label */}
      <div className="mt-3 sm:mt-0 text-sm text-gray-600">
        {averageRating >= 4.5
          ? "Excellent"
          : averageRating >= 4
          ? "Very Good"
          : averageRating >= 3
          ? "Good"
          : "Average"}
      </div>
    </div>
  );
}
