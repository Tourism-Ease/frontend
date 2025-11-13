import heroImg from "@/assets/Hurghada.webp";
import { motion } from "framer-motion";
// import { useNavigate } from "react-router";

export default function BestPackages() {
  // const navigate = useNavigate();

  interface Package {
    img: string;
    title: string;
    desc: string;
  }

  const packages: Package[] = [
    {
      img: heroImg,
      title: "Luxury Beach Escape",
      desc: "Enjoy a relaxing vacation at top beach resorts with stunning views.",
    },
    {
      img: heroImg,
      title: "Adventure Trip",
      desc: "Explore exciting destinations with adventure-packed itineraries.",
    },
    {
      img: heroImg,
      title: "Cultural Tour",
      desc: "Discover local heritage and immerse yourself in unique experiences.",
    },
    {
      img: heroImg,
      title: "Family Vacation",
      desc: "Fun-filled trips designed for the whole family to enjoy.",
    },
  ];

  // const handleClick = (id: string) => navigate("/");

  return (
    <>
      <div className="pt-30">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ y: -80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Best Package
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
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-items-center"
        >
          {packages.map((pack, idx) => (
            <div
            // onClick={handleClick}
              key={idx}
              className=" max-w-sm bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition border border-gray-100"
            >
              <div className="overflow-hidden">
                <img
                  src={pack.img}
                  alt="package preview"
                  className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-3 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {pack.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {pack.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
