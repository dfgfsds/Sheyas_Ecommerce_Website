"use client";

import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen  text-[#000000] py-12 sm:py-20 px-6 sm:px-12 bg-white flex flex-col items-center">

            <div className="max-w-[800px] w-full text-center space-y-10 sm:space-y-12">
                {/* Header */}
                <h1 className="text-3xl sm:text-5xl italic font-serif opacity-90">About Us</h1>

                {/* Content Sections */}
                <div className="space-y-8 sm:space-y-10">
                    <p className="text-base sm:text-xl italic leading-relaxed opacity-80">
                        At <span className="font-bold not-italic">Sheyas</span>, we believe an abaya is more than just clothing – it’s an expression of faith, grace, and individuality.
                    </p>

                    <p className="text-base sm:text-lg  opacity-80">
                        We specialize in:
                    </p>

                    {/* Specialty List */}
                    <div className="flex justify-center">
                        <ul className="space-y-3 sm:space-y-4 text-left">
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-[#000000] rounded-full flex-shrink-0"></span>
                                <p className="text-sm sm:text-lg  opacity-80">
                                    <span className="font-bold not-italic">Premium Fabrics</span> – breathable, long-lasting, and luxurious.
                                </p>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-[#000000] rounded-full flex-shrink-0"></span>
                                <p className="text-sm sm:text-lg  opacity-80">
                                    <span className="font-bold not-italic">Modern Designs</span> – modest yet stylish cuts that suit all occasions.
                                </p>
                            </li>
                            <li className="flex items-start gap-3 sm:pl-8">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-[#000000] rounded-full flex-shrink-0"></span>
                                <p className="text-sm sm:text-lg  opacity-80">
                                    <span className="font-bold not-italic">Craftsmanship</span> – attention to detail in every thread.
                                </p>
                            </li>
                        </ul>
                    </div>

                    <p className="text-base sm:text-xl italic leading-relaxed opacity-80 pt-2 sm:pt-4">
                        Whether you’re looking for a <span className="font-bold not-italic">classic black abaya</span>, an <span className="font-bold not-italic">embroidered masterpiece</span>, or a <span className="font-bold not-italic">custom design</span>, we ensure you feel both confident and comfortable.
                    </p>
                </div>

                {/* CTA Button */}
                <div className="pt-6 sm:pt-8">
                    <Link href="/eid-collection">
                        <button className="bg-[#000000] text-white px-10 sm:px-12 py-3 sm:py-3.5 rounded-full text-base sm:text-lg font-bold italic hover:opacity-90 transition-all shadow-lg tracking-wide w-full sm:w-auto">
                            Buy Now
                        </button>
                    </Link>
                </div>
            </div>

        </main>
    );
}
