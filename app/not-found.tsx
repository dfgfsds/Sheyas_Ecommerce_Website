"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-[80vh] flex items-center justify-center px-6 py-24 text-center">
            <div className="max-w-md w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                
                {/* 404 Visual */}
                <div className="relative">
                    <h1 className="text-[12rem] sm:text-[16rem] font-serif italic text-gray-50 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-4xl sm:text-5xl font-serif italic text-[#000000] tracking-tight">
                            Page Not Found
                        </h2>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-base sm:text-lg text-gray-600 italic leading-relaxed max-w-sm mx-auto">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="pt-8">
                        <Link 
                            href="/"
                            className="inline-flex items-center gap-3 bg-[#000000] text-white px-10 py-4 rounded-full text-base font-bold transition-all hover:opacity-90 shadow-xl group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform" />
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Optional: Navigation Suggestion */}
                <div className="pt-12 grid grid-cols-2 gap-4">
                    <Link href="/eid-collection" className="text-xs font-bold uppercase tracking-widest text-[#000000]/60 hover:text-[#000000] transition-colors border border-gray-100 rounded-2xl py-4 italic">
                        New Collection
                    </Link>
                    <Link href="/abaya" className="text-xs font-bold uppercase tracking-widest text-[#000000]/60 hover:text-[#000000] transition-colors border border-gray-100 rounded-2xl py-4 italic">
                        Best Sellers
                    </Link>
                </div>
            </div>
        </main>
    );
}
