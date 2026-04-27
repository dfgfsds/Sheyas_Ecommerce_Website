"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, CreditCard, Clock } from "lucide-react";
import { products } from "@/data/products";

export default function OrderDetailsPage() {
    const { id } = useParams();

    // Mock order data
    const order = {
        id: id || "1024",
        date: "October 24, 2023",
        status: "Confirmed",
        items: [
            { ...products[2], quantity: 1 }, // Petal Dusk Abaya
            { ...products[0], quantity: 1 }, // Black Blossom Abaya
        ],
        shippingAddress: {
            name: "Hariharan",
            address: "123, Luxury Street, Anna Nagar",
            city: "Chennai",
            pincode: "600040",
            phone: "+91 98765 43210"
        },
        paymentMethod: "Cash on Delivery",
        subtotal: "₹5,698.00",
        shipping: "₹0.00",
        total: "₹5,698.00"
    };

    return (
        <main className="min-h-screen bg-[#fcfcfc] py-12 px-6 sm:px-12 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto">

                {/* Back Link */}
                <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Profile
                </Link>

                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Order #{order.id}</h1>
                        <p className="text-sm text-gray-500">Placed on {order.date}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#f0f9f0] text-[#0a5328] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 bg-[#0a5328] rounded-full animate-pulse"></div>
                        {order.status}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Items & Timeline */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Order Items */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                                <Package className="w-5 h-5 text-gray-400" />
                                <h2 className="font-bold">Order Items</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-6 flex gap-6 items-center">
                                        <div className="relative w-20 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-base mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2 italic">Size: 52</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900">Qty: {item.quantity}</span>
                                                <span className="font-bold text-[#000000]">{item.newPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Timeline Placeholder */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-8">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <h2 className="font-bold">Order Timeline</h2>
                            </div>
                            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                <div className="flex gap-6 relative">
                                    <div className="w-6 h-6 bg-green-800 rounded-full border-4 border-white shadow-sm z-10 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-bold">Order Confirmed</p>
                                        <p className="text-xs text-gray-500 italic">{order.date} • 10:30 AM</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 relative">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full border-4 border-white shadow-sm z-10 flex-shrink-0"></div>
                                    <div className="opacity-40">
                                        <p className="text-sm font-bold">Shipped</p>
                                        <p className="text-xs italic">Expected by Oct 27</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Address & Summary */}
                    <div className="space-y-8">

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <h2 className="font-bold">Shipping</h2>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p className="font-bold">{order.shippingAddress.name}</p>
                                <p className="text-gray-600 italic leading-relaxed">
                                    {order.shippingAddress.address},<br />
                                    {order.shippingAddress.city} - {order.shippingAddress.pincode}
                                </p>
                                <p className="text-gray-600 pt-2">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <h2 className="font-bold">Payment</h2>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-[#000000] text-white rounded-xl shadow-xl p-8 space-y-4">
                            <h2 className="font-serif italic text-xl mb-4 tracking-wide">Summary</h2>
                            <div className="flex justify-between text-sm opacity-60">
                                <span>Subtotal</span>
                                <span>{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-60">
                                <span>Shipping</span>
                                <span>{order.shipping}</span>
                            </div>
                            <div className="h-[1px] bg-white/10 my-4"></div>
                            <div className="flex justify-between text-lg font-bold">
                                <span className="italic">Total</span>
                                <span>{order.total}</span>
                            </div>
                        </div>

                        {/* Download Invoice Button */}
                        <button className="w-full py-4 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                            Download Invoice
                        </button>
                    </div>
                </div>

            </div>
        </main>
    );
}
