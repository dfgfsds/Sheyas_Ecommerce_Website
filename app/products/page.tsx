"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Filter as FilterIcon, SlidersHorizontal, ShoppingBag } from "lucide-react";
import ProductCard, { Product } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductsContext";
import { motion } from "framer-motion";

import { useState, useRef, useEffect } from "react";

export default function ProductsPage() {
    const { products: apiProducts, isLoading } = useProducts();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("DEFAULT SORTING");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const productsPerPage = 12;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const SORT_OPTIONS = [
        "DEFAULT SORTING",
        "PRICE: LOW TO HIGH",
        "PRICE: HIGH TO LOW",
        "NAME: A TO Z",
        "NEWEST FIRST"
    ];

    const displayProducts = apiProducts?.length > 0 ? apiProducts.map((p: any) => {
        let imageUrl = (p.image_urls && p.image_urls[0]) || p.product_image || "/placeholder-image.jpg";
        if (imageUrl.includes("http://ip/")) {
            imageUrl = imageUrl.replace("http://ip/", "http://82.29.161.36/");
        }

        return {
            id: p.id,
            name: p.name || p.product_name || "Unnamed Product",
            oldPrice: `₹${p.discount || p.price}`,
            newPrice: `₹${p.price}`,
            rating: p.ratings || 0,
            reviews: 0,
            image: imageUrl,
            onSale: p.discount ? parseFloat(p.discount) > parseFloat(p.price) : false,
            categoryName: p.category_name || "",
        };
    }) : [] as Product[];

    const sortProducts = (products: Product[]) => {
        let sorted = [...products];
        switch (sortOption) {
            case "PRICE: LOW TO HIGH":
                sorted.sort((a, b) => parseFloat(a.newPrice.replace(/[^0-9.-]+/g, "")) - parseFloat(b.newPrice.replace(/[^0-9.-]+/g, "")));
                break;
            case "PRICE: HIGH TO LOW":
                sorted.sort((a, b) => parseFloat(b.newPrice.replace(/[^0-9.-]+/g, "")) - parseFloat(a.newPrice.replace(/[^0-9.-]+/g, "")));
                break;
            case "NAME: A TO Z":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "NEWEST FIRST":
                // Assuming larger ID means newer. Adjust if API has a specific date field.
                sorted.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }
        return sorted;
    };

    const sortedProducts = sortProducts(displayProducts);

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#000000]"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen text-[#000000]">

            {/* Hero Banner Section */}
            <div className="relative w-full h-[300px] sm:h-[360px] overflow-hidden">
                <Image
                    src="/image.jpeg"
                    alt="Products Collection"
                    fill
                    className="object-cover object-top"
                    onError={(e: any) => e.target.src = "/placeholder-image.jpg"}
                    priority
                />
                <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl sm:text-6xl font-serif italic text-white drop-shadow-2xl mb-4 tracking-wide">Our Collections</h1>
                    <div className="w-24 h-[1px] bg-white/60"></div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16">

                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-8 mb-10 md:mb-16 pb-6 md:pb-8 border-b border-gray-100">
                    <div className="space-y-1">
                        <h2 className="text-2xl md:text-3xl font-bold italic">All Products</h2>
                        <p className="text-[15px] md:text-[16px]">{displayProducts.length} products available</p>
                    </div>

                    <div className="flex items-center justify-start md:justify-end pb-2 md:pb-0 w-full md:w-auto">
                        <div className="flex items-center w-full md:w-auto text-sm font-bold uppercase tracking-[0.1em]">
                            <div className="relative z-50 w-full md:w-auto" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center justify-between w-full md:w-[200px] bg-white text-black px-4 py-3 md:py-2.5 border-2 border-black text-[11px] sm:text-[12px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
                                >
                                    {sortOption} <ChevronDown className="w-4 h-4 ml-2" />
                                </button>
                                {isSortOpen && (
                                    <div className="absolute top-full left-0 md:left-auto md:right-0 w-full md:w-[200px] bg-white border-2 border-t-0 border-black shadow-2xl">
                                        {SORT_OPTIONS.map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    setSortOption(opt);
                                                    setIsSortOpen(false);
                                                    setCurrentPage(1); // Reset page on sort
                                                }}
                                                className={`w-full text-left px-4 py-3 md:py-2.5 text-[11px] sm:text-[12px] tracking-widest uppercase font-bold transition-colors ${sortOption === opt ? 'bg-black text-white' : 'text-gray-500 hover:bg-black hover:text-white'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {displayProducts.length > 0 ? (
                    <>
                        {/* Product Grid */}
                        <motion.div
                            key={`${currentPage}-${sortOption}`}
                            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ margin: "-50px" }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {paginatedProducts.map((product: Product) => (
                                <motion.div
                                    key={product.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Bottom Pagination */}
                        <div className="mt-24 flex items-center justify-center gap-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`text-lg font-bold italic border-b-2 border-[#000000] pb-1 transition-opacity ${currentPage === 1 ? "opacity-20 cursor-not-allowed" : "hover:opacity-60"}`}
                            >
                                Previous
                            </button>

                            <span className="text-sm font-bold italic opacity-40 uppercase tracking-widest">
                                {currentPage} - {totalPages || 1}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`text-lg font-bold italic border-b-2 border-[#000000] pb-1 transition-opacity ${currentPage === totalPages || totalPages === 0 ? "opacity-20 cursor-not-allowed" : "hover:opacity-60"}`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-14 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 shadow-sm max-w-4xl mx-auto my-10">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <ShoppingBag className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-serif italic mb-2">Collection currently empty</h3>
                        <p className="text-gray-500 font-medium mb-6 max-w-sm mx-auto italic leading-relaxed">
                            We&apos;re currently updating our Collection. Please check back later or explore our other exquisite pieces.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-12 py-4 bg-black text-white rounded-full text-sm font-bold hover:opacity-90 transition-all uppercase tracking-widest shadow-xl"
                        >
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
