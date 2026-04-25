"use client";

import { ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function EidCollectionPage() {
    return (
        <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-10 font-[family-name:var(--font-cormorant)]">

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4 text-[#031c06]">
                <div className="flex items-center gap-8">
                    <span className="text-lg font-medium italic">Filter:</span>
                    <button className="flex items-center gap-1 hover:opacity-70 transition-opacity italic">
                        Availability <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-1 hover:opacity-70 transition-opacity italic">
                        Price <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="italic">Sort by:</span>
                        <button className="flex items-center gap-1 hover:opacity-70 transition-opacity italic">
                            Best selling <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    <span className="italic text-[#031c06]/60">{products.length} products</span>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 my-10">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}
