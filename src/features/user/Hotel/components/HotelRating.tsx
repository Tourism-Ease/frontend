interface HotelRatingProps {
  averageRating: number;
}
export default function HotelRating({ averageRating }: HotelRatingProps) {
  return (
    <>
      <div className="lg:w-1/2 mt-6 sm:w-full border rounded-2xl p-5 flex items-center justify-evenly shadow-sm bg-white">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 32 32"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            className="w-8 h-8 text-black"
          >
            <path d="M16 3C12 10 6 10 6 16c0 5 4 8 10 12 6-4 10-7 10-12 0-6-6-6-10-13z" />
          </svg>

          <div>
            <p className="font-semibold text-lg">Guest favorite</p>
            <p className="text-gray-600 text-sm -mt-1">
              One of the most loved homes on our platform, according to guests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-center">
            <p className="text-2xl font-semibold">{averageRating}</p>

            <div className="flex gap-1 text-yellow-500 text-sm ">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span key={i}>★</span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
