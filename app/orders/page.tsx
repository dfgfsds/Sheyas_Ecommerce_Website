"use client";

import Link from "next/link";
import { ChevronRight, Search, Filter, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
    // Mock orders list
    const orders = [
        { id: "1024", date: "Oct 24, 2023", total: "₹5,698.00", status: "Confirmed", itemCount: 2 },
        { id: "1019", date: "Oct 15, 2023", total: "₹3,199.00", status: "Delivered", itemCount: 1 },
        { id: "0988", date: "Sep 28, 2023", total: "₹8,450.00", status: "Delivered", itemCount: 3 },
    ];

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 px-6 sm:px-12 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    
                    {/* Search & Filter Bar */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search all orders" 
                                className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#031c06]/5 focus:border-[#031c06]/20 transition-all shadow-sm"
                            />
                        </div>
                        <button className="p-2.5 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <Link 
                                key={order.id} 
                                href={`/orders/${order.id}`}
                                className="block bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#031c06]/10 transition-all group"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    
                                    {/* Order Brief */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#031c06] group-hover:bg-[#031c06] group-hover:text-white transition-colors">
                                            <ShoppingBag className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg mb-0.5">Order #{order.id}</p>
                                            <p className="text-sm text-gray-500 font-medium">{order.date} • {order.itemCount} item{order.itemCount > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>

                                    {/* Status & Total */}
                                    <div className="flex items-center justify-between sm:justify-end gap-12">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-0.5 uppercase tracking-widest font-bold">Total</p>
                                            <p className="font-bold text-[#031c06]">{order.total}</p>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                order.status === 'Delivered' 
                                                ? 'bg-gray-100 text-gray-600' 
                                                : 'bg-[#f0f9f0] text-[#0a5328]'
                                            }`}>
                                                {order.status}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#031c06] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-medium">You haven&apos;t placed any orders yet.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Placeholder */}
                <div className="mt-12 flex justify-center gap-2">
                    <button className="w-10 h-10 rounded-full border border-[#031c06] bg-[#031c06] text-white text-sm font-bold">1</button>
                    <button className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50">2</button>
                </div>

            </div>
        </main>
    );
}
