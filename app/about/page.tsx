"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <main className="min-h-screen text-[#000000] py-12 sm:py-20 px-6 sm:px-12 bg-white flex flex-col items-center overflow-hidden">

            <motion.div 
                className="max-w-[800px] w-full text-center space-y-10 sm:space-y-12"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                {/* Header */}
                <motion.h1 
                    className="text-3xl sm:text-5xl italic font-serif opacity-90"
                    variants={fadeInUp}
                >
                    About Us
                </motion.h1>

                {/* Content Sections */}
                <motion.div className="space-y-8 sm:space-y-10" variants={fadeInUp}>
                    <motion.p 
                        className="text-base sm:text-xl italic leading-relaxed opacity-80"
                        variants={fadeInUp}
                    >
                        At <span className="font-bold not-italic">Sheyas</span>, we believe an abaya is more than just clothing – it’s an expression of faith, grace, and individuality.
                    </motion.p>

                    <motion.p className="text-base sm:text-lg opacity-80" variants={fadeInUp}>
                        We specialize in:
                    </motion.p>

                    {/* Specialty List */}
                    <motion.div className="flex justify-center" variants={fadeInUp}>
                        <ul className="space-y-3 sm:space-y-4 text-left">
                            {[
                                { title: "Premium Fabrics", desc: "breathable, long-lasting, and luxurious." },
                                { title: "Modern Designs", desc: "modest yet stylish cuts that suit all occasions." },
                                { title: "Craftsmanship", desc: "attention to detail in every thread." }
                            ].map((item, index) => (
                                <motion.li 
                                    key={index} 
                                    className={`flex items-start gap-3 ${index === 2 ? 'sm:pl-8' : ''}`}
                                    variants={fadeInUp}
                                >
                                    <span className="mt-1.5 w-1.5 h-1.5 bg-[#000000] rounded-full flex-shrink-0"></span>
                                    <p className="text-sm sm:text-lg opacity-80">
                                        <span className="font-bold not-italic">{item.title}</span> – {item.desc}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.p 
                        className="text-base sm:text-xl italic leading-relaxed opacity-80 pt-2 sm:pt-4"
                        variants={fadeInUp}
                    >
                        Whether you’re looking for a <span className="font-bold not-italic">classic black abaya</span>, an <span className="font-bold not-italic">embroidered masterpiece</span>, or a <span className="font-bold not-italic">custom design</span>, we ensure you feel both confident and comfortable.
                    </motion.p>
                </motion.div>

                {/* CTA Button */}
                <motion.div className="pt-6 sm:pt-8" variants={fadeInUp}>
                    <Link href="/eid-collection">
                        <motion.button 
                            className="bg-[#000000] text-white px-10 sm:px-12 py-3 sm:py-3.5 rounded-full text-base sm:text-lg font-bold italic hover:opacity-90 transition-all shadow-lg tracking-wide w-full sm:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Buy Now
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.div>

        </main>
    );
}
