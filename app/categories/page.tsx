"use client";

import React, { useState } from "react";
import { ChevronDown, FolderOpen } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import { useCategories } from "@/context/CategoriesContext";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CategoriesPage() {
    const { categories: apiCategories, isLoading } = useCategories();
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 8;

    const categoriesArray = apiCategories?.data || apiCategories || [];

    const displayCategories = categoriesArray?.length > 0 ? categoriesArray.map((c: any) => {
        let imageUrl = c.image || "/placeholder-image.jpg";
        if (imageUrl.includes("http://ip/")) {
            imageUrl = imageUrl.replace("http://ip/", "http://82.29.161.36/");
        }

        return {
            id: c.id,
            name: c.name || "Unnamed Category",
            slug: c.slug || c.name?.toLowerCase().replace(/\s+/g, '-'),
            image: imageUrl,
        };
    }) : [];

    const totalPages = Math.ceil(displayCategories.length / categoriesPerPage);
    // const paginatedCategories = displayCategories.slice(
    //     (currentPage - 1) * categoriesPerPage,
    //     currentPage * categoriesPerPage
    // );

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
            </div> */}            {displayCategories.length > 0 ? (
                <>
                    <motion.div
                        key={currentPage}
                        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 my-10"
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
                        {/* {paginatedCategories.map((category: any) => ( */}
                        {displayCategories.map((category: any) => (
                            <motion.div
                                key={category.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0 }
                                 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CategoryCard category={category} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Bottom Pagination - Commented out to show all categories */}
                    {/* {totalPages > 1 && (
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
                    )} */}
                </>
            ) : (
                <div className="text-center py-14 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 shadow-sm max-w-4xl mx-auto my-10">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <FolderOpen className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-serif italic mb-2">No Categories Found</h3>
                    <p className="text-gray-500 font-medium mb-6 max-w-sm mx-auto italic leading-relaxed">
                        We&apos;re currently updating our categories. Please check back later.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-12 py-4 bg-black text-white rounded-full text-sm font-bold hover:opacity-90 transition-all uppercase tracking-widest shadow-xl"
                    >
                        Back to Home
                    </Link>
                </div>
            )}
        </main>
    );
}
