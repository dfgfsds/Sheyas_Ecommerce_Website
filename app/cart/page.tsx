"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { products } from "@/data/products";

export default function CartPage() {
    // Mocking cart items based on the first two products
    const [cartItems, setCartItems] = useState([
        { ...products[2], quantity: 1, selectedSize: "52" }, // Petal Dusk Abaya
        { ...products[0], quantity: 1, selectedSize: "52" }, // Black Blossom Abaya
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.newPrice.replace(/[^0-9.-]+/g, ""));
        return acc + (price * item.quantity);
    }, 0);

    return (
        <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 font-[family-name:var(--font-cormorant)] text-gray-800">

            {/* Cart Header */}
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl sm:text-5xl font-serif italic tracking-wide">Your cart</h1>
                <Link href="/eid-collection" className="text-lg italic border-b border-[#031c06] pb-0.5 hover:opacity-70 transition-opacity">
                    Continue shopping
                </Link>
            </div>

            {cartItems.length > 0 ? (
                <div className="space-y-8">
                    {/* Table Headers */}
                    <div className="hidden md:grid grid-cols-[1fr_200px_150px] gap-8 border-b border-gray-300 pb-4 text-[14px] font-bold tracking-wide uppercase opacity-70 italic">
                        <span className="text-left text-gray-900">Product</span>
                        <span className="text-center text-gray-900">Quantity</span>
                        <span className="text-right text-gray-900">Total</span>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-12">
                        {cartItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_200px_150px] gap-6 md:gap-8 items-center border-b border-gray-100 pb-12 last:border-0">
                                
                                {/* Product Info */}
                                <div className="flex gap-4 sm:gap-6 items-center">
                                    <div className="relative w-20 sm:w-32 aspect-[3/4] rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base sm:text-lg font-medium italic leading-tight">{item.name}</h3>
                                        <p className="text-xs sm:text-sm opacity-60 italic">{item.newPrice}</p>
                                        <p className="text-xs sm:text-sm opacity-60 italic font-semibold">Size: {item.selectedSize}</p>
                                    </div>
                                </div>

                                {/* Quantity Control - Mobile/Desktop split */}
                                <div className="flex items-center justify-between md:justify-center gap-4">
                                    <div className="flex items-center border border-gray-200 rounded-full px-4 py-2">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="hover:opacity-60 transition-opacity p-1">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 sm:w-10 text-center text-sm font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="hover:opacity-60 transition-opacity p-1">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5 stroke-[1.5px]" />
                                        </button>
                                        {/* Mobile Total */}
                                        <div className="md:hidden text-right font-bold italic text-[#031c06]">
                                            ₹{(parseFloat(item.newPrice.replace(/[^0-9.-]+/g, "")) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Total Price */}
                                <div className="text-right text-lg font-bold italic hidden md:block text-[#031c06]">
                                    ₹{(parseFloat(item.newPrice.replace(/[^0-9.-]+/g, "")) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="flex flex-col items-stretch md:items-end pt-12 space-y-6">
                        <div className="flex items-center justify-between md:justify-end md:gap-12 border-t border-gray-100 pt-6 md:border-0 md:pt-0">
                            <span className="text-sm sm:text-base opacity-60 font-bold italic uppercase tracking-wider">Estimated total</span>
                            <span className="text-2xl sm:text-4xl font-bold italic text-[#031c06]">
                                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-center md:text-right opacity-40 italic md:max-w-xs leading-relaxed">
                            Taxes included. Discounts and <span className="underline cursor-pointer">shipping</span> calculated at checkout.
                        </p>
                        <button className="w-full md:w-[400px] bg-[#5a4636] text-white py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold italic hover:opacity-90 transition-all shadow-xl tracking-[0.1em] uppercase">
                            Check out
                        </button>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center space-y-6">
                    <p className="text-xl italic opacity-60">Your cart is currently empty.</p>
                    <Link href="/eid-collection">
                        <button className="bg-[#031c06] text-white px-10 py-3 rounded-full text-sm font-bold italic hover:opacity-90 transition-all">
                            Shop Our Collection
                        </button>
                    </Link>
                </div>
            )}
        </main>
    );
}
