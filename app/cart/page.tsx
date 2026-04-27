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
        <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16  text-gray-800">

            {/* Cart Header */}
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl sm:text-5xl text-[#000000] font-serif italic tracking-wide">Your cart</h1>
                <Link href="/eid-collection" className="text-lg text-bold border-b border-[#000000] pb-0.5 hover:cursor-pointer text-[#000000] ">
                    Continue shopping
                </Link>
            </div>

            {cartItems.length > 0 ? (
                <div className="space-y-8">
                    {/* Table Headers */}
                    <div className="hidden md:grid grid-cols-[1fr_200px_150px] gap-8 border-b border-gray-300 pb-4 text-[16px] md:text-[20px] font-bold tracking-wide capitalize ">
                        <span className="text-left text-[#000000]">Product</span>
                        <span className="text-center text-[#000000]">Quantity</span>
                        <span className="text-right text-[#000000]">Total</span>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-12">
                        {cartItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_200px_150px] gap-6 md:gap-8 items-center border-b border-gray-300 pb-12 last:border-0">

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
                                        <h3 className="text-base sm:text-lg font-medium  leading-tight">{item.name}</h3>
                                        <p className="text-xs sm:text-sm ">{item.newPrice}</p>
                                        <p className="text-xs sm:text-sm  font-semibold">Size: {item.selectedSize}</p>
                                    </div>
                                </div>

                                {/* Quantity Control - Mobile/Desktop split */}
                                <div className="flex items-center justify-between md:justify-center gap-4">
                                    <div className="flex items-center border border-gray-500 rounded-full px-4 py-2">
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
                                            className="text-gray-600 hover:text-red-500 transition-colors p-1"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5 stroke-[1.5px]" />
                                        </button>
                                        {/* Mobile Total */}
                                        <div className="md:hidden text-right font-bold  text-[#000000]">
                                            ₹{(parseFloat(item.newPrice.replace(/[^0-9.-]+/g, "")) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Total Price */}
                                <div className="text-right text-lg font-bold  hidden md:block text-[#000000]">
                                    ₹{(parseFloat(item.newPrice.replace(/[^0-9.-]+/g, "")) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="flex flex-col items-stretch md:items-end pt-12 space-y-6">
                        <div className="flex items-center justify-between md:justify-end md:gap-12 border-t border-gray-100 pt-6 md:border-0 md:pt-0">
                            <span className="text-sm sm:text-base opacity-60 font-bold italic capitalize tracking-wider">Estimated total</span>
                            <span className="text-2xl sm:text-4xl font-bold  text-[#000000]">
                                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-center md:text-right opacity-60 italic md:max-w-xs leading-relaxed">
                            Taxes included. Discounts and <span className="underline cursor-pointer">shipping</span> calculated at checkout.
                        </p>
                        <button className=" bg-[#000000] text-white px-8 py-3 sm:py-3.5 rounded-full text-sm sm:text-base font-bold  hover:opacity-90 transition-all shadow-xl tracking-[0.1em] capitalize">
                            Check out
                        </button>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center space-y-6">
                    <p className="text-xl ">Your cart is currently empty.</p>
                    <Link href="/eid-collection">
                        <button className="bg-[#000000] text-white px-10 py-3 rounded-full text-sm font-bold italic hover:opacity-90 transition-all">
                            Shop Our Collection
                        </button>
                    </Link>
                </div>
            )}
        </main>
    );
}
