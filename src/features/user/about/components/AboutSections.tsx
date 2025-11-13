import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import { values, mission, storyText } from "../data/aboutData";
import { motion } from "framer-motion";

export default function AboutSections() {
    return (
        <>
            <motion.section
                className="py-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl text-center font-semibold mb-8">Our Story</h2>
                        <div className="space-y-4 text-gray-500">
                            <p>{storyText}</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-center text-2xl font-semibold mb-4">Our Values</h2>
                    <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
                        The principles that guide everything we do and every adventure we create
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v, i) => (
                            <motion.div
                                key={i}
                                className="bg-white p-6 rounded-xl hover:shadow-md transition-all duration-300 border-0 cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-blue-500 mb-4">
                                    <FontAwesomeIcon icon={v.icon as IconProp} size="2x" />
                                </div>
                                <h3 className="mb-3 font-semibold">{v.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{v.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <motion.section
                className="relative py-24 overflow-hidden"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500" />
                {mission.backgroundImage && (
                    <img
                        src={mission.backgroundImage}
                        alt="Mission background"
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                )}
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6 text-white">
                            <FontAwesomeIcon icon={mission.icon as IconProp} size="2x" />
                        </div>
                        <h2 className="text-3xl font-semibold mb-6 text-white">{mission.title}</h2>
                        <p className="text-lg text-white leading-relaxed">{mission.text}</p>
                    </div>
                </div>
            </motion.section>
        </>
    );
}
