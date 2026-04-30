"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, ArrowRight, Lock, Eye, EyeOff, User } from "lucide-react";
import { postCreateUserAPi, postSignInAPi } from "@/api-endpoints/authendication";
import { getCartApi } from "@/api-endpoints/CartsApi";
import { useVendor } from "@/context/VendorContext";
import { useToast } from "@/context/ToastContext";
import { handleApiError } from "@/utils/error-utils";
import { safeErrorLog } from "@/utils/error-handler";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        first_name: "",
        email: "",
        contact_number: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { vendorId } = useVendor();
    const { showToast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "contact_number") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 10) {
                setFormData(prev => ({ ...prev, [name]: numericValue }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.first_name || !formData.email || !formData.contact_number || !formData.password) {
            showToast("Please fill in all fields", "error");
            return;
        }

        if (formData.contact_number.length !== 10) {
            showToast("Please enter a valid 10-digit mobile number", "error");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                vendor: vendorId,
                created_by: formData.first_name,
                username: formData.first_name,
            };

            const res = await postCreateUserAPi(payload);
            if (res.status === 201 || res.status === 200) {
                showToast("Account created successfully!", "success");

                // Auto-Login
                try {
                    const loginRes = await postSignInAPi({
                        email: formData.email,
                        password: formData.password,
                        vendor_id: vendorId
                    });

                    const userId = loginRes?.data?.user_id || loginRes?.data?.user?.id || loginRes?.data?.id;
                    if (userId) {
                        localStorage.setItem("userId", userId);

                        // Sync Cart
                        const cartRes = await getCartApi(`user/${userId}`);
                        if (cartRes?.data?.length > 0) {
                            localStorage.setItem("cartId", cartRes.data[0].id);
                        }
                    }

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 500);
                } catch (loginErr) {
                    // If auto-login fails, still send them to login page as a fallback
                    router.push("/login?registered=true");
                }
            }
        } catch (err: any) {
            safeErrorLog("Registration failed", err);
            showToast(handleApiError(err), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 text-gray-800 bg-[#f9f8f4]">
            <div className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl font-serif text-[#000000] mb-2 tracking-wide">Join Sheyas</h1>
                    <p className="text-sm sm:text-base text-[#000000] opacity-60">Create your account for a premium experience</p>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleRegister}>
                    {/* Full Name */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] mb-2.5 opacity-50 italic px-1">
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Full Name"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 sm:py-4 pr-6 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                value={formData.first_name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] mb-2.5 opacity-50 italic px-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 sm:py-4 pr-6 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] mb-2.5 opacity-50 italic px-1">
                            Mobile Number
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="absolute left-14 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                                <span className="text-sm sm:text-base font-bold text-[#000000]">+91</span>
                            </div>
                            <input
                                type="tel"
                                name="contact_number"
                                placeholder="Mobile Number"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 sm:py-4 pr-6 pl-23 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                value={formData.contact_number}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] mb-2.5 opacity-50 italic px-1">
                            Create Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 sm:py-4 pr-14 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#000000] transition-colors z-10"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#000000] text-white py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all shadow-xl flex items-center justify-center gap-3 group tracking-[0.1em] uppercase mt-8 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                        {!isLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-5 border-t border-gray-50 text-center">
                    <p className="text-sm sm:text-base italic ">
                        Already have an account? <Link href="/login" className="text-[#000000] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity ml-1">Login</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
