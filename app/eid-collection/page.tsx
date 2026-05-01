"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard, { Product } from "@/components/ProductCard";
import { useProducts } from "@/context/ProductsContext";

export default function EidCollectionPage() {
    const { products: apiProducts, isLoading } = useProducts();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

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
        <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-10 ">

            {/* Filters Bar */}
            {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4 text-[#000000]">
                <div className="flex items-center gap-8">
                    <span className="text-lg font-medium ">Filter:</span>
                    <button className="flex items-center gap-1 hover:opacity-70 transition-opacity ">
                        Availability <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-1 hover:opacity-70 transition-opacity ">
                        Price <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="italic">Sort by:</span>
                        <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                            Best selling <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    <span className="italic text-[#000000]/60">{displayProducts.length} products</span>
                </div>
            </div> */}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 my-10">
                {paginatedProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

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
        </main>
    );
}
