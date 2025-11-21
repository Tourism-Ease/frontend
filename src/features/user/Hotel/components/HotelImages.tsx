import { useEffect, useState } from "react";
interface HotelImagesProps {
  cover: string;
  images: string[];
}

export default function HotelImages({ cover, images }: HotelImagesProps) {
  const gallery = [cover, ...images].slice(0, 5);
  const allImages = [cover, ...images];

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (i: number) => {
    setCurrentIndex(i);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* GALLERY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-2 md:gap-3 rounded-xl overflow-hidden mb-6">
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => openModal(0)}
        >
          <img
            src={gallery[0]}
            className="w-full h-[250px] md:h-[420px] object-cover rounded-xl"
          />
        </div>

        {/* Small images */}
        {gallery.slice(1).map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer"
            onClick={() => openModal(i + 1)}
          >
            <img
              src={img}
              className="w-full h-[120px] hidden lg:flex md:h-[205px] object-cover rounded-xl"
            />

            {/* "Show all photos" on last image */}
            {i === gallery.length - 2 && (
              <button className="absolute bottom-3 md:bottom-8 lg:bottom-2 right-2 bg-white px-3 py-1.5 w-40 rounded-lg text-sm font-semibold uppercase cursor-pointer hover:bg-gray-300 transition">
                show more
              </button>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="relative w-full max-w-5xl p-4">
            <img
              src={allImages[currentIndex]}
              className="w-2/3 mx-auto lg:w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Close */}
            <button
              className="absolute -top-8 right-4 text-white text-3xl font-bold hover:text-gray-300 transition cursor-pointer"
              onClick={closeModal}
            >
              ✕
            </button>

            {/* Prev */}
            <button
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300 transition cursor-pointer"
              onClick={prevImage}
            >
              ❮
            </button>

            {/* Next */}
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 text-white text-4xl font-bold hover:text-gray-300 transition cursor-pointer"
              onClick={nextImage}
            >
              ❯
            </button>
          </div>
        </div>
      )}
    </>
  );
}
