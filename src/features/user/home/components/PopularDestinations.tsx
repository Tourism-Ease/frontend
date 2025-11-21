import sharm from "@/assets/sharm.jpeg";
import luxur from "@/assets/luxur.jpg";
import Hurghda from "@/assets/Hurghada.webp";
import Dahab from "@/assets/Dahab.jpg";
import { motion } from "framer-motion";
import { useState } from "react";
export default function PopularDestinations() {
  const [hoverFactor, setHoverFactor] = useState<number>(0);

  interface Destination {
    img: string;
    name: string;
  }
  const destinations: Destination[] = [
    {
      img: sharm,
      name: "Sharm Elshikh",
    },
    {
      img: luxur,
      name: "Luxur",
    },
    {
      img: Hurghda,
      name: "Hurghada",
    },
    {
      img: Dahab,
      name: "Dahab",
    },
  ];

  const scrollingItems = [...destinations, ...destinations];

  return (
    <>
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-30 overflow-x-clip">
        <div className="text-center mb-10 ">
          <motion.h2
            initial={{ y: -80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Popular Destinations
          </motion.h2>
          <motion.p
            initial={{ y: -80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className="mt-3 text-gray-600 text-base sm:text-lg md:text-xl"
          >
            Discover the world's most breathtaking locations
          </motion.p>
        </div>

        <div
          className="relative w-full "
          onMouseEnter={() => setHoverFactor(0.6)} // slower on hover
          onMouseLeave={() => setHoverFactor(0)} // normal speed when not hovering
        >
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 35 * (1 - hoverFactor), // adjust smoothness
                ease: "linear",
              },
            }}
          >
            {scrollingItems.map((dest, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-[250px] sm:w-[280px] md:w-[300px] lg:w-[320px] flex-shrink-0 cursor-pointer group rounded-3xl overflow-hidden relative"
              >
                {/* Image */}
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-full h-80 sm:h-96 md:h-80 object-cover duration-500 group-hover:scale-110 rounded-3xl"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-[#0f1823] bg-opacity-[0.88] text-neutral-300 p-6 flex flex-col justify-center items-center gap-3 opacity-0 group-hover:opacity-85 transition-opacity duration-500 rounded-3xl">
                  <span className="font-bold text-2xl sm:text-3xl text-center">
                    {dest.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
