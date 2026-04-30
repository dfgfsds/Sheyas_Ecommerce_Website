"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrderItemApi } from "@/api-endpoints/CartsApi";
import { useUser } from "@/context/UserContext";
import { useVendor } from "@/context/VendorContext";
import { useAuthRedirect } from "@/context/useAuthRedirect";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const { user } = useUser();
    const { vendorId } = useVendor();

    // Redirect to login if not authenticated
    useAuthRedirect({ requireAuth: true });

    const userId = user?.data?.id || user?.id;
    const orderId = Array.isArray(id) ? id[0] : id;

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ["order-detail", userId, vendorId, orderId],
        queryFn: () => getOrderItemApi(`?user_id=${userId}&vendor_id=${vendorId}&order_id=${orderId}`),
        enabled: !!userId && !!vendorId && !!orderId,
        staleTime: 1000 * 60 * 5,      // Cache for 5 minutes
        refetchOnWindowFocus: false,    // Don't re-fetch on tab switch
    });

    // Production API data
    const order = response?.data;
    const orderItems: any[] = order?.order_items || [];

    // Format date helper
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // Format currency helper
    const formatCurrency = (value: string | number) => {
        const num = parseFloat(String(value) || "0");
        return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
    };

    // Synchronous check to prevent flashing
    const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('userId') : true;

    // Status badge config
    const getStatusConfig = (status: string) => {
        const s = status?.toLowerCase() || "";
        if (s.includes("delivered")) return { bg: "bg-[#f0f9f0]", text: "text-[#0a5328]", dot: "bg-[#22c55e]", animate: false };
        if (s.includes("confirm") || s.includes("process") || s.includes("shipped")) return { bg: "bg-[#eff6ff]", text: "text-[#1e40af]", dot: "bg-[#3b82f6]", animate: true };
        if (s.includes("pending")) return { bg: "bg-[#fffbeb]", text: "text-[#92400e]", dot: "bg-[#f59e0b]", animate: true };
        if (s.includes("cancel") || s.includes("fail")) return { bg: "bg-[#fef2f2]", text: "text-[#991b1b]", dot: "bg-[#ef4444]", animate: false };
        return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", animate: false };
    };

    if (!hasToken) return null;

    // Show skeleton while initializing or loading
    const isInitializing = !user || isLoading;

    // SKELETON LOADER
    if (isInitializing) {
        return (
            <main className="bg-[#fcfcfc] pt-12 pb-14 md:pt-12 md:pb-16 px-6 sm:px-12 font-sans text-gray-900">
                <div className="max-w-4xl mx-auto">
                    {/* Back link skeleton */}
                    <div className="h-4 w-28 bg-gray-200 rounded-lg animate-pulse mb-10"></div>
                    {/* Header skeleton */}
                    <div className="flex justify-between mb-10">
                        <div className="space-y-2.5">
                            <div className="h-7 w-52 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-4 w-40 bg-gray-100 rounded-lg animate-pulse"></div>
                        </div>
                        <div className="h-9 w-28 bg-gray-200 rounded-full animate-pulse self-start"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left side */}
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
                                    <div className="flex gap-6">
                                        <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div className="h-5 w-3/4 bg-gray-200 rounded-lg"></div>
                                            <div className="flex justify-between items-center mt-auto">
                                                <div className="h-7 w-16 bg-gray-100 rounded-md"></div>
                                                <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Right side*/}
                        <div className="space-y-4">
                            <div className="bg-gray-200 rounded-2xl p-6 h-56 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // ERROR / NOT FOUND STATE
    if ((isError || !order)) {
        return (
            <main className="bg-[#fcfcfc] py-24 px-6 font-sans text-center">
                <ShoppingBag className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold mb-1">Order not found</h2>
                <p className="text-gray-500 font-medium mb-6">We could not load this order. Please try again.</p>
                <Link href="/orders" className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full text-sm font-bold hover:opacity-90 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Orders
                </Link>
            </main>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const address = order.consumer_address;

    return (
        <main className="bg-[#fcfcfc] pt-12 pb-14 md:pb-16 px-6 sm:px-12 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto">
                <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-10 group uppercase tracking-wider">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    My Orders
                </Link>

                {/* Order Header*/}
                <div className="flex flex-row items-start justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
                        <p className="text-sm text-gray-500 font-medium">Placed on {formatDate(order.created_at)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text}`}>
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot} ${statusConfig.animate ? "animate-pulse" : ""}`}></span>
                        {order.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
                                <Package className="w-5 h-5 text-gray-400" />
                                <h2 className="font-bold">Order Items ({orderItems.length})</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {orderItems.length > 0 ? orderItems.map((item: any, index: number) => {
                                    const productName = item.product_details?.name || item.product?.name || "Product";
                                    const productImage = item.product_details?.image_urls?.[0] || item.product?.image_urls?.[0] || null;
                                    const itemPrice = item.price;
                                    const itemQty = item.quantity;

                                    return (
                                        <div key={item.id || index} className="p-6 flex gap-6 items-start">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
                                                <img
                                                    src={productImage || "/placeholder-image.jpg"}
                                                    alt={productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                                <h3 className="font-bold text-[16px] leading-snug mb-2.5 line-clamp-2">{productName}</h3>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-sm text-black font-medium px-2.5 py-1 bg-gray-100 rounded-md">Qty: {itemQty}</span>
                                                    <span className="font-bold text-[16px] text-bold">{formatCurrency(itemPrice)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="p-10 text-center text-gray-400 font-medium">
                                        No items found for this order.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-5 lg:sticky lg:top-10 h-fit">
                        <div className="bg-black text-white rounded-2xl p-7 space-y-4">
                            <h2 className="font-bold text-base mb-4 uppercase tracking-widest text-white/90">Order Summary</h2>
                            <div className="flex justify-between text-sm">
                                <span className="opacity-60 font-medium">Item Total</span>
                                <span className="font-bold">
                                    {formatCurrency(orderItems.reduce((s: number, i: any) =>
                                        s + (parseFloat(i.price || 0) * (i.quantity || 1)), 0)
                                    )}
                                </span>
                            </div>
                            {parseFloat(order.delivery_charge || "0") > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60 font-medium">Delivery</span>
                                    <span className="font-bold">{formatCurrency(order.delivery_charge)}</span>
                                </div>
                            )}
                            {parseFloat(order.gift_wrap_cost || "0") > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60 font-medium">Gift Wrap</span>
                                    <span className="font-bold">{formatCurrency(order.gift_wrap_cost)}</span>
                                </div>
                            )}
                            {parseFloat(order.discount || "0") > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-60 font-medium">Discount</span>
                                    <span className="font-bold text-green-400">-{formatCurrency(order.discount)}</span>
                                </div>
                            )}
                            <div className="h-[1px] bg-white/10 my-2"></div>
                            <div className="flex justify-between text-base font-bold">
                                <span>Total</span>
                                <span>{formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
