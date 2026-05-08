"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Minus, Plus, Share2, Ruler, Truck, RefreshCw, CreditCard, ChevronDown, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProductWithVariantSizeApi } from "@/api-endpoints/products";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";
import { useVendor } from "@/context/VendorContext";
import { useUser } from "@/context/UserContext";
import { useCartItem } from "@/context/CartItemContext";
import { postCartCreateApi, postCartitemApi, updateCartitemsApi, deleteCartitemsApi } from "@/api-endpoints/CartsApi";
import { useToast } from "@/context/ToastContext";
import { safeErrorLog } from "@/utils/error-handler";
import { handleApiError } from "@/utils/error-utils";

export default function ProductDetailPage() {
    const [isZoomVisible, setIsZoomVisible] = useState(false);
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
    const { cartItem, refetchCart, refreshCartId } = useCartItem();
    const { showToast } = useToast();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isUpdatingCart, setIsUpdatingCart] = useState(false);

    const [selectedSize, setSelectedSize] = useState<any>("");
    const [mainImage, setMainImage] = useState("");
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [zoomBackgroundPosition, setZoomBackgroundPosition] = useState("50% 50%");
    console.log(selectedSize)

    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    React.useEffect(() => {
        if (productData) {

            const firstImage =
                (productData.image_urls && productData.image_urls[0]) ||
                productData.product_image ||
                "/placeholder-image.jpg";

            setMainImage(
                firstImage.replace(
                    "http://ip/",
                    "http://82.29.161.36/"
                )
            );

            // AUTO SELECT FIRST VARIANT
            if (productData.variants?.length > 0) {

                const firstVariant = productData.variants[0];

                setSelectedVariant(firstVariant);

                // AUTO SELECT FIRST SIZE
                if (firstVariant?.sizes?.length > 0) {
                    setSelectedSize(firstVariant.sizes[0]);
                }
            }
        }
    }, [productData]);
    console.log(productData);

    const currentVariant =
        productData?.variants?.find(
            (v: any) => v.id === selectedVariant?.id
        );

    const currentSize =
        currentVariant?.sizes?.find(
            (s: any) => s.id === selectedSize?.id
        );

    const finalPrice =
        currentSize?.product_size_price ||
        currentVariant?.product_variant_price ||
        productData?.price;

    const finalOldPrice =
        currentSize?.product_size_discount ||
        currentVariant?.product_variant_discount ||
        productData?.discount;


    // Update main image and selected size when data arrives
    React.useEffect(() => {
        if (productData) {
            const firstImage = (productData.image_urls && productData.image_urls[0]) || productData.product_image || "/placeholder-image.jpg";
            setMainImage(firstImage.replace("http://ip/", "http://82.29.161.36/"));

            if (productData.variants?.length > 0 && productData.variants[0].sizes?.length > 0) {
                setSelectedSize(productData.variants[0].sizes[0].product_size);
            }
        }
    }, [productData]);

    const handleAddToCart = async () => {
        const userId = user?.data?.id || user?.id;

        if (!userId) {
            showToast("Please login to add items to your cart", "warning");
            router.push(`/login?redirect=/product/${id}`);
            return;
        }

        if (
            productData.variants?.length > 0 &&
            !selectedVariant
        ) {
            showToast("Please select a size before adding to cart", "warning");
            return;
        }

        setIsAddingToCart(true);
        try {
            let currentCartId = localStorage.getItem('cartId');

            if (!currentCartId) {
                const cartRes = await postCartCreateApi("", {
                    user: userId,
                    vendor: vendorId,
                    created_by: userId
                });
                currentCartId = cartRes.data?.id || cartRes.data?.cart_id || cartRes.data?.data?.id;
                if (currentCartId) {
                    localStorage.setItem('cartId', currentCartId);
                    refreshCartId(); // Immediately sync context with new cartId
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
                user: userId,
                vendor: vendorId,
                created_by: userId,
                product: productData.id,
                quantity: 1,
                // variant: selectedVariant?.id,
                // product_variant: selectedVariant?.id, // Added for backend compatibility
                variant: selectedVariant?.id || null,
                product_variant: selectedVariant?.id || null,

                size: selectedSize?.id || null,
                product_size: selectedSize?.id || null,
            };

            await postCartitemApi("", payload);
            if (refetchCart) refetchCart();
            showToast("Item successfully added to your cart.", "success");
        } catch (err: any) {
            safeErrorLog("Error adding to cart", err);
            showToast(handleApiError(err), "error");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleIncreaseQty = async (cartItemId: number) => {
        setIsUpdatingCart(true);
        try {
            await updateCartitemsApi(`${cartItemId}/increase/`);
            if (refetchCart) refetchCart();
            showToast("Product quantity increased successfully.", "success");
        } catch (err: any) {
            safeErrorLog("Error increasing quantity", err);
            showToast(handleApiError(err), "error");
        } finally {
            setIsUpdatingCart(false);
        }
    };

    const handleDecreaseQty = async (cartItemId: number, currentQty: number) => {
        setIsUpdatingCart(true);
        try {
            if (currentQty <= 1) {
                await deleteCartitemsApi(`${cartItemId}`);
                if (refetchCart) refetchCart();
                showToast("Item successfully removed from your cart.", "success");
            } else {
                await updateCartitemsApi(`${cartItemId}/decrease/`);
                if (refetchCart) refetchCart();
                showToast("Product quantity decreased successfully.", "success");
            }
        } catch (err: any) {
            safeErrorLog("Error updating quantity", err);
            showToast(handleApiError(err), "error");
        } finally {
            setIsUpdatingCart(false);
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
        // oldPrice: productData.discount ? `₹${productData.discount}` : `₹${productData.price}`,
        // newPrice: `₹${productData.price}`,
        oldPrice:
            finalOldPrice &&
                Number(finalOldPrice) > Number(finalPrice)
                ? `₹${finalOldPrice}`
                : "",

        newPrice: `₹${finalPrice}`,
        reviews: productData.reviews || 0,
        description: productData.description || "No description available.",
        categoryName: productData.category_name || productData.category?.name || "",
        onSale: productData.discount ? parseFloat(productData.discount) > parseFloat(productData.price) : false,
    };

    const images = productData.image_urls?.map((url: string) => url.replace("http://ip/", "http://82.29.161.36/")) || [mainImage];
    // const sizes = Array.from(new Set(
    //     productData.variants?.flatMap((v: any) => v.sizes?.map((s: any) => s.product_size) || [])
    //         .filter(Boolean) || []
    // ));

    return (
        <main className="max-w-[1440px] mx-auto px-6 sm:px-12 pt-14 pb-12 text-[#000000]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:mb-10 overflow-visible">

                {/* Left Column - Gallery */}
                <div className="space-y-6">
                    <div className="relative flex gap-6">

                        {/* Main Image */}
                        <div
                            className="relative w-full overflow-hidden rounded-[2rem] shadow-xl"
                            onMouseEnter={() => setIsZoomVisible(true)}
                            onMouseLeave={() => setIsZoomVisible(false)}
                            onMouseMove={(e) => {
                                const { left, top, width, height } =
                                    e.currentTarget.getBoundingClientRect();

                                const x = ((e.clientX - left) / width) * 100;
                                const y = ((e.clientY - top) / height) * 100;

                                setZoomBackgroundPosition(`${x}% ${y}%`);
                            }}
                        >
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-auto object-cover rounded-[2rem]"
                            />
                        </div>

                        {/* Zoom Preview */}
                        {isZoomVisible && (
                            <div
                                className="hidden lg:block absolute left-[105%] top-0 w-[480px] h-full rounded-[2rem] border border-gray-200 shadow-2xl bg-no-repeat z-[9999]"
                                style={{
                                    backgroundImage: `url("${mainImage}")`,
                                    backgroundPosition: zoomBackgroundPosition,
                                    backgroundSize: "250%",
                                    backgroundRepeat: "no-repeat",
                                    backgroundColor: "#fff",
                                }}
                            />
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
                                    onError={(e: any) => e.target.src = "/placeholder-image.jpg"}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Lifestyle/Video Placeholder */}
                    {/* <div className="relative aspect-video rounded-[2rem] overflow-hidden mt-8 group cursor-pointer">
                        {mainImage && (
                            <Image
                                src={mainImage}
                                alt="Lifestyle View"
                                fill
                                className="object-cover brightness-75 group-hover:brightness-90 transition-all"
                                onError={(e: any) => e.target.src = "/placeholder-image.jpg"}
                            />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-[#000000] border-b-[10px] border-b-transparent ml-1"></div>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Right Column - Product Info */}
                <div className="flex flex-col pt-4">
                    {product.categoryName && (
                        <span className="text-sm tracking-[0.2em] opacity-60 uppercase font-medium mb-2">{product.categoryName}</span>
                    )}
                    <h1 className="text-4xl sm:text-5xl  font-bold mb-6  tracking-wide">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold ">{product.newPrice}</span>
                        <span className="text-xl opacity-40 line-through">{product.oldPrice}</span>
                    </div>

                    {/* Variant Selection */}
                    {productData.variants?.length > 0 && (
                        <div className="mb-10">

                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                                    Select Variant
                                </h3>

                                {selectedVariant && (
                                    <span className="text-sm font-medium text-black">
                                        {selectedVariant.product_variant_title}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                                {productData.variants.map((variant: any) => {

                                    const variantImage =
                                        variant?.product_variant_image_urls?.[0] ||
                                        "/placeholder-image.jpg";

                                    const isSelected =
                                        selectedVariant?.id === variant.id;

                                    return (

                                        <button
                                            key={variant.id}
                                            onClick={() => {

                                                setSelectedVariant(variant);

                                                // RESET SIZE
                                                if (variant?.sizes?.length > 0) {
                                                    setSelectedSize(variant.sizes[0]);
                                                } else {
                                                    setSelectedSize(null);
                                                }
                                            }}

                                            className={`
                            group relative overflow-hidden rounded-[1.5rem]
                            border transition-all duration-300
                            ${isSelected
                                                    ? "border-black shadow-2xl scale-[1.02]"
                                                    : "border-gray-200 hover:border-black hover:shadow-lg"
                                                }
                        `}
                                        >

                                            {/* Image */}
                                            <div className="relative aspect-square overflow-hidden bg-gray-100">

                                                <Image
                                                    src={variantImage}
                                                    fill
                                                    alt={variant.product_variant_title}
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />

                                                {/* Overlay */}
                                                <div
                                                    className={`
                                    absolute inset-0 transition-all
                                    ${isSelected
                                                            ? "bg-black/10"
                                                            : "bg-black/0 group-hover:bg-black/5"
                                                        }
                                `}
                                                />

                                                {/* Selected Badge */}
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 bg-black text-white text-[10px] px-2 py-1 rounded-full tracking-wide">
                                                        Selected
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 text-left">

                                                <h4 className="text-sm font-semibold text-black line-clamp-1">
                                                    {variant.product_variant_title ||
                                                        variant.variant_name ||
                                                        `Variant ${variant.id}`}
                                                </h4>

                                                <div className="mt-2 flex items-center gap-2">

                                                    <span className="text-base font-bold text-black">
                                                        ₹
                                                        {variant.product_variant_price ||
                                                            productData.price}
                                                    </span>

                                                    {variant.product_variant_discount &&
                                                        Number(
                                                            variant.product_variant_discount
                                                        ) >
                                                        Number(
                                                            variant.product_variant_price
                                                        ) && (
                                                            <span className="text-xs text-gray-400 line-through">
                                                                ₹
                                                                {variant.product_variant_discount}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    {selectedVariant?.sizes?.length > 0 && (

                        <div className="mb-8">

                            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
                                Sizes
                            </h3>

                            <div className="flex gap-3 flex-wrap">

                                {selectedVariant.sizes.map(
                                    (size: any, index: number) => (

                                        <button
                                            key={`${size.product_size}-${index}`}

                                            onClick={() => setSelectedSize(size)}

                                            className={`w-14 h-14 rounded-full border text-sm font-medium transition-all
                        ${selectedSize?.product_size === size.product_size
                                                    ? "bg-[#000000] text-white border-[#000000]"
                                                    : "border-gray-200 hover:border-[#000000]"
                                                }`}
                                        >
                                            {size.product_size}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}


                    {/* Size Selection */}
                    {/* <div className="mb-8">
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
                    </div> */}

                    {/* Dynamic Add to Cart / Quantity Control */}
                    <div className="space-y-4 mb-12">
                        {(() => {
                            const cartItems = cartItem?.data && Array.isArray(cartItem.data)
                                ? cartItem.data
                                : (Array.isArray(cartItem) ? cartItem : []);
                            const selectedVariant = productData.variants?.find((v: any) =>
                                v.sizes?.some((s: any) => s.product_size === selectedSize)
                            );

                            const cartEntry = cartItems.find((ci: any) => {
                                const ciProductId = ci.product?.id || ci.product;
                                const ciVariantId = ci.product_variant?.id || ci.product_variant;

                                const isProductMatch = Number(ciProductId) === Number(productData.id);
                                // Lenient match: match if variant matches OR if variant is missing in cart
                                const isVariantMatch = !selectedVariant ||
                                    String(ciVariantId) === String(selectedVariant?.id) ||
                                    !ciVariantId;
                                return isProductMatch && isVariantMatch;
                            });

                            const isUserLoggedIn = !!user || (typeof window !== 'undefined' && !!localStorage.getItem("userId"));

                            if (cartEntry && isUserLoggedIn) {
                                return (
                                    <div className="flex items-center gap-3 w-full sm:w-[90%]">
                                        <div className="flex-1 flex items-center justify-between border-2 border-[#000000] bg-[#000000] text-white rounded-full px-6 py-4">
                                            <button
                                                onClick={() => handleDecreaseQty(cartEntry.id, cartEntry.quantity)}
                                                disabled={isUpdatingCart}
                                                className="hover:opacity-60 transition-opacity disabled:opacity-30 p-1 -ml-1"
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                            <span className="text-lg font-bold italic">
                                                {isUpdatingCart ? "..." : cartEntry.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleIncreaseQty(cartEntry.id)}
                                                disabled={isUpdatingCart}
                                                className="hover:opacity-60 transition-opacity disabled:opacity-30 p-1 -mr-1"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                setIsUpdatingCart(true);
                                                try {
                                                    await deleteCartitemsApi(`${cartEntry.id}`);
                                                    if (refetchCart) refetchCart();
                                                    showToast("Item successfully removed from your cart.", "success");
                                                } catch (err: any) {
                                                    safeErrorLog("Error removing item", err);
                                                    showToast(handleApiError(err), "error");
                                                } finally {
                                                    setIsUpdatingCart(false);
                                                }
                                            }}
                                            disabled={isUpdatingCart}
                                            className="w-[60px] h-[60px] shrink-0 flex items-center justify-center border-2 border-[#000000] rounded-full text-[#000000] hover:bg-[#000000] hover:text-white transition-all disabled:opacity-50"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className={`w-full sm:w-[90%] border-2 border-[#000000] py-4 rounded-full text-lg font-bold italic transition-all ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#000000] hover:text-white'
                                        }`}
                                >
                                    {isAddingToCart ? "Adding to cart..." : "Add to cart"}
                                </button>
                            );
                        })()}
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
            <div className="py-4 md:py-7 lg:py-10">
                <h2 className="text-3xl font-serif mb-10 italic">You may also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {allProducts && allProducts.length > 0 && allProducts.slice(0, 8).map((p: any) => (
                        <ProductCard
                            key={p.id}
                            product={{
                                id: p.id,
                                name: p.name || p.product_name,
                                oldPrice: `₹${p.discount || p.price}`,
                                newPrice: `₹${p.price}`,
                                rating: p.ratings || 0,
                                reviews: 0,
                                image: (p.image_urls && p.image_urls[0]) || p.product_image || "/placeholder-image.jpg",
                                onSale: p.discount ? parseFloat(p.discount) > parseFloat(p.price) : false,
                                categoryName: p.category_name || "",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Section: Customer Reviews */}
            {/*
            <div className="border-t border-gray-100 pt-24">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-serif mb-12 italic text-center">Customer Reviews</h2>

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
            */}
        </main>
    );
}
