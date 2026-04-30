"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Search, Filter, ShoppingBag, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrdersAndOrdersItemsApi } from "@/api-endpoints/CartsApi";
import { useUser } from "@/context/UserContext";
import { useVendor } from "@/context/VendorContext";
import { useAuthRedirect } from "@/context/useAuthRedirect";

export default function OrdersPage() {
    const { user } = useUser();
    const { vendorId } = useVendor();

    // Redirect to login if not authenticated
    useAuthRedirect({ requireAuth: true });

    const userId = user?.data?.id || user?.id;

    const [visibleCount, setVisibleCount] = useState<number>(10);

    const listRef = useRef<HTMLDivElement>(null);

    const handleViewMore = () => {
        setVisibleCount((prev: number) => prev + 10);
    };

    const handleViewLess = () => {
        setVisibleCount(10);
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Synchronous check to prevent flashing
    const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('userId') : true;
    if (!hasToken) return null;

    // Fetch orders from API
    const { data: ordersResponse, isLoading, isError } = useQuery({
        queryKey: ["orders", userId, vendorId],
        queryFn: () => getOrdersAndOrdersItemsApi(`?user_id=${userId}&vendor_id=${vendorId}`),
        enabled: !!userId && !!vendorId,
    });

    // Fallback dummy data for UI testing
    {/*
    const dummyOrders = [
        { id: "1024", order_id: "1024", created_at: "2023-10-24T10:30:00Z", total_amount: "5,698.00", status: "Confirmed", order_items: [{}, {}] },
        { id: "1019", order_id: "1019", created_at: "2023-10-15T14:20:00Z", total_amount: "3,199.00", status: "Delivered", order_items: [{}] },
        { id: "0988", order_id: "0988", created_at: "2023-09-28T09:15:00Z", total_amount: "8,450.00", status: "Delivered", order_items: [{}, {}, {}] },
        { id: "1024-1", order_id: "1024", created_at: "2023-10-24T10:30:00Z", total_amount: "5,698.00", status: "Pending", order_items: [{}, {}] },
        { id: "1019-1", order_id: "1019", created_at: "2023-10-15T14:20:00Z", total_amount: "3,199.00", status: "Cancelled", order_items: [{}] },
        { id: "0988-1", order_id: "0988", created_at: "2023-09-28T09:15:00Z", total_amount: "8,450.00", status: "Shipped", order_items: [{}, {}, {}] },
        { id: "1024-2", order_id: "1024", created_at: "2023-10-24T10:30:00Z", total_amount: "5,698.00", status: "Confirmed", order_items: [{}, {}] },
        { id: "1019-2", order_id: "1019", created_at: "2023-10-15T14:20:00Z", total_amount: "3,199.00", status: "Processing", order_items: [{}] },
        { id: "0988-2", order_id: "0988", created_at: "2023-09-28T09:15:00Z", total_amount: "8,450.00", status: "Out for Delivery", order_items: [{}, {}, {}] },
        { id: "1024-3", order_id: "1024", created_at: "2023-10-24T10:30:00Z", total_amount: "5,698.00", status: "Cancelled", order_items: [{}, {}] },
        { id: "1019-3", order_id: "1019", created_at: "2023-10-15T14:20:00Z", total_amount: "3,199.00", status: "Delivered", order_items: [{}] },
        { id: "0988-3", order_id: "0988", created_at: "2023-09-28T09:15:00Z", total_amount: "8,450.00", status: "Delivered", order_items: [{}, {}, {}] },
        { id: "1024-4", order_id: "1024", created_at: "2023-10-24T10:30:00Z", total_amount: "5,698.00", status: "Confirmed", order_items: [{}, {}] },
        { id: "1019-4", order_id: "1019", created_at: "2023-10-15T14:20:00Z", total_amount: "3,199.00", status: "Delivered", order_items: [{}] },
        { id: "0988-4", order_id: "0988", created_at: "2023-09-28T09:15:00Z", total_amount: "8,450.00", status: "Delivered", order_items: [{}, {}, {}] },
    ];

    const orders = (ordersResponse?.data && ordersResponse.data.length > 0) ? ordersResponse.data : dummyOrders;
    */}


    // PRODUCTION API - fetches real data from the backend
    const orders = ordersResponse?.data || [];

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Show skeleton while initializing or loading
    const isInitializing = !user || isLoading;

    return (
        <main className="bg-[#fcfcfc] py-12 px-6 sm:px-12 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div ref={listRef} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <h1 className="text-3xl font-bold">My Orders</h1>

                    {/* Search & Filter Bar */}
                    {/* <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search all orders"
                                className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#000000]/5 focus:border-[#000000]/20 transition-all shadow-sm"
                            />
                        </div>
                        <button className="p-2.5 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter className="w-5 h-5 text-gray-500" />
                        </button>
                    </div> */}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {isInitializing ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                        <div className="space-y-2.5">
                                            <div className="h-5 w-36 bg-gray-200 rounded-lg"></div>
                                            <div className="h-3.5 w-52 bg-gray-100 rounded-lg"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="space-y-2">
                                            <div className="h-3 w-12 bg-gray-100 rounded ml-auto"></div>
                                            <div className="h-5 w-20 bg-gray-200 rounded-lg"></div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                                            <div className="h-5 w-5 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : isError ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-red-100">
                            <p className="text-red-400 font-medium">Failed to load orders. Please try again later.</p>
                        </div>
                    ) : orders.length > 0 ? (
                        orders.slice(0, visibleCount).map((order: any) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.order_id || order.id}`}
                                className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#000000]/10 transition-all group"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

                                    {/* Order Brief */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#000000] group-hover:bg-[#000000] group-hover:text-white transition-colors">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg mb-0.5">Order #{order.order_id || order.id}</p>
                                            <p className="text-sm text-gray-500 font-medium">
                                                {formatDate(order.created_at || order.date)} • {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status & Total */}
                                    <div className="flex items-center justify-between sm:justify-end gap-12">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-0.5 uppercase tracking-widest font-bold">Total</p>
                                            <p className="font-bold text-[#000000]">₹{order.total_amount || order.total}</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {(() => {
                                                const status = order.status?.toLowerCase() || '';
                                                let config = {
                                                    bg: 'bg-gray-100',
                                                    text: 'text-gray-600',
                                                    dot: 'bg-gray-400',
                                                    animate: false
                                                };

                                                if (status.includes('delivered')) {
                                                    config = { bg: 'bg-[#f0f9f0]', text: 'text-[#0a5328]', dot: 'bg-[#22c55e]', animate: false };
                                                } else if (status.includes('confirm') || status.includes('process') || status.includes('shipped')) {
                                                    config = { bg: 'bg-[#eff6ff]', text: 'text-[#1e40af]', dot: 'bg-[#3b82f6]', animate: true };
                                                } else if (status.includes('pending')) {
                                                    config = { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]', dot: 'bg-[#f59e0b]', animate: true };
                                                } else if (status.includes('cancel') || status.includes('fail')) {
                                                    config = { bg: 'bg-[#fef2f2]', text: 'text-[#991b1b]', dot: 'bg-[#ef4444]', animate: false };
                                                }

                                                return (
                                                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.animate ? 'animate-pulse' : ''}`}></span>
                                                        {order.status}
                                                    </span>
                                                );
                                            })()}
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#000000] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center pt-10 pb-12 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ShoppingBag className="w-10 h-10 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-1.5">No orders found</h3>
                            <p className="text-gray-500 font-medium mb-6 max-w-xs mx-auto">
                                It looks like you haven&apos;t placed any orders yet. Explore our latest collections to find something you love.
                            </p>
                            <Link
                                href="/abaya"
                                className="inline-flex items-center justify-center px-10 py-4 bg-black text-white rounded-full text-sm font-bold hover:opacity-90 transition-all uppercase tracking-widest"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {/* Modern Professional Pagination */}
                <div className="mt-8 flex flex-col items-center gap-4">
                    {orders.length > visibleCount && (
                        <button
                            onClick={handleViewMore}
                            className="cursor-pointer px-6 py-3 border-2 border-black text-black rounded-full text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
                        >
                            View More
                        </button>
                    )}

                    {visibleCount > 10 && (
                        <button
                            onClick={handleViewLess}
                            className="cursor-pointer px-6 py-3 border-2 border-black text-black rounded-full text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
                        >
                            Show Less
                        </button>
                    )}
                </div>

            </div>
        </main>
    );
}
