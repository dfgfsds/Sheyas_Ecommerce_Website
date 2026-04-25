"use client";

import Image from "next/image";
import { ChevronDown, Filter as FilterIcon, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function AbayaPage() {
    return (
        <main className="min-h-screen font-[family-name:var(--font-cormorant)] text-[#031c06]">

            {/* Hero Banner Section */}
            <div className="relative w-full h-[300px] sm:h-[450px] overflow-hidden">
                <Image
                    src="/abaya-banner.png"
                    alt="Abaya Collection Banner"
                    fill
                    className="object-contain"
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
                        <h2 className="text-2xl font-bold italic">All Products</h2>
                        <p className="text-sm opacity-50 italic">{products.length} products available</p>
                    </div>

                    <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-[0.1em] whitespace-nowrap">
                            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity italic">
                                Availability <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity italic">
                                Price <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="w-[1px] h-4 bg-gray-200"></div>
                            <div className="flex items-center gap-2">
                                <span className="opacity-40 italic">Sort:</span>
                                <button className="flex items-center gap-1 hover:opacity-70 transition-opacity italic">
                                    Featured <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Bottom Pagination / More */}
                <div className="mt-24 text-center">
                    <button className="border-b-2 border-[#031c06] pb-1 text-lg font-bold italic hover:opacity-60 transition-opacity">
                        View more products
                    </button>
                </div>
            </div>
        </main>
    );
}
