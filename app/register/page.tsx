"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { postCreateUserAPi } from "@/api-endpoints/authendication";
import { useUser } from "@/context/UserContext";
import { useVendor } from "@/context/VendorContext";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useUser();
    const { vendorId } = useVendor();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
            setError("Registration failed: Phone number must be exactly 10 digits.");
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                name,
                email,
                mobile: phone,
                contact_number: phone,
                password,
                role: "user",
                created_by: vendorId || 159,
                vendor: vendorId || 159,
                vendor_id: vendorId || 159
            };

            const response = await postCreateUserAPi(payload);
            const userId = response.data?.user_id || response.data?.id;

            if (userId) {
                login(response.data);
                router.push("/");
            } else {
                // If the backend requires a manual login after registration
                router.push("/login?registered=true");
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err?.response?.data?.error || err?.response?.data?.message || err?.response?.data?.detail || "System Error: Registration compromised.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20  text-gray-800 bg-[#f9f8f4]">
            <div className="w-full max-w-[460px] bg-white p-8 sm:p-12 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-serif italic mb-3 tracking-wide text-[#000000]">Join Sheyas</h1>
                    <p className="text-sm sm:text-base  opacity-60">Create your account for a premium experience</p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleRegister}>
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {/* Full Name */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold capitalize tracking-[0.2em] mb-2.5 opacity-50  px-1">
                            Full Name
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pl-14 pr-6 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold capitalize tracking-[0.2em] mb-2.5 opacity-50  px-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pl-14 pr-6 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold capitalize tracking-[0.2em] mb-2.5 opacity-50  px-1">
                            Mobile Number
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="absolute left-14 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                                <span className="text-sm sm:text-base font-bold text-[#000000]">+91</span>
                                <div className="w-[1px] h-4 bg-gray-200"></div>
                            </div>
                            <input
                                type="tel"
                                placeholder="98765 43210"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pl-24 pr-6 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] sm:text-xs font-bold capitalize tracking-[0.2em] mb-2.5 opacity-50  px-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pl-14 pr-6 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#000000] text-white py-3 sm:py-3.5 rounded-full text-base font-bold hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3 group tracking-[0.1em] uppercase mt-4 disabled:opacity-50"
                    >
                        {isLoading ? "Joining..." : "Join Now"}
                        {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />}
                    </button>


                </form>

                {/* Footer */}
                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-sm italic opacity-60 text-gray-800">
                        Already have an account? <Link href="/login" className="text-[#000000] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity ml-1">Login here</Link>
                    </p>
                </div>

            </div>
        </main>
    );
}
