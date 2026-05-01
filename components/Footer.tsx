"use client";

import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#060303] text-[#e7dcd4] px-10 py-16">

            {/* Middle Section - Logo, Policies, Socials */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-10">

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

                {/* Center - Policy Links */}
                <div className="flex-[2] flex flex-wrap justify-center gap-6 sm:gap-8 text-sm sm:text-base tracking-wide italic">
                    <a href="#" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
                    <a href="#" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">Return Policy</a>
                    <a href="#" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">Shipping Policy</a>
                    <a href="#" className="hover:underline opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a>
                </div>

                {/* Right - Social Icons */}
                <div className="flex-1 flex justify-end gap-6 sm:gap-8">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebookF className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
                    </a>
                </div>

            </div>

            {/* Bottom Divider */}
            <div className="border-t border-[#dccbcb] mt-10"></div>

            <p className="text-center text-sm mt-8 text-[#e7dcd4]/80 tracking-wide">
                &copy; {new Date().getFullYear()} Sheyas. All Rights Reserved.
            </p>
        </footer>
    );
}