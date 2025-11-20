import { motion } from "framer-motion";
import InfoCard from '../components/InfoCard';
import ContactFormCard from '../components/ContactFormCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { contactCards, contactPageData } from '../data/contactData';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#FBFCFD] mt-10">
            <motion.section
                className="relative bg-linear-to-r from-cyan-500 to-blue-500 py-20 text-white overflow-hidden"
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <img
                    src={contactPageData.bgImage}
                    alt="Contact Us"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        className="flex mx-auto items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-5"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <FontAwesomeIcon icon={contactPageData.icon} className="text-white text-2xl" />
                    </motion.div>
                    <motion.h1
                        className="text-2xl font-semibold text-white mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        {contactPageData.title}
                    </motion.h1>
                    <motion.p
                        className="text-white text-lg leading-relaxed max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        {contactPageData.description}
                    </motion.p>
                </div>
            </motion.section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <InfoCard {...card} />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="grid grid-cols-1 lg:w-2/3 mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <ContactFormCard />
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
