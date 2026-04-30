"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useVendor } from "@/context/VendorContext";
import { postSendOtpAPi, postSendOtpVerifyAPi, updateUserAPi } from "@/api-endpoints/authendication";
import { safeErrorLog } from "@/utils/error-handler";
import { handleApiError } from "@/utils/error-utils";

type ForgotStep = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<ForgotStep>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const otpInputRef = useRef<HTMLInputElement>(null);

    const { showToast } = useToast();
    const { vendorId } = useVendor();
    const router = useRouter();

    // Focus OTP input when step changes to 'otp'
    useEffect(() => {
        if (step === "otp" && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [step]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            showToast("Please enter your email address", "error");
            return;
        }
        setIsLoading(true);
        try {
            const res = await postSendOtpAPi({
                email: email,
                vendor_id: vendorId
            });

            if (res?.data?.token) {
                setToken(res.data.token);
                setStep("otp");
                showToast("Reset code sent to your email. Please check your inbox to reset your password", "success");
            } else {
                showToast("Failed to send reset code. Please try again.", "error");
            }
        } catch (error: any) {
            safeErrorLog("Send Reset OTP failed", error);
            showToast(handleApiError(error), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            showToast("Please enter the 6-digit verification code", "error");
            return;
        }
        setIsLoading(true);
        try {
            const res = await postSendOtpVerifyAPi({
                login_type: "user",
                otp: otp,
                token: token,
                vendor_id: vendorId
            });

            if (res.status === 200 || res.status === 201) {
                // Capture the user_id from the response
                const uId = res.data?.user_id || res.data?.user?.id || res.data?.id;
                if (uId) {
                    setUserId(uId);
                    showToast("Code verified successfully!", "success");
                    setStep("reset");
                } else {
                    showToast("Verification successful, but user ID not found. Please try again.", "error");
                }
            }
        } catch (error: any) {
            safeErrorLog("OTP Verification failed", error);
            showToast(handleApiError(error), "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        if (password !== confirmPassword) {
            showToast("Passwords do not match. Please ensure both entries are identical.", "error");
            return;
        }
        if (!userId) {
            showToast("Session expired. Please start the process again.", "error");
            setStep("email");
            return;
        }

        setIsLoading(true);
        try {
            await updateUserAPi(`/${userId}`, {
                password: password,
                updated_by: "user",
                role: 3,
                vendor: vendorId
            });

            showToast("Password reset successfully! You can now login with your new password.", "success");
            router.push("/login");
        } catch (error: any) {
            safeErrorLog("Password Reset failed", error);
            showToast(handleApiError(error), "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 text-gray-800 bg-[#f9f8f4]">
            <div className="w-full max-w-[440px] bg-white p-6 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">

                {/* Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl font-serif text-[#000000] mb-2 tracking-wide">
                        {step === "email" && "Reset Password"}
                        {step === "otp" && "Verify Email"}
                        {step === "reset" && "New Password"}
                    </h1>
                    <p className="text-sm sm:text-base text-[#000000] opacity-60">
                        {step === "email" && "Enter your email to receive a reset code"}
                        {step === "otp" && (
                            <>
                                We've sent a 6-digit code to <span className="font-bold text-[#000000] opacity-100">{email}</span>
                            </>
                        )}
                        {step === "reset" && "Create a secure new password for your account"}
                    </p>
                </div>

                {/* STEP 1: EMAIL */}
                {step === "email" && (
                    <form className="space-y-6" onSubmit={handleSendOtp}>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] mb-3 opacity-50 italic px-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 sm:py-4 pr-6 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#000000] text-white py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all shadow-xl flex items-center justify-center gap-3 group tracking-[0.1em] uppercase ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
                        >
                            {isLoading ? "Sending..." : "Send OTP"}
                            {!isLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />}
                        </button>
                    </form>
                )}

                {/* STEP 2: OTP */}
                {step === "otp" && (
                    <form className="space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] mb-3 opacity-50 italic px-1">
                                Verification Code
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    ref={otpInputRef}
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter 6-digit code"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 sm:py-4 pr-6 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#000000] text-white py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all shadow-xl flex items-center justify-center gap-3 group tracking-[0.1em] uppercase ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
                        >
                            {isLoading ? "Verifying..." : "Verify Code"}
                            {!isLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />}
                        </button>
                    </form>
                )}

                {/* STEP 3: RESET PASSWORD */}
                {step === "reset" && (
                    <form className="space-y-5" onSubmit={handleResetPassword}>
                        {/* New Password */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] mb-3 opacity-50 italic px-1">
                                New Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 sm:py-4 pr-14 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] mb-3 opacity-50 italic px-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000000] transition-colors z-10">
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 sm:py-4 pr-14 pl-14 transition-all duration-300 focus:bg-white focus:border-[#000000]/20 focus:ring-4 focus:ring-[#000000]/5 outline-none font-bold text-sm sm:text-base tracking-wide"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#000000] transition-colors z-10"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#000000] text-white py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all shadow-xl flex items-center justify-center gap-3 group tracking-[0.1em] uppercase mt-8 ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                            {!isLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />}
                        </button>
                    </form>
                )}

                {step !== "reset" && (
                    <div className="mt-5 border-t border-gray-50 text-center">
                        {step === "email" ? (
                            <p className="text-sm sm:text-base italic ">
                                Remembered your password? <Link href="/login" className="text-[#000000] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity ml-1">Sign in</Link>
                            </p>
                        ) : (
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em]">
                                Wrong Email?{" "}
                                <button
                                    onClick={() => {
                                        setStep("email");
                                        setOtp("");
                                    }}
                                    className="text-[#000000] opacity-100 font-bold hover:underline underline-offset-4 transition-all ml-0.5"
                                >
                                    Change
                                </button>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
