"use client";

import React, { useEffect, useMemo, useState } from "react";
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
    const [productData, setProductData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    console.log(productData)
    const productId = useMemo(() => {
        return allProducts?.find(
            (p: any) =>
                p?.slug_name
                    ?.toLowerCase()
                    ?.replace(/[\s\-_]+/g, "")
                    ?.replace(/[^a-z0-9]/g, "")
                ===
                String(id)
                    ?.toLowerCase()
                    ?.replace(/[\s\-_]+/g, "")
                    ?.replace(/[^a-z0-9]/g, "")
        );
    }, [allProducts, id]);

    const productIdValue = productId?.id;

    const getProductApi = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res =
                await getProductWithVariantSizeApi(
                    `${productIdValue}`
                );
            if (res?.data) {
                setProductData(res.data);
                setIsLoading(false);
                setError(null);
            } else {
                setError("Product not found");
            }
        } catch (err) {
            console.log(err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (productIdValue) {
            getProductApi();
        }
    }, [productIdValue]);

    const { vendorId } = useVendor();
    const { user } = useUser();
    const { cartItem, refetchCart, refreshCartId } = useCartItem();
    const { showToast } = useToast();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isUpdatingCart, setIsUpdatingCart] = useState(false);

    const [selectedSize, setSelectedSize] = useState<any>("");
    // const [mainImage, setMainImage] = useState("");
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [zoomBackgroundPosition, setZoomBackgroundPosition] = useState("50% 50%");
    console.log(selectedSize)

    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState("");
    const defaultImage =
        selectedVariant?.product_variant_image_urls?.[0]

            ? selectedVariant.product_variant_image_urls[0]

            : (
                productData?.image_urls?.[0] ||
                productData?.product_image ||
                "/placeholder-image.jpg"
            );

    // const mainImage = previewImage || defaultImage;
    const mainImage =
        previewImage ||
        defaultImage;

    const formattedMainImage = mainImage.replace(
        "http://ip/",
        "http://82.29.161.36/"
    );

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
            // setMainImage(firstImage.replace("http://ip/", "http://82.29.161.36/"));

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
        id: productData?.id,
        name: productData?.name || productData?.product_name || "Unnamed Product",
        // oldPrice: productData.discount ? `₹${productData.discount}` : `₹${productData.price}`,
        // newPrice: `₹${productData.price}`,
        oldPrice:
            finalOldPrice &&
                Number(finalOldPrice) > Number(finalPrice)
                ? `₹${finalOldPrice}`
                : "",

        newPrice: `₹${finalPrice}`,
        reviews: productData?.reviews || 0,
        description: productData?.description || "No description available.",
        categoryName: productData?.category_name || productData?.category?.name || "",
        onSale: productData?.discount ? parseFloat(productData?.discount) > parseFloat(productData?.price) : false,
    };

    // const images = productData.image_urls?.map((url: string) => url.replace("http://ip/", "http://82.29.161.36/")) || [mainImage];
    // // const sizes = Array.from(new Set(
    // //     productData.variants?.flatMap((v: any) => v.sizes?.map((s: any) => s.product_size) || [])
    // //         .filter(Boolean) || []
    // // ));

    const images =
        selectedVariant?.product_variant_image_urls?.length > 0

            ? selectedVariant.product_variant_image_urls.map(
                (url: string) =>
                    url.replace(
                        "http://ip/",
                        "http://82.29.161.36/"
                    )
            )

            : (
                productData?.image_urls || [
                    productData?.product_image ||
                    "/placeholder-image.jpg"
                ]
            ).map((url: string) =>
                url.replace(
                    "http://ip/",
                    "http://82.29.161.36/"
                )
            );

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
                                src={formattedMainImage}
                                alt={product?.name}
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
                        {images?.slice(0, 3).map((img: string, i: number) => (
                            <div
                                key={i}
                                // onClick={() => setMainImage(img)}
                                onClick={() => setPreviewImage(img)}
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

                </div>

                {/* Right Column - Product Info */}
                <div className="flex flex-col pt-4">
                    {product.categoryName && (
                        <span className="text-sm tracking-[0.2em] opacity-60 uppercase font-medium mb-2">{product?.categoryName}</span>
                    )}
                    <h1 className="text-4xl sm:text-5xl  font-bold mb-6  tracking-wide">{product?.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold ">{product?.newPrice}</span>
                        <span className="text-xl opacity-40 line-through">{product?.oldPrice}</span>
                    </div>

                    {/* Variant Selection */}
                    {productData?.variants?.length > 0 && (
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

                                {productData?.variants?.map((variant: any) => {

                                    const variantImage =
                                        variant?.product_variant_image_urls?.[0] ||
                                        "/placeholder-image.jpg";

                                    const isSelected =
                                        selectedVariant?.id === variant.id;

                                    return (

                                        <button
                                            key={variant?.id}
                                            onClick={() => {

                                                setSelectedVariant(variant);

                                                setPreviewImage(
                                                    variant?.product_variant_image_urls?.[0] || ""
                                                );

                                                // RESET SIZE
                                                if (variant?.sizes?.length > 0) {
                                                    setSelectedSize(variant?.sizes[0]);
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
                                                    alt={variant?.product_variant_title}
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
                                                    {variant?.product_variant_title ||
                                                        variant?.variant_name ||
                                                        `Variant ${variant?.id}`}
                                                </h4>

                                                <div className="mt-2 flex items-center gap-2">

                                                    <span className="text-base font-bold text-black">
                                                        ₹
                                                        {variant?.product_variant_price ||
                                                            productData?.price}
                                                    </span>

                                                    {variant?.product_variant_discount &&
                                                        Number(
                                                            variant?.product_variant_discount
                                                        ) >
                                                        Number(
                                                            variant?.product_variant_price
                                                        ) && (
                                                            <span className="text-xs text-gray-400 line-through">
                                                                ₹
                                                                {variant?.product_variant_discount}
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

                                {selectedVariant?.sizes.map(
                                    (size: any, index: number) => (

                                        <button
                                            key={`${size?.product_size}-${index}`}

                                            onClick={() => setSelectedSize(size)}

                                            className={`w-14 h-14 rounded-full border text-sm font-medium transition-all
                        ${selectedSize?.product_size === size?.product_size
                                                    ? "bg-[#000000] text-white border-[#000000]"
                                                    : "border-gray-200 hover:border-[#000000]"
                                                }`}
                                        >
                                            {size?.product_size}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}


                    {/* Dynamic Add to Cart / Quantity Control */}
                    <div className="space-y-4 mb-12">
                        {(() => {
                            const cartItems = cartItem?.data && Array.isArray(cartItem?.data)
                                ? cartItem?.data
                                : (Array.isArray(cartItem) ? cartItem : []);
                            const selectedVariant = productData?.variants?.find((v: any) =>
                                v?.sizes?.some((s: any) => s?.product_size === selectedSize)
                            );

                            const cartEntry = cartItems?.find((ci: any) => {
                                const ciProductId = ci?.product?.id || ci?.product;
                                const ciVariantId = ci?.product_variant?.id || ci?.product_variant;

                                const isProductMatch = Number(ciProductId) === Number(productData?.id);
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

                    <div className="prose prose-stone max-w-none italic text-[#000000]/80 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
            </div>

            {/* Bottom Section: You May Also Like */}
            <div className="py-4 md:py-7 lg:py-10">
                <h2 className="text-3xl font-serif mb-10 italic">You may also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {allProducts && allProducts?.length > 0 && allProducts?.filter((item: any) => item?.category === productData?.category)?.slice(0, 8).map((p: any) => (
                        <ProductCard
                            key={p?.id}
                            product={{
                                id: p?.id,
                                name: p?.name || p?.product_name,
                                oldPrice: `₹${p?.discount || p?.price}`,
                                newPrice: `₹${p?.price}`,
                                rating: p?.ratings || 0,
                                reviews: 0,
                                image: (p?.image_urls && p?.image_urls[0]) || p?.product_image || "/placeholder-image.jpg",
                                onSale: p?.discount ? parseFloat(p?.discount) > parseFloat(p?.price) : false,
                                categoryName: p?.category_name || "",
                                slug_name: p?.slug_name
                                    ?.toLowerCase()
                                    ?.replace(/[\s\-_]+/g, "")
                                    ?.replace(/[^a-z0-9]/g, "")
                            }}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
