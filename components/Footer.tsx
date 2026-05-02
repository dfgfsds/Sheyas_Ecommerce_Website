"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#060303] text-[#e7dcd4] px-10 pt-16 pb-12">

            {/* Top Section - Grid Layout */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">

                {/* Left - Logo & Description */}
                <div className="flex flex-col items-start gap-6">
                    <div className="relative w-[180px] h-[60px]">
                        <Image
                            src="/logo.png"
                            alt="Sheyas Logo"
                            fill
                            className="object-contain brightness-0 invert"
                        />
                    </div>
                    <p className="text-sm text-[#e7dcd4]/70 text-left leading-relaxed">
                        Elevating modest fashion with premium Abayas and exclusive Eid collections.
                    </p>
                </div>

                {/* Center 1 - Quick Links */}
                <div className="flex flex-col items-start lg:items-center gap-5">
                    <div className="flex flex-col items-start gap-5">
                        <h3 className="text-lg font-semibold text-left tracking-widest uppercase mb-1">Policies</h3>
                        <div className="flex flex-col items-start gap-3 text-sm tracking-wide">
                            <Link href="/privacy-policy" className="text-[#e7dcd4]/80 hover:text-white transition-colors hover:opacity-100 transition-opacity">Privacy Policy</Link>
                            <Link href="/return-policy" className="text-[#e7dcd4]/80 hover:text-white transition-colors hover:opacity-100 transition-opacity">Return Policy</Link>
                            <Link href="/shipping-policy" className="text-[#e7dcd4]/80 hover:text-white transition-colors hover:opacity-100 transition-opacity">Shipping Policy</Link>
                            <Link href="/terms-of-service" className="text-[#e7dcd4]/80 hover:text-white transition-colors hover:opacity-100 transition-opacity">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* Center 2 - Contact Info */}
                <div className="flex flex-col items-start gap-5">
                    <h3 className="text-lg font-semibold text-left tracking-widest uppercase mb-1">Contact Us</h3>
                    <div className="flex flex-col items-start gap-4 text-sm text-[#e7dcd4]/80">
                        <a href="mailto:sheyas.co@gmail.com" className="hover:text-white transition-colors flex items-center gap-3">
                            <FaEnvelope className="text-base shrink-0" />
                            <span>sheyas.co@gmail.com</span>
                        </a>
                        <a href="tel:9385956032" className="hover:text-white transition-colors flex items-center gap-3">
                            <FaPhoneAlt className="text-base shrink-0" />
                            <span>+91 9385956032</span>
                        </a>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Fine+Center+30%2F2A+East+St+Anna+Nagar+Madurai+Tamil+Nadu+625020"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 text-left hover:text-white transition-colors"
                        >
                            <FaMapMarkerAlt className="text-lg shrink-0 mt-1" />
                            <span className="leading-relaxed">
                                Fine Center, 30/2A, East St,<br />
                                Anna Nagar, Madurai,<br />
                                Tamil Nadu 625020
                            </span>
                        </a>
                    </div>
                </div>

                {/* Right - Socials */}
                <div className="flex flex-col items-start gap-5">
                    <h3 className="text-lg font-semibold text-left tracking-widest uppercase mb-1">Follow Us</h3>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-[#1a1515] hover:bg-white hover:text-black p-3 rounded-full transition-all duration-300">
                            <FaFacebookF className="w-4 h-4" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-[#1a1515] hover:bg-white hover:text-black p-3 rounded-full transition-all duration-300">
                            <FaInstagram className="w-4 h-4" />
                        </a>
                    </div>
                </div>

            </div>

            {/* Bottom Divider */}
            <div className="border-t border-[#dccbcb] mt-10"></div>

            <div className="text-center text-sm mt-8 text-[#e7dcd4]/80 tracking-wide flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2">
                <span>&copy; {new Date().getFullYear()} Sheyas. All Rights Reserved.</span>
                <span className="hidden sm:inline">|</span>
                <span>
                    Developed by <a href="https://ftdigitalsolutions.in" target="_blank" rel="noopener noreferrer" className="hover:text-white font-medium hover:underline transition-colors">FT Digital Solutions</a>
                </span>
            </div>
        </footer>
    );
}