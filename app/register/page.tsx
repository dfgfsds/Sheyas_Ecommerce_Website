"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    return (
        <main className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 font-[family-name:var(--font-cormorant)] text-gray-800 bg-[#f9f8f4]">
            <div className="w-full max-w-[460px] bg-white p-8 sm:p-12 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-serif italic mb-3 tracking-wide text-[#031c06]">Join Sakina Abaya</h1>
                    <p className="text-sm sm:text-base italic opacity-60">Create your account for a premium experience</p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2.5 opacity-50 italic px-1">
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#031c06] transition-colors z-10">
                                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pl-14 pr-6 transition-all duration-300 focus:bg-white focus:border-[#031c06]/20 focus:ring-4 focus:ring-[#031c06]/5 outline-none font-bold text-sm sm:text-base"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2.5 opacity-50 italic px-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#031c06] transition-colors z-10">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pl-14 pr-6 transition-all duration-300 focus:bg-white focus:border-[#031c06]/20 focus:ring-4 focus:ring-[#031c06]/5 outline-none font-bold text-sm sm:text-base"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2.5 opacity-50 italic px-1">
                            Mobile Number
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#031c06] transition-colors z-10">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="absolute left-14 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                                <span className="text-sm sm:text-base font-bold text-[#031c06]">+91</span>
                                <div className="w-[1px] h-4 bg-gray-200"></div>
                            </div>
                            <input
                                type="tel"
                                placeholder="98765 43210"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pl-28 pr-6 transition-all duration-300 focus:bg-white focus:border-[#031c06]/20 focus:ring-4 focus:ring-[#031c06]/5 outline-none font-bold text-sm sm:text-base"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2.5 opacity-50 italic px-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#031c06] transition-colors z-10">
                                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pl-14 pr-6 transition-all duration-300 focus:bg-white focus:border-[#031c06]/20 focus:ring-4 focus:ring-[#031c06]/5 outline-none font-bold text-sm sm:text-base"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button className="w-full bg-[#031c06] text-white py-4 sm:py-4.5 rounded-full text-base font-bold italic hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3 group tracking-[0.1em] uppercase mt-4">
                        Join Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                    </button>


                </form>

                {/* Footer */}
                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-sm italic opacity-60 text-gray-800">
                        Already have an account? <Link href="/login" className="text-[#031c06] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity ml-1">Login here</Link>
                    </p>
                </div>

            </div>
        </main>
    );
}
