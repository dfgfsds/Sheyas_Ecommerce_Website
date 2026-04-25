"use client";

import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#031c06] text-[#e7dcd4] px-10 py-10">

            {/* Top Links */}
            <div className="flex justify-center gap-10 text-base mb-12 tracking-wide">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Return Policy</a>
                <a href="#" className="hover:underline">Shipping Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
            </div>

            {/* Middle Section */}
            <div className="flex justify-between items-center">

                {/* Left - Newsletter */}
                <div>
                    <p className="mb-4 text-sm">Sign up for updates</p>

                    <div className="border border-[#e7dcd4] rounded-md px-4 py-3 flex items-center w-[320px]">
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-transparent outline-none text-sm w-full placeholder-[#e7dcd4]"
                        />
                        <span className="ml-2 text-lg cursor-pointer">→</span>
                    </div>
                </div>

                {/* Right - Social Icons */}
                <div className="flex gap-6">
                    <FaFacebookF className="w-5 h-5 cursor-pointer" />
                    <FaInstagram className="w-5 h-5 cursor-pointer" />
                </div>

            </div>

            {/* Bottom Divider */}
            <div className="border-t border-[#dccbcb] mt-10"></div>

            <p className="text-center text-xs mt-8 text-[#e7dcd4]/80 tracking-wide">
                &copy; {new Date().getFullYear()} Sukina Abaya. All Rights Reserved.
            </p>
        </footer>
    );
}