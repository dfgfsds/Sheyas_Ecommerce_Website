import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
}

interface CategoryProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryProps) {
    const [imgSrc, setImgSrc] = useState(category.image);

    return (
        <div className="group cursor-pointer">
            <Link href={`/categories/${category.slug || category.id}`}>
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm bg-gray-50">
                    <Image
                        src={imgSrc}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgSrc("/placeholder-image.jpg")}
                    />
                </div>
            </Link>

            {/* Category Info */}
            <div className="space-y-1 text-center">
                <Link href={`/categories/${category.slug || category.id}`}>
                    <h3 className="md:text-xl text-lg font-serif italic text-[#000000] capitalize truncate hover:opacity-70 transition-opacity">
                        {category.name}
                    </h3>
                </Link>

                {/* CTA Button */}
                <Link href={`/categories/${category.slug || category.id}`} className="block mt-4 px-4">
                    <button className="w-full border border-[#000000] md:py-3 py-1.5 rounded-full text-sm md:text-base font-bold text-[#000000] hover:bg-[#000000] hover:text-white transition-all duration-300">
                        View Collection
                    </button>
                </Link>
            </div>
        </div>
    );
}
