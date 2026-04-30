"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Minus, Plus, Share2, Ruler, Truck, RefreshCw, CreditCard, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProductWithVariantSizeApi } from "@/api-endpoints/products";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";
import { useVendor } from "@/context/VendorContext";
import { useUser } from "@/context/UserContext";
import { useCartItem } from "@/context/CartItemContext";
import { postCartCreateApi, postCartitemApi } from "@/api-endpoints/CartsApi";
import { useToast } from "@/context/ToastContext";
import { safeErrorLog } from "@/utils/error-handler";
import { handleApiError } from "@/utils/error-utils";

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { products: allProducts } = useProducts();

    const { data: productData, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const res = await getProductWithVariantSizeApi(id);
            return res.data;
        },
        enabled: !!id,
    });

    const { vendorId } = useVendor();
    const { user } = useUser();
    const { refetchCart } = useCartItem();
    const { showToast } = useToast();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [mainImage, setMainImage] = useState("");

    // Update main image and selected size when data arrives
    React.useEffect(() => {
        if (productData) {
            const firstImage = (productData.image_urls && productData.image_urls[0]) || productData.product_image || "/abaya_1.png";
            setMainImage(firstImage.replace("http://ip/", "http://82.29.161.36/"));

            if (productData.variants?.length > 0 && productData.variants[0].sizes?.length > 0) {
                setSelectedSize(productData.variants[0].sizes[0].product_size);
            }
        }
    }, [productData]);

    const handleAddToCart = async () => {
        if (!user || !user.id) {
            showToast("Please login to add items to your cart", "warning");
            router.push("/login");
            return;
        }

        setIsAddingToCart(true);
        try {
            let currentCartId = localStorage.getItem('cartId');

            if (!currentCartId) {
                const cartRes = await postCartCreateApi("", {
                    user: user.id,
                    vendor: vendorId,
                    created_by: user.id
                });
                currentCartId = cartRes.data?.id || cartRes.data?.cart_id || cartRes.data?.data?.id;
                if (currentCartId) {
                    localStorage.setItem('cartId', currentCartId);
                }
            }

            if (!currentCartId) {
                throw new Error("Could not create or retrieve cart ID");
            }

            const selectedVariant = productData.variants?.find((v: any) =>
                v.sizes?.some((s: any) => s.product_size === selectedSize)
            );

            const payload = {
                cart: currentCartId,
                user: user.id,
                vendor: vendorId,
                created_by: user.id,
                product: productData.id,
                quantity: quantity,
                variant: selectedVariant?.id
            };

            await postCartitemApi("", payload);
            if (refetchCart) refetchCart();
            showToast("Added to cart successfully!", "success");
        } catch (err: any) {
            safeErrorLog("Error adding to cart", err);
            showToast(handleApiError(err), "error");
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#000000]"></div>
            </div>
        );
    }

    if (error || !productData) {
        return (
            <div className="min-h-screen flex items-center justify-center italic text-xl">
                Product not found
            </div>
        );
    }

    const product = {
        id: productData.id,
        name: productData.name || productData.product_name || "Unnamed Product",
        oldPrice: productData.discount ? `₹${productData.discount}` : `₹${productData.price}`,
        newPrice: `₹${productData.price}`,
        reviews: productData.reviews || 0,
        description: productData.description || "No description available.",
        onSale: productData.discount ? parseFloat(productData.discount) > parseFloat(productData.price) : false,
    };

    const images = productData.image_urls?.map((url: string) => url.replace("http://ip/", "http://82.29.161.36/")) || [mainImage];
    const sizes = Array.from(new Set(
        productData.variants?.flatMap((v: any) => v.sizes?.map((s: any) => s.product_size) || [])
            .filter(Boolean) || []
    ));

    return (
        <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-12  text-[#000000]">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

                {/* Left Column - Gallery */}
                <div className="space-y-6">
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl bg-gray-50">
                        {mainImage && (
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}
                        {product.onSale && (
                            <div className="absolute top-6 left-6 bg-white px-6 py-2 rounded-full shadow-lg text-sm font-bold italic z-10">
                                Sale
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {images.slice(0, 3).map((img: string, i: number) => (
                            <div
                                key={i}
                                onClick={() => setMainImage(img)}
                                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border ${mainImage === img ? "border-[#000000] border-2" : "border-gray-100"}`}
                            >
                                <Image
                                    src={img}
                                    alt={`Detail ${i}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Lifestyle/Video Placeholder */}
                    <div className="relative aspect-video rounded-[2rem] overflow-hidden mt-8 group cursor-pointer">
                        {mainImage && (
                            <Image
                                src={mainImage}
                                alt="Lifestyle View"
                                fill
                                className="object-cover brightness-75 group-hover:brightness-90 transition-all"
                            />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-[#000000] border-b-[10px] border-b-transparent ml-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Product Info */}
                <div className="flex flex-col pt-4">
                    <span className="text-sm tracking-[0.2em] opacity-60 uppercase font-medium mb-2">Sheyas</span>
                    <h1 className="text-4xl sm:text-5xl  font-bold mb-6  tracking-wide">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-lg opacity-40 line-through italic">{product.oldPrice}</span>
                        <span className="text-3xl font-bold ">{product.newPrice}</span>
                        <span className="bg-[#000000] text-white text-xs px-3 py-1 rounded-full italic font-medium uppercase tracking-wider">Sale</span>
                    </div>

                    <p className="text-sm md:text-base font-medium  mb-6">Taxes included.</p>

                    <div className="flex items-center gap-2 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center text-yellow-600">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < 4.5 ? "fill-current" : "opacity-30"}`} />
                            ))}
                        </div>
                        <span className="text-sm md:text-lg font-medium  opacity-80">{product.reviews} reviews</span>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-8">

                        <div className="flex gap-3">
                            {sizes.map((size: any, index: number) => (
                                <button
                                    key={`${size}-${index}`}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-14 h-14 rounded-full border text-sm font-medium transition-all ${selectedSize === size
                                        ? "bg-[#000000] text-white border-[#000000]"
                                        : "border-gray-200 hover:border-[#000000]"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-10">
                        <span className="text-sm font-bold  uppercase tracking-wider block mb-4">Quantity</span>
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
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            className={`w-full border-2 border-[#000000] py-4 rounded-full text-lg font-bold italic transition-all ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#000000] hover:text-white'}`}
                        >
                            {isAddingToCart ? "Adding to cart..." : "Add to cart"}
                        </button>
                        {/* <button className="w-full bg-[#000000] text-white py-4 rounded-full text-lg font-bold italic hover:opacity-90 transition-all shadow-xl">
                            Buy it now
                        </button> */}
                    </div>

                    {/*
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
                    </div> */}

                    <div className="prose prose-stone max-w-none italic text-[#000000]/80 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
            </div>

            {/* Bottom Section: You May Also Like */}
            <div className="border-t border-gray-100 pt-24 mb-24">
                <h2 className="text-3xl font-serif mb-12 italic">You may also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {allProducts && allProducts.length > 0 && allProducts.slice(0, 4).map((p: any) => (
                        <ProductCard
                            key={p.id}
                            product={{
                                id: p.id,
                                name: p.name || p.product_name,
                                oldPrice: `₹${p.discount || p.price}`,
                                newPrice: `₹${p.price}`,
                                rating: p.ratings || 0,
                                reviews: 0,
                                image: (p.image_urls && p.image_urls[0]) || p.product_image || "/abaya_1.png",
                                onSale: p.discount ? parseFloat(p.discount) > parseFloat(p.price) : false,
                            }}
                        />
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
                            <div className="flex items-center justify-center md:justify-start gap-1 text-[#000000] mb-2">
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
                                        <div className={`h-full bg-[#000000]`} style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 10}%` }}></div>
                                    </div>
                                    <span className="w-4">{rating === 5 ? 2 : rating === 4 ? 0 : 1}</span>
                                </div>
                            ))}
                        </div>

                        <button className="bg-[#000000] text-white px-8 py-3 rounded-full text-sm font-bold italic hover:opacity-90 transition-all">
                            Write a review
                        </button>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-12">
                        {[1, 2].map((i) => (
                            <div key={i} className="border-b border-gray-100 pb-12">
                                <div className="flex items-center gap-1 text-[#000000] mb-3">
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
                                <p className="text-sm text-[#000000]/80 italic leading-relaxed">
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
