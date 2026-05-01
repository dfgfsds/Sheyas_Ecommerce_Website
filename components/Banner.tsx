"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Banner() {
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

            {/* Decorative bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
        </section>
    );
}
