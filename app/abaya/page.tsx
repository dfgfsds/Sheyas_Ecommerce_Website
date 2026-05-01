"use client";

import Image from "next/image";
import { ChevronDown, Filter as FilterIcon, SlidersHorizontal } from "lucide-react";
import ProductCard, { Product } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductsContext";
import { motion } from "framer-motion";

import { useState } from "react";

export default function AbayaPage() {
    const { products: apiProducts, isLoading } = useProducts();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

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

    const totalPages = Math.ceil(displayProducts.length / productsPerPage);
    const paginatedProducts = displayProducts.slice(
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
            <div className="relative w-full h-[300px] sm:h-[450px] overflow-hidden">
                <Image
                    src="/abaya-banner.png"
                    alt="Abaya Collection"
                    fill
                    className="object-cover object-top"
                    onError={(e: any) => e.target.src = "/placeholder-image.jpg"}
                    priority
                />
                <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl sm:text-6xl font-serif italic text-white drop-shadow-2xl mb-4 tracking-wide">Our Abaya Collection</h1>
                    <div className="w-24 h-[1px] bg-white/60"></div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16">

                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-8 border-b border-gray-100">
                    <div className="space-y-1">
                        <h2 className="text-2xl md:text-3xl font-bold italic">All Products</h2>
                        <p className="text-[15px] md:text-[16px]">{displayProducts.length} products available</p>
                    </div>

                    <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-[0.1em] whitespace-nowrap">
                            <button className="flex items-center gap-2 transition-opacity ">
                                Availability <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="flex items-center gap-2  transition-opacity ">
                                Price <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="w-[1px] h-4 bg-gray-800"></div>
                            <div className="flex items-center gap-2">
                                <span className="opacity-40 text- italic">Sort:</span>
                                <button className="flex items-center gap-1 transition-opacity ">
                                    Featured <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <motion.div 
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
            </div>
        </main>
    );
}
