"use client";

import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#060303] text-[#e7dcd4] px-10 py-16">

            {/* Top Links */}
            <div className="flex md:flex-row flex-wrap justify-center gap-10 text-base mb-16 tracking-wide">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Return Policy</a>
                <a href="#" className="hover:underline">Shipping Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
            </div>

            {/* Middle Section */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-12">

                {/* Left - Logo */}
                <div className="flex-1 flex justify-start">
                    <div className="relative w-[180px] h-[60px]">
                        <Image
                            src="/logo.png"
                            alt="Sukina Abaya Logo"
                            fill
                            className="object-contain brightness-0 invert"
                        />
                    </div>
                </div>

                {/* Center - Newsletter */}
                <div className="flex-1 flex flex-col items-center">
                    <p className="mb-4 text-sm font-medium tracking-widest uppercase">Sign up for updates</p>
                    <div className="border border-[#e7dcd4]/30 rounded-full px-6 py-3 flex items-center w-full max-w-[400px] bg-white/5 focus-within:bg-white/10 transition-colors">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="bg-transparent outline-none text-sm w-full placeholder-[#e7dcd4]/50"
                        />
                        <button className="ml-2 text-xl hover:translate-x-1 transition-transform cursor-pointer">→</button>
                    </div>
                </div>

                {/* Right - Social Icons */}
                <div className="flex-1 flex justify-end gap-8">
                    <FaFacebookF className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
                    <FaInstagram className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
                </div>

            </div>

            {/* Bottom Divider */}
            <div className="border-t border-[#dccbcb] mt-10"></div>

            <p className="text-center text-xs mt-8 text-[#e7dcd4]/80 tracking-wide">
                &copy; {new Date().getFullYear()} Sheyas. All Rights Reserved.
            </p>
        </footer>
    );
}