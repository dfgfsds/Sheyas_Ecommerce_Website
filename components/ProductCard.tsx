import Image from "next/image";
import { Star } from "lucide-react";

import Link from "next/link";

interface ProductProps {
    product: {
        id: number;
        name: string;
        oldPrice: string;
        newPrice: string;
        rating: number;
        reviews: number;
        image: string;
        onSale: boolean;
    };
}

export default function ProductCard({ product }: ProductProps) {
    return (
        <div className="group cursor-pointer">
            <Link href={`/product/${product.id}`}>
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm bg-gray-50">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.onSale && (
                        <div className="absolute top-4 left-4 bg-white text-[#031c06] text-xs font-semibold px-4 py-1.5 rounded-full shadow-md z-10 italic">
                            Sale
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="space-y-1.5">
                <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-medium text-[#031c06] italic hover:opacity-70 transition-opacity">
                        {product.name}
                    </h3>
                </Link>
                
                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 text-[#031c06]">
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-current" : "opacity-30"}`} 
                        />
                    ))}
                    <span className="text-xs ml-1 text-[#031c06]/60">({product.reviews})</span>
                </div>

                {/* Prices */}
                <div className="flex items-center gap-3 py-1">
                    <span className="text-sm text-gray-600 line-through italic">
                        {product.oldPrice}
                    </span>
                    <span className="text-lg font-bold text-[#031c06] italic">
                        {product.newPrice}
                    </span>
                </div>

                {/* CTA Button */}
                <Link href={`/product/${product.id}`} className="block mt-2">
                    <button className="w-full border border-[#031c06] py-3 rounded-full text-base font-bold text-[#031c06] hover:bg-[#031c06] hover:text-white transition-all duration-300 italic">
                        Choose options
                    </button>
                </Link>
            </div>
        </div>
    );
}
