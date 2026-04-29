"use client";

import { Search, User, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useCartItem } from "@/context/CartItemContext";

export default function Header() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated } = useUser();
    const { cartItems } = useCartItem();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const userData = user?.data || user;

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Eid Collection", path: "/eid-collection" },
        { name: "Abaya", path: "/abaya" },
        { name: "Contact", path: "/contact" },
        { name: "About", path: "/about" },
        { name: "Order Status", path: "/orders" },
    ];

    return (
        <header className="w-full  relative">
            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[110] bg-[#000000]/40 backdrop-blur-sm lg:hidden" onClick={() => setIsMenuOpen(false)}>
                    <div
                        className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[300px] bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-left duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-2xl font-bold italic text-[#000000]">Menu</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="text-[#000000]">
                                <X className="w-7 h-7 stroke-[1.5px]" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-xl font-semibold italic transition-colors ${pathname === item.path ? "text-[#000000] border-l-2 border-[#000000] pl-4" : "text-[#000000]"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-6">
                            {mounted && isAuthenticated ? (
                                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex flex-col gap-1 text-[#000000] font-bold italic">
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5" /> {userData?.name}
                                    </div>
                                    <span className="text-[10px] opacity-60 ml-8">{userData?.contact_number || userData?.mobile}</span>
                                </Link>
                            ) : (
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-[#000000] font-bold italic">
                                    <User className="w-5 h-5" /> Account
                                </Link>
                            )}
                            <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-[#000000] font-bold italic relative">
                                <div className="relative">
                                    <ShoppingBag className="w-5 h-5" />
                                    {mounted && cartItems?.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center font-bold">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </div>
                                Cart
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="text-white text-center text-[10px] sm:text-[16px] py-2.5 tracking-[0.25em] font-bold italic 
            bg-[#000000]
            shadow-inner border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0  pointer-events-none"></div>
                <span className="relative z-10">Unlock Exclusive Offers at Checkout</span>
            </div>

            {/* Navbar */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-3 sm:py-5 flex items-center justify-between">

                    {/* Left Menu (Desktop) */}
                    <nav className="hidden lg:flex flex-1 items-center gap-6 text-[#000000] text-lg font-bold italic justify-start">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`transition-opacity pb-0.5 whitespace-nowrap ${pathname === item.path ? "border-b border-[#000000]" : ""
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Icon */}
                    <div className="lg:hidden flex-1 flex justify-start">
                        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col gap-1.5 p-2 -ml-2">
                            <div className="w-6 h-0.5 bg-[#000000]"></div>
                            <div className="w-4 h-0.5 bg-[#000000]"></div>
                            <div className="w-6 h-0.5 bg-[#000000]"></div>
                        </button>
                    </div>

                    {/* Center Logo */}
                    <div className="flex-shrink-0 flex justify-center">
                        <Link href="/" className="block relative w-24 h-16 sm:w-[120px] sm:h-[40px]  ">
                            <Image
                                src="/logo.png"
                                alt="Sukina Abaya Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Right Icons */}
                    <div className="flex-1 flex items-center gap-4 sm:gap-8 text-[#000000] justify-end">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            aria-label="Search"
                            className="hover:opacity-70 transition-opacity"
                        >
                            <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                        </button>
                        {mounted && isAuthenticated ? (
                            <Link href="/profile" aria-label="Account" className="hidden sm:flex flex-col items-end hover:opacity-70 transition-opacity">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-black/40 leading-none mb-1">Welcome</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold italic">{userData?.name}</span>
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold not-italic">
                                        {userData?.name?.charAt(0)}
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <Link href="/login" aria-label="Account" className="hidden sm:block hover:opacity-70 transition-opacity">
                                <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                            </Link>
                        )}
                        <Link href="/cart" aria-label="Cart" className="hover:opacity-70 transition-opacity relative">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                            {mounted && cartItems?.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-1">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Bar - Appears below navbar */}
            {isSearchOpen && (
                <div className="bg-white border-b border-gray-100 py-4 px-4 animate-in slide-in-from-top duration-300">
                    <div className="container mx-auto flex items-center gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search our collection..."
                                autoFocus
                                className="w-full border text-[#000000] border-black rounded-full py-2.5 px-6 text-sm focus:outline-none"
                            />
                            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
                        </div>
                        <button onClick={() => setIsSearchOpen(false)} className="p-2">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </header >
    );
}