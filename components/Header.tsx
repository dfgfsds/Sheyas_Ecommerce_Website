"use client";

import { Search, User, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Eid Collection", path: "/eid-collection" },
        { name: "Abaya", path: "/abaya" },
        { name: "Contact Us", path: "/contact" },
        { name: "About Us", path: "/about" },
        { name: "Order Status", path: "/orders" },
    ];

    return (
        <header className="w-full font-[family-name:var(--font-cormorant)] relative">
            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[110] bg-[#031c06]/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMenuOpen(false)}>
                    <div 
                        className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[300px] bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-bold italic text-[#031c06]">Menu</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="text-[#031c06]">
                                <X className="w-7 h-7 stroke-[1.5px]" />
                            </button>
                        </div>
                        
                        <nav className="flex flex-col gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-xl font-semibold italic transition-colors ${
                                        pathname === item.path ? "text-[#0a5328] border-l-2 border-[#0a5328] pl-4" : "text-[#031c06]/70"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-6">
                            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-[#031c06] font-bold italic">
                                <User className="w-5 h-5" /> Account
                            </Link>
                            <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-[#031c06] font-bold italic">
                                <ShoppingBag className="w-5 h-5" /> Cart
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="absolute inset-0 z-[120] bg-white flex items-center justify-center px-4 animate-in fade-in slide-in-from-top duration-300">
                    <div className="w-full max-w-4xl flex items-center gap-4">
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                placeholder="Search" 
                                autoFocus
                                className="w-full border border-[#6b4a3a] rounded-md py-2.5 px-6 italic text-[#6b4a3a] focus:outline-none placeholder:text-[#6b4a3a]/40"
                            />
                            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b4a3a]/60 stroke-[1.5px]" />
                        </div>
                        <button 
                            onClick={() => setIsSearchOpen(false)}
                            className="text-[#6b4a3a] hover:opacity-70 transition-opacity"
                        >
                            <X className="w-7 h-7 stroke-[1.5px]" />
                        </button>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="text-white text-center text-[10px] sm:text-sm py-2.5 tracking-[0.25em] font-semibold italic 
            bg-gradient-to-r from-[#0a5328] via-[#0a5328] to-[#0a5328] 
            shadow-inner border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none"></div>
                <span className="relative z-10">Unlock Exclusive Offers at Checkout</span>
            </div>


            {/* Navbar */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">

                    {/* Left Menu (Desktop) */}
                    <nav className="hidden lg:flex flex-1 items-center gap-6 text-[#031c06] text-lg font-semibold italic justify-start">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`transition-opacity pb-0.5 whitespace-nowrap ${pathname === item.path ? "border-b border-[#0a5328]" : ""
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Icon */}
                    <div className="lg:hidden flex-1 flex justify-start">
                        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col gap-1.5 p-2 -ml-2">
                            <div className="w-6 h-0.5 bg-[#031c06]"></div>
                            <div className="w-4 h-0.5 bg-[#031c06]"></div>
                            <div className="w-6 h-0.5 bg-[#031c06]"></div>
                        </button>
                    </div>

                    {/* Center Logo */}
                    <div className="flex-shrink-0 flex justify-center">
                        <Link href="/" className="block relative w-16 h-16 sm:w-24 sm:h-24">
                            <Image
                                src="/logo.jpg"
                                alt="Sukina Abaya Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Icons */}
                    <div className="flex-1 flex items-center gap-4 sm:gap-8 text-[#031c06] justify-end">
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Search" 
                            className="hover:opacity-70 transition-opacity"
                        >
                            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                        </button>
                        <Link href="/login" aria-label="Account" className="hidden sm:block hover:opacity-70 transition-opacity">
                            <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                        </Link>
                        <Link href="/cart" aria-label="Cart" className="hover:opacity-70 transition-opacity">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                        </Link>
                    </div>
                </div>
            </div>
        </header >
    );
}