"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
    return (
        <main className="min-h-screen  py-12 sm:py-20 px-6 sm:px-12 bg-white relative">

            <div className="max-w-[800px] mx-auto">
                {/* Header */}
                <h1 className="text-3xl sm:text-5xl text-[#000000] text-center mb-10 sm:mb-16 italic font-serif opacity-80">Contact Us</h1>

                {/* Contact Form */}
                <form className="space-y-4 sm:space-y-6 mb-16 sm:mb-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full bg-white border border-[#000000]/30 rounded-md py-3 sm:py-3.5 px-6 italic focus:outline-none focus:border-[#6b4a3a] text-sm sm:text-base"
                        />
                        <input
                            type="email"
                            placeholder="Email *"
                            className="w-full bg-white border border-[#000000]/30 rounded-md py-3 sm:py-3.5 px-6 italic focus:outline-none focus:border-[#6b4a3a] text-sm sm:text-base"
                            required
                        />
                    </div>
                    <input
                        type="tel"
                        placeholder="Phone number"
                        className="w-full bg-white border border-[#000000]/30 rounded-md py-3 sm:py-3.5 px-6 italic focus:outline-none focus:border-[#000000] text-sm sm:text-base"
                    />
                    <textarea
                        placeholder="Comment"
                        rows={5}
                        className="w-full bg-white border border-[#000000]/30 rounded-md py-4 px-6 italic focus:outline-none focus:border-[#000000] text-sm sm:text-base"
                    ></textarea>

                    <div className="flex justify-center sm:justify-start">
                        <button className="bg-[#000000] text-white px-12 py-3 sm:py-3.5 rounded-full text-base font-bold italic hover:opacity-90 transition-all shadow-md w-full sm:w-auto">
                            Send
                        </button>
                    </div>
                </form>

                {/* https://www.instagram.com/reel/DTMqKlnipYj/ */}

            </div>

            <div className="max-w-7xl mx-auto">
                {/* Info Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl min-h-[140px] sm:min-h-[160px]">
                        <h3 className="text-[10px] sm:text-sm font-bold mb-2 sm:mb-4 uppercase tracking-widest">Phone</h3>
                        <p className="text-base sm:text-lg italic leading-relaxed">+91 93859 56032</p>
                    </div>

                    <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl min-h-[140px] sm:min-h-[160px]">
                        <h3 className="text-[10px] sm:text-sm font-bold mb-2 sm:mb-4 uppercase tracking-widest">Email</h3>
                        <p className="text-base sm:text-lg  leading-relaxed break-words">sheyas.co@gmail.com</p>
                    </div>

                    <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl min-h-[140px] sm:min-h-[160px]">
                        <h3 className="text-[10px] sm:text-sm font-bold mb-2 sm:mb-4 uppercase tracking-widest">Address</h3>
                        <p className="text-xs sm:text-sm text-[#000000] leading-relaxed opacity-80">
                            Fine Center, 30/2A, East St, Anna Nagar, Madurai, Tamil Nadu 625020
                        </p>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-12 sm:mt-20">
                    <div className="w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-gray-100  transition-all duration-700">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.1528179542083!2d78.1442514!3d9.921227999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c515635d5d21%3A0xc0a484b8a9c5dab4!2sHaya%20Fashion!5e0!3m2!1sen!2sin!4v1777291692258!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </main>
    );
}
