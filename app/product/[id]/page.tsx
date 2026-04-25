"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Minus, Plus, Share2, Ruler, Truck, RefreshCw, CreditCard, ChevronDown } from "lucide-react";
import { products } from "@/data/products";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage() {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id as string)) || products[0];
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("52");

    const sizes = ["52", "54", "56", "58"];

    return (
        <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12 font-[family-name:var(--font-cormorant)] text-[#031c06]">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

                {/* Left Column - Gallery */}
                <div className="space-y-6">
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl bg-gray-50">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        {product.onSale && (
                            <div className="absolute top-6 left-6 bg-white px-6 py-2 rounded-full shadow-lg text-sm font-bold italic z-10">
                                Sale
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-100">
                                <Image
                                    src={product.image}
                                    alt={`Detail ${i}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Lifestyle/Video Placeholder */}
                    <div className="relative aspect-video rounded-[2rem] overflow-hidden mt-8 group cursor-pointer">
                        <Image
                            src={product.image}
                            alt="Lifestyle View"
                            fill
                            className="object-cover brightness-75 group-hover:brightness-90 transition-all"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-[#031c06] border-b-[10px] border-b-transparent ml-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Product Info */}
                <div className="flex flex-col pt-4">
                    <span className="text-sm tracking-[0.2em] opacity-60 uppercase font-medium mb-2">Sakina Abaya</span>
                    <h1 className="text-4xl sm:text-5xl font-serif mb-6 italic tracking-wide">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-lg opacity-40 line-through italic">{product.oldPrice}</span>
                        <span className="text-3xl font-bold italic">{product.newPrice}</span>
                        <span className="bg-[#031c06] text-white text-xs px-3 py-1 rounded-full italic font-medium uppercase tracking-wider">Sale</span>
                    </div>

                    <p className="text-sm opacity-60 italic mb-6">Taxes included.</p>

                    <div className="flex items-center gap-2 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center text-[#031c06]">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < 4.5 ? "fill-current" : "opacity-30"}`} />
                            ))}
                        </div>
                        <span className="text-sm italic opacity-80">{product.reviews} reviews</span>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold italic uppercase tracking-wider">Size</span>
                            <button className="flex items-center gap-2 text-sm italic hover:underline">
                                <Ruler className="w-4 h-4" /> Size chart
                            </button>
                        </div>
                        <div className="flex gap-3">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 rounded-full border text-sm font-medium transition-all ${selectedSize === size
                                        ? "bg-[#031c06] text-white border-[#031c06]"
                                        : "border-gray-200 hover:border-[#031c06]"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-10">
                        <span className="text-sm font-bold italic uppercase tracking-wider block mb-4">Quantity</span>
                        <div className="inline-flex items-center border border-gray-200 rounded-full px-6 py-3">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:opacity-60 transition-opacity">
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="hover:opacity-60 transition-opacity">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4 mb-12">
                        <button className="w-full border-2 border-[#031c06] py-4 rounded-full text-lg font-bold italic hover:bg-[#031c06] hover:text-white transition-all">
                            Add to cart
                        </button>
                        <button className="w-full bg-[#5a4636] text-white py-4 rounded-full text-lg font-bold italic hover:opacity-90 transition-all shadow-xl">
                            Buy it now
                        </button>
                    </div>

                    {/* Info Icons */}
                    <div className="grid grid-cols-3 gap-4 py-8 border-t border-b border-gray-100 mb-12">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <Truck className="w-6 h-6 stroke-[1.5px]" />
                            <span className="text-[10px] sm:text-xs italic leading-tight">Shipping in 3-5 Days</span>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <RefreshCw className="w-6 h-6 stroke-[1.5px]" />
                            <span className="text-[10px] sm:text-xs italic leading-tight">7 Days Easy Return</span>
                        </div>
                        <div className="flex flex-col items-center text-center space-y-2">
                            <CreditCard className="w-6 h-6 stroke-[1.5px]" />
                            <span className="text-[10px] sm:text-xs italic leading-tight">Cash on Delivery</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-stone max-w-none italic text-[#031c06]/80 leading-relaxed space-y-4">
                        <p>
                            Gracefully balanced between warm softness and structure, the
                            <strong> {product.name}</strong> is designed to make an elegant
                            statement without excess.
                        </p>
                        <p>
                            Featuring a flowing black outer layer paired with a
                            blush pink inner panel, this abaya creates a striking
                            contrast that feels refined and feminine.
                        </p>
                        <ul className="list-none p-0 space-y-2 not-italic font-medium text-sm border-t border-gray-100 pt-6">
                            <li className="flex justify-between border-b border-gray-50 py-2"><span>Fabric</span> <span className="opacity-60">Premium Nidha Fabric</span></li>
                            <li className="flex justify-between border-b border-gray-50 py-2"><span>Style</span> <span className="opacity-60">Two-tone layered design</span></li>
                            <li className="flex justify-between border-b border-gray-50 py-2"><span>Detailing</span> <span className="opacity-60">Embroidered lapels</span></li>
                            <li className="flex justify-between border-b border-gray-50 py-2"><span>Fit</span> <span className="opacity-60">Modest, full-length fit</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Section: You May Also Like */}
            <div className="border-t border-gray-100 pt-24 mb-24">
                <h2 className="text-3xl font-serif mb-12 italic">You may also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.slice(4, 8).map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>

            {/* Bottom Section: Customer Reviews */}
            <div className="border-t border-gray-100 pt-24">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-serif mb-12 italic text-center">Customer Reviews</h2>

                    {/* Review Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16 bg-[#f9f8f4] p-10 rounded-[2rem]">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-1 text-[#031c06] mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-xl font-bold italic">4.25 out of 5</p>
                            <p className="text-sm opacity-60 italic">Based on {product.reviews} reviews</p>
                        </div>

                        <div className="flex-1 max-w-sm space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-4 text-xs italic">
                                    <div className="flex items-center gap-1 w-12">
                                        {rating} <Star className="w-3 h-3 fill-current" />
                                    </div>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full bg-[#031c06]`} style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 10}%` }}></div>
                                    </div>
                                    <span className="w-4">{rating === 5 ? 2 : rating === 4 ? 0 : 1}</span>
                                </div>
                            ))}
                        </div>

                        <button className="bg-[#5a4636] text-white px-8 py-3 rounded-full text-sm font-bold italic hover:opacity-90 transition-all">
                            Write a review
                        </button>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-12">
                        {[1, 2].map((i) => (
                            <div key={i} className="border-b border-gray-100 pb-12">
                                <div className="flex items-center gap-1 text-[#031c06] mb-3">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className={`w-3 h-3 ${j < (i === 1 ? 5 : 4) ? "fill-current" : "opacity-20"}`} />
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                                        {i === 1 ? "M" : "S"}
                                    </div>
                                    <span className="text-sm font-bold italic">{i === 1 ? "Mujtaba" : "Sahra"}</span>
                                </div>
                                <p className="text-sm text-[#031c06]/80 italic leading-relaxed">
                                    {i === 1 ? "The quality is outstanding. The fabric feels very premium and the fit is perfect." : "Beautiful abaya, but shipping took a bit longer than expected. Overall happy with the purchase."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
