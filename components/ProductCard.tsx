import Image from "next/image";
import { Star } from "lucide-react";

import Link from "next/link";

export interface Product {
    id: number;
    name: string;
    oldPrice: string;
    newPrice: string;
    rating: number;
    reviews: number;
    image: string;
    onSale: boolean;
    categoryName?: string;
}

interface ProductProps {
    product: Product;
}

import { useState } from "react";

export default function ProductCard({ product }: ProductProps) {
    const [imgSrc, setImgSrc] = useState(product.image);

    return (
        <div className="group cursor-pointer">
            <Link href={`/product/${product.id}`}>
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm bg-gray-50">
                    <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgSrc("/placeholder-image.jpg")}
                    />
                    {/* {product.onSale && (
                        <div className="absolute top-4 left-4 bg-white text-[#000000] text-xs font-semibold px-4 py-1.5 rounded-full shadow-md z-10 italic">
                            Sale
                        </div>
                    )} */}
                </div>
            </Link>

            {/* Product Info */}
            <div className="space-y-1">
                <Link href={`/product/${product.id}`}>
                    <h3 className="md:text-lg text-base font-semibold text-[#000000] capitalize truncate hover:opacity-70 transition-opacity">
                        {product.name}
                    </h3>
                </Link>

                {/* Category Name */}
                <div className="text-[11px] uppercase tracking-[0.10em] text-gray-500 font-bold pt-0.5">
                    {product.categoryName}
                </div>

                {/* Rating Stars */}
                {/*
                <div className="flex items-center gap-0.5 pt-1.5 text-[#000000]">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`md:w-4 w-3 md:h-4 h-3 ${i < Math.floor(product.rating) ? "fill-current" : "opacity-30"}`}
                        />
                    ))}
                    <span className="md:text-xs text-xs ml-1 text-[#000000]/60">({product.reviews})</span>
                </div>
                */}

                {/* Prices */}
                <div className="flex items-center gap-2">
                    <span className="md:text-lg text-sm font-bold text-[#000000] ">
                        {product.newPrice}
                    </span>
                    <span className="md:text-sm text-xs text-gray-600 line-through ">
                        {product.oldPrice}
                    </span>
                </div>

                {/* CTA Button */}
                <Link href={`/product/${product.id}`} className="block mt-3">
                    <button className="w-full border border-[#000000] md:py-3 py-1.5 rounded-full text-sm md:text-base font-bold text-[#000000] hover:bg-[#000000] hover:text-white transition-all duration-300">
                        Choose options
                    </button>
                </Link>
            </div>
        </div>
    );
}
