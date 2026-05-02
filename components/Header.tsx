"use client";

import { Search, User, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/utils/price-utils";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { showToast } = useToast();
    const { user, isAuthenticated } = useUser();
    const { products: apiData } = useProducts();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close search on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };
        if (isSearchOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsSearchOpen(false);
                setSearchQuery("");
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const isLoggedIn = mounted ? isAuthenticated : false;

    const products = apiData || [];
    const filteredProducts = searchQuery.trim().length > 1
        ? products.filter((p: any) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 4)
        : [];

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Eid Collection", path: "/eid-collection" },
        { name: "Abaya", path: "/abaya" },
        { name: "Contact Us", path: "/contact" },
        { name: "About Us", path: "/about" },
        { name: "Order Status", path: "/orders", protected: true },
    ];

    const handleNavClick = (item: any, e: React.MouseEvent) => {
        if (item.protected) {
            const token = localStorage.getItem('userId');
            if (!token) {
                e.preventDefault();
                showToast("Please login to view your orders", "warning");
                router.push(`/login?redirect=${item.path}`);
                setIsMenuOpen(false);
                return;
            }
        }
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="text-white text-center text-[10px] sm:text-[16px] py-2.5 tracking-[0.25em] font-bold italic 
            bg-[#000000]
            shadow-inner border-b border-white/5 relative overflow-hidden z-[110]">
                <div className="absolute inset-0 pointer-events-none"></div>
                <span className="relative z-10">Unlock Exclusive Offers at Checkout</span>
            </div>

            {/* Main Header - Sticky */}
            <header className="w-full sticky top-0 z-[100] bg-white shadow-xs">
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
                                        onClick={(e) => handleNavClick(item, e)}
                                        className={`text-xl font-bold italic transition-colors ${pathname === item.path ? "text-[#000000]" : "text-gray-400 hover:text-black"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-6">
                                <Link href={isLoggedIn ? "/profile" : "/login"} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-[#000000] font-bold italic">
                                    <User className="w-5 h-5" /> Account
                                </Link>
                                <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-[#000000] font-bold italic">
                                    <ShoppingBag className="w-5 h-5" /> Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navbar Content */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-3 sm:py-5.5 flex items-center justify-between">

                        {/* Mobile Menu Icon */}
                        <div className="lg:hidden flex-1 flex justify-start order-1">
                            <button onClick={() => setIsMenuOpen(true)} className="flex flex-col gap-1.5 p-2 -ml-2">
                                <div className="w-6 h-0.5 bg-[#000000]"></div>
                                <div className="w-4 h-0.5 bg-[#000000]"></div>
                                <div className="w-6 h-0.5 bg-[#000000]"></div>
                            </button>
                        </div>

                        {/* Logo (Left on lg, Center on mobile) */}
                        <div className="flex-1 flex lg:justify-start justify-center order-2 lg:order-1">
                            <Link href="/" className="block relative w-24 h-12 sm:w-[120px] sm:h-[36px]">
                                <Image
                                    src="/logo.png"
                                    alt="Sukina Abaya Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Desktop Nav Links */}
                        <nav className="hidden lg:flex flex-[2] items-center gap-8 text-[#000000] text-lg font-bold italic justify-center order-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={(e) => handleNavClick(item, e)}
                                    className={`transition-opacity pb-0.5 whitespace-nowrap ${pathname === item.path ? "border-b border-[#000000]" : ""
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Icons */}
                        <div className="flex-1 flex items-center gap-4 sm:gap-8 text-[#000000] justify-end order-3">
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                aria-label="Search"
                                className="hover:opacity-70 transition-opacity"
                            >
                                <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                            </button>
                            <Link href={isLoggedIn ? "/profile" : "/login"} aria-label="Account" className="block hover:opacity-70 transition-opacity">
                                <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                            </Link>
                            <Link href="/cart" aria-label="Cart" className="hover:opacity-70 transition-opacity">
                                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                {isSearchOpen && (
                    <div ref={searchRef} className="absolute top-full left-0 w-full bg-white border-b border-gray-100 py-4 px-4 border-b border-gray-200 z-[120] animate-in slide-in-from-top duration-300">
                        <div className="container mx-auto max-w-2xl relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search our collection..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-full border-b-2 border-black py-4 px-2 text-xl font-serif italic focus:outline-none placeholder:opacity-30"
                                />
                                <button
                                    onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery("");
                                    }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-50 transition-opacity"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Search Results Dropdown */}
                            {searchQuery.trim().length > 1 && (
                                <div className="mt-4 bg-white rounded-2xl overflow-hidden border border-gray-200">
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Search results for "{searchQuery}"</p>
                                    </div>
                                    {filteredProducts.length > 0 ? (
                                        <div className="divide-y divide-gray-50">
                                            {filteredProducts.map((product: any) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.id}`}
                                                    onClick={() => {
                                                        setIsSearchOpen(false);
                                                        setSearchQuery("");
                                                    }}
                                                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                                                >
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                                        <Image
                                                            src={product.image_urls?.[0] || "/placeholder-image.jpg"}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover object-top"
                                                            onError={(e: any) => e.target.src = "/placeholder-image.jpg"}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <h4 className="text-sm font-bold truncate group-hover:text-gray-600 transition-colors">{product.name}</h4>
                                                        <p className="text-xs text-gray-400 italic capitalize">{product.category_name}</p>
                                                    </div>
                                                    <div className="text-sm font-bold">
                                                        {formatPrice(product.price)}
                                                    </div>
                                                </Link>
                                            ))}
                                            <Link
                                                href="/eid-collection"
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    setSearchQuery("");
                                                }}
                                                className="block p-4 text-center text-xs font-bold uppercase tracking-widest bg-white hover:bg-black hover:text-white transition-all border-t border-gray-50"
                                            >
                                                View all results
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center space-y-2">
                                            <p className="text-gray-400 italic">No products found for "{searchQuery}"</p>
                                            {/* <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 text-black">Try searching for "Abaya" or "Hijab"</p> */}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
