"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, ArrowRight, Lock } from "lucide-react";
import { postSignInAPi, postSendSmsOtpUserApi, postVerifySmsOtpApi } from "@/api-endpoints/authendication";
import { getCartApi } from "@/api-endpoints/CartsApi";
import { useUser } from "@/context/UserContext";
import { useVendor } from "@/context/VendorContext";

export default function LoginPage() {
    const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
    const [inputValue, setInputValue] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [token, setToken] = useState<string | null>(null);
    
    const router = useRouter();
    const { setUser } = useUser();
    const { vendorId } = useVendor();

    const handleMethodToggle = (method: "phone" | "email") => {
        setLoginMethod(method);
        setIsOtpSent(false);
        setOtp("");
        setPassword("");
        setInputValue("");
        setToken(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loginMethod === "phone") {
            if (!isOtpSent) {
                // Send OTP
                if (!inputValue) {
                    alert("Please enter your mobile number");
                    return;
                }
                setIsLoading(true);
                try {
                    const res = await postSendSmsOtpUserApi({ contact_number: inputValue, vendor_id: vendorId });
                    if (res?.data?.token) {
                        setIsOtpSent(true);
                        setToken(res.data.token);
                        alert("OTP sent successfully!");
                    } else {
                        alert("Failed to send OTP.");
                    }
                } catch (error: any) {
                    console.error("Send OTP failed:", error);
                    alert(error?.response?.data?.error || error?.response?.data?.message || "Failed to send OTP.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Verify OTP
                if (!otp) {
                    alert("Please enter the OTP");
                    return;
                }
                setIsLoading(true);
                try {
                    const res = await postVerifySmsOtpApi({
                        otp,
                        token,
                        login_type: "user",
                        vendor_id: vendorId,
                    });

                    const userId = res?.data?.user_id;
                    if (userId) {
                        localStorage.setItem("userId", userId);
                        
                        // Sync Cart
                        const cartRes = await getCartApi(`user/${userId}`);
                        if (cartRes?.data?.length > 0) {
                            localStorage.setItem("cartId", cartRes.data[0].id);
                        }
                        
                        alert("Login successful!");
                        window.location.href = "/";
                    } else {
                        alert("Login successful but missing user data.");
                        window.location.href = "/";
                    }
                } catch (error: any) {
                    console.error("Verify OTP failed:", error);
                    alert(error?.response?.data?.error || error?.response?.data?.message || "Invalid OTP or verification failed.");
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            // Email Login
            if (!inputValue || !password) {
                alert("Please enter your credentials");
                return;
            }

            setIsLoading(true);
            try {
                const payload = { email: inputValue, password, vendor_id: vendorId };
                
                const res = await postSignInAPi(payload);
                const userId = res?.data?.user_id || res?.data?.user?.id || res?.data?.id;
                
                if (userId) {
                    localStorage.setItem("userId", userId);

                    // Sync Cart
                    const cartRes = await getCartApi(`user/${userId}`);
                    if (cartRes?.data?.length > 0) {
                        localStorage.setItem("cartId", cartRes.data[0].id);
                    }

                    alert("Login successful!");
                    window.location.href = "/";
                } else {
                    alert("Login successful but missing user data.");
                    window.location.href = "/";
                }
            } catch (error: any) {
                console.error("Login failed:", error);
                alert(error?.response?.data?.error || error?.response?.data?.message || "Login failed. Please check your credentials.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <main className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 text-gray-800 bg-[#f9f8f4]">
            <div className="w-full max-w-[420px] bg-white p-6 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl font-serif text-[#000000] mb-2 tracking-wide">Welcome Back</h1>
                    <p className="text-sm sm:text-base text-[#000000] ">Login to your Sheyas account</p>
                </div>

                {/* Login Method Toggle */}
                <div className="flex p-1 bg-gray-50 rounded-full mb-8 border border-gray-100">
                    <button
                        type="button"
                        onClick={() => handleMethodToggle("phone")}
                        className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${loginMethod === "phone" ? "bg-white shadow-sm text-[#000000]" : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        Mobile
                    </button>
                    <button
                        type="button"
                        onClick={() => handleMethodToggle("email")}
                        className={`flex-1 py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${loginMethod === "email" ? "bg-white shadow-sm text-[#000000]" : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        Email
                    </button>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleLogin}>
                    {/* Mobile or Email Input */}
                    {!(loginMethod === "phone" && isOtpSent) && (
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3 opacity-50 italic px-1">
                                {loginMethod === "phone" ? "Mobile Number" : "Email Address"}
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                    {loginMethod === "phone" ? <Phone className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                                </div>

                                {loginMethod === "phone" && (
                                    <div className="absolute left-14 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                                        <span className="text-sm sm:text-base font-bold text-[#000000]">+91</span>
                                        <div className="w-[1px] h-4 bg-gray-200"></div>
                                    </div>
                                )}

                                <input
                                    type={loginMethod === "phone" ? "tel" : "email"}
                                    placeholder={loginMethod === "phone" ? "98765 43210" : "name@example.com"}
                                    className={`w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pr-6 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide ${loginMethod === "phone" ? "pl-23" : "pl-14"
                                        }`}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Password Field (Only for Email) */}
                    {loginMethod === "email" && (
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3 opacity-50 italic px-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pr-6 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* OTP Field (Only for Phone when OTP is sent) */}
                    {loginMethod === "phone" && isOtpSent && (
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-3 opacity-50 italic px-1">
                                Enter OTP
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 sm:py-4.5 pr-6 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <div className="mt-3 text-right">
                                <button type="button" onClick={() => setIsOtpSent(false)} className="text-xs text-[#000000] opacity-60 hover:opacity-100 transition-opacity font-bold underline italic">Change Mobile Number?</button>
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full bg-[#000000] text-white py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold transition-all shadow-xl flex items-center justify-center gap-3 group tracking-[0.1em] uppercase ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
                    >
                        {isLoading 
                            ? (loginMethod === "phone" && !isOtpSent ? "Sending..." : "Logging in...") 
                            : (loginMethod === "phone" && !isOtpSent ? "Send OTP" : "Login")}
                        {!isLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />}
                    </button>

                </form>

                {/* Footer */}
                <div className="mt-4  border-t border-gray-50 text-center">
                    <p className="text-sm sm:text-base italic ">
                        Don&apos;t have an account? <Link href="/register" className="text-[#000000] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity ml-1">Join now</Link>
                    </p>
                </div>

            </div>
        </main>
    );
}
