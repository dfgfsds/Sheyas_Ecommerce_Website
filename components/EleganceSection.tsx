"use client";

import { motion } from "framer-motion";

export default function EleganceSection() {
    return (
        <section className="bg-[#f5f3ef] py-16 px-4 text-center overflow-hidden">
            <motion.div
                className="max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >

                {/* Title */}
                <motion.h2
                    className="text-3xl sm:text-4xl font-serif text-[#000000] tracking-wide"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Elegance in Every Stitch
                </motion.h2>

                {/* Divider */}
                <motion.div
                    className="w-16 h-[1px] bg-[#000000] mx-auto my-6"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                ></motion.div>

                {/* Description */}
                <motion.p
                    className="text-sm sm:text-base text-gray-800 leading-relaxed tracking-wide"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                >
                    Discover timeless abayas crafted with care, comfort, and style.
                    From everyday wear to special occasions, our collection blends
                    tradition with modern elegance.
                </motion.p>

            </motion.div>
        </section>
    );
}