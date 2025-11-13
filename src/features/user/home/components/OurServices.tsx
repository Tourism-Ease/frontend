import servicesImg from "@/assets/services.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {
  faPlane,
  faSuitcaseRolling,
  faHotel,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
export default function OurServices() {
  interface Service {
    icon: any;
    title: string;
    desc: string;
  }

  const services: Service[] = [
    {
      icon: faPlane,
      title: "Book Trips",
      desc: "Easily book trips to your favorite destinations worldwide.",
    },
    {
      icon: faSuitcaseRolling,
      title: "Full Packages",
      desc: "All-inclusive vacation packages with hotels, meals, and tours.",
    },
    {
      icon: faCreditCard,
      title: "Secure Payment & Refund",
      desc: "Safe and fast payment options with easy refund policies.",
    },
    {
      icon: faHotel,
      title: "Hotel Booking",
      desc: "Book hotels anywhere with instant confirmation and great deals.",
    },
  ];
  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-10 px-4 sm:px-6 lg:px-20 pt-30">
        {/* Left Image */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className="md:w-1/2 w-full"
        >
          <img
            src={servicesImg}
            alt="Our Services"
            className="w-full h-130 rounded-3xl object-cover"
          />
        </motion.div>

        {/* Right Services */}
        <div className="md:w-1/2 w-full flex flex-col gap-8">
          <motion.h2
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-gray-600 text-lg sm:text-xl"
          >
            Explore our travel services designed to make your vacation seamless
            and unforgettable.
          </motion.p>

          <motion.div
            // initial={{ x: 80, opacity: 0 }}
            // whileInView={{ x: 0, opacity: 1 }}
            // transition={{ duration: 0.8, ease: "easeOut" }}
            // viewport={{ once: true, amount: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 "
          >
            {services.map((serv, idx) => (
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.4 }}
                key={idx}
                className="flex items-start gap-4 bg-white shadow-md p-4 rounded-2xl hover:shadow-blue-200 transition"
              >
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="text-blue-500 text-3xl"
                >
                  <FontAwesomeIcon icon={serv.icon} />
                </motion.div>
                <div>
                  <motion.h3
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                    className="font-bold text-lg sm:text-xl"
                  >
                    {serv.title}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.4 }}
                    className="text-gray-600 text-sm sm:text-base"
                  >
                    {serv.desc}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
