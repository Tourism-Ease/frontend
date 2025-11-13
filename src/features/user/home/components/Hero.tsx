import * as React from "react";
import { motion } from "framer-motion";
import hero1 from "@/assets/hero1.webp";
import hero2 from "@/assets/hero2.webp";
import hero3 from "@/assets/hero3.webp";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function Hero() {
  const images: string[] = [hero1, hero2, hero3];
  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        opts={{ loop: true }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <CarouselContent>
          {images.map((img, i) => (
            <CarouselItem key={i}>
              <div
                className="relative w-full h-screen bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(${img})` }}
              >
                <span className="absolute inset-0 bg-black/50" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
        <motion.h1
          initial={{ y: -100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-wide"
        >
          DISCOVER
        </motion.h1>
        <motion.p
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
          className="font-[Pacifico] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light"
        >
          the world
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 flex gap-4"
        >
          <button className="relative overflow-hidden mx-2 px-8 py-3 rounded-2xl text-white border border-white/70 font-medium group backdrop-blur-sm transition">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 translate-x-0 group-hover:-translate-x-full transition-transform duration-500"></span>
            <span className="relative z-10">EXPLORE NOW</span>
          </button>
          <button className="relative overflow-hidden mx-2 px-8 py-3 rounded-2xl text-white border border-white/70 font-medium group backdrop-blur-sm transition">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></span>
            <span className="relative z-10">LEARN MORE</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
