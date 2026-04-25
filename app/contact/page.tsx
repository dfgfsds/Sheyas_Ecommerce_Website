"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-cormorant)] text-[#6b4a3a] py-12 sm:py-20 px-6 sm:px-12 bg-white relative">

            <div className="max-w-[800px] mx-auto">
                {/* Header */}
                <h1 className="text-3xl sm:text-5xl text-center mb-10 sm:mb-16 italic font-serif opacity-80">Contact Us</h1>

                {/* Contact Form */}
                <form className="space-y-4 sm:space-y-6 mb-16 sm:mb-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full bg-white border border-[#6b4a3a]/30 rounded-md py-3 sm:py-3.5 px-6 italic focus:outline-none focus:border-[#6b4a3a] text-sm sm:text-base"
                        />
                        <input
                            type="email"
                            placeholder="Email *"
                            className="w-full bg-white border border-[#6b4a3a]/30 rounded-md py-3 sm:py-3.5 px-6 italic focus:outline-none focus:border-[#6b4a3a] text-sm sm:text-base"
                            required
                        />
                    </div>
                    <input
                        type="tel"
                        placeholder="Phone number"
                        className="w-full bg-white border border-[#6b4a3a]/30 rounded-md py-3 sm:py-3.5 px-6 italic focus:outline-none focus:border-[#6b4a3a] text-sm sm:text-base"
                    />
                    <textarea
                        placeholder="Comment"
                        rows={5}
                        className="w-full bg-white border border-[#6b4a3a]/30 rounded-md py-4 px-6 italic focus:outline-none focus:border-[#6b4a3a] text-sm sm:text-base"
                    ></textarea>

                    <div className="flex justify-center sm:justify-start">
                        <button className="bg-[#5a4636] text-white px-12 py-3 sm:py-3.5 rounded-full text-base font-bold italic hover:opacity-90 transition-all shadow-md w-full sm:w-auto">
                            Send
                        </button>
                    </div>
                </form>


            </div>

            <div className="max-w-7xl mx-auto">
                {/* Info Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-[#f9f8f4] p-6 sm:p-8 rounded-2xl min-h-[140px] sm:min-h-[160px]">
                        <h3 className="text-[10px] sm:text-sm font-medium opacity-60 mb-2 sm:mb-4 uppercase tracking-widest">Phone</h3>
                        <p className="text-base sm:text-lg italic leading-relaxed">+91 90493 44392</p>
                    </div>

                    <div className="bg-[#f9f8f4] p-6 sm:p-8 rounded-2xl min-h-[140px] sm:min-h-[160px]">
                        <h3 className="text-[10px] sm:text-sm font-medium opacity-60 mb-2 sm:mb-4 uppercase tracking-widest">Email</h3>
                        <p className="text-base sm:text-lg italic leading-relaxed break-words">support@sakinaabaya.com</p>
                    </div>

                    <div className="bg-[#f9f8f4] p-6 sm:p-8 rounded-2xl min-h-[140px] sm:min-h-[160px]">
                        <h3 className="text-[10px] sm:text-sm font-medium opacity-60 mb-2 sm:mb-4 uppercase tracking-widest">Address</h3>
                        <p className="text-xs sm:text-sm italic leading-relaxed opacity-80">
                            1st Floor, H No 718/1 Flat 103, Khatiza Apartment, Opp Banarasi Apt, Gaibi Nagar, Bhiwandi, Thane, Maharashtra, 421302
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
