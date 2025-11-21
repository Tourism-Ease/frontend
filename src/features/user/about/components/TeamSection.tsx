import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { teamMembers } from "../data/aboutData";
import { motion } from "framer-motion";

export default function TeamSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl font-semibold mb-4">Meet Our Team</h2>
                <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
                    Passionate travel experts dedicated to creating your perfect adventure
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {teamMembers.map((name, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div
                                key={i}
                                className="bg-white p-6 text-center rounded-xl hover:shadow-md transition-all duration-300 border-0 cursor-pointer"
                            >
                                <div className="w-24 h-24 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 mx-auto mb-4 flex items-center justify-center text-white">
                                    <FontAwesomeIcon icon={faUser} size="2x" />
                                </div>
                                <h3 className="mb-1 font-semibold">{name}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Passionate about travel and making your trip unforgettable.
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section >
    );
}
