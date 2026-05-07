"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Banner() {
    const router = useRouter();
    return (
        <section className="relative w-full h-[450px] sm:h-[500px] md:h-[600px] overflow-hidden">
            {/* Background Image with subtle zoom animation */}
            <motion.div 
                className="absolute inset-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
            >
                <Image
                    src="https://content.jdmagicbox.com/v2/comp/madurai/l2/0452px452.x452.250409040028.q5l2/catalogue/haya-fashion-anna-nagar-madurai-readymade-garment-retailers-8r8a79urlq.jpg"
                    alt="Luxury Boutique Interior"
                    fill
                    className="object-cover"
                    priority
                />
            </motion.div>



            {/* Subtle Overlay to enhance visual depth */}
            <div className="absolute inset-0 bg-black/5"></div>

            {/* Shop Now Button */}
            <div className="absolute inset-0 flex items-center justify-center sm:justify-end sm:items-center md:justify-center lg:justify-start lg:items-center xl:justify-center">
                <motion.button
                    className="bg-[#000000] text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 xl:px-14 xl:py-7 rounded-full font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-wide hover:bg-white hover:text-black transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/products')}
                >
                    SHOP NOW
                </motion.button>
            </div>

            {/* Decorative bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        </section>
    );
}
