"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, MapPin, PlusCircle, Loader2, Tag, X, CheckCircle, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartItem } from "@/context/CartItemContext";
import { useUser } from "@/context/UserContext";
import { useProducts } from "@/context/ProductsContext";
import { useVendor } from "@/context/VendorContext";
import { useToast } from "@/context/ToastContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    updateCartitemsApi,
    deleteCartitemsApi,
    getAddressApi,
    getCartItemsProductSizesWithVariantsApi,
    updateSelectedAddressApi,
    getDeliveryChargeApi,
    postApplyCouponApi,
    getAppliedCouponDataApi,
    deleteCouponApi,
    postPaymentApi,
    postCODPaymentApi
} from "@/api-endpoints/CartsApi";
import { handleApiError } from "@/utils/error-utils";
import { safeErrorLog } from "@/utils/error-handler";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "@/context/useAuthRedirect";

export default function CartPage() {
    // Redirect logic handled manually in the render below to show custom UI
    // useAuthRedirect({ requireAuth: true });

    const { refetchCart } = useCartItem();
    const { user, isLoading: isUserLoading } = useUser();
    const { vendorId } = useVendor();
    const { showToast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Synchronous check to prevent flashing/redirection during hydration
    const hasToken = typeof window !== 'undefined' ? !!localStorage.getItem('userId') : false;

    const cartId = typeof window !== 'undefined' ? localStorage.getItem('cartId') : null;
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"Prepaid" | "COD">("Prepaid");
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Fetch Detailed Cart Items (Refined API)
    const userId = user?.data?.id || user?.id;
    const { data: detailedCartResponse, isLoading: isDetailedLoading, refetch: refetchDetailedCart } = useQuery({
        queryKey: ['getCartItemsDetailed', userId, vendorId],
        queryFn: () => getCartItemsProductSizesWithVariantsApi(`?user_id=${userId}&vendor_id=${vendorId}`),
        enabled: !!userId && !!vendorId,
    });

    const cartItemsData = detailedCartResponse?.data?.cart_items || [];

    // Map cart items using the refined structure
    const cartItems = cartItemsData.map((item: any) => {
        const details = item.product_details;
        return {
            ...item,
            display_name: details?.name || details?.product_name || "Product",
            display_price: details?.price ? `₹${parseFloat(details.price).toLocaleString('en-IN')}` : "₹0",
            display_image: details?.image_urls?.[0] || details?.product_image || "/placeholder-image.jpg",
            display_size: details?.product_size || item.product_size || 'N/A',
            numeric_price: parseFloat(details?.price) || 0
        };
    });

    const subtotal = cartItems.reduce((acc: number, item: any) => {
        return acc + (item.numeric_price * item.quantity);
    }, 0);

    // Fetch applied coupons from backend
    const { data: appliedCouponsResponse, refetch: refetchAppliedCoupons } = useQuery({
        queryKey: ['getAppliedCouponData', userId],
        queryFn: () => getAppliedCouponDataApi(`?user_id=${userId}`),
        enabled: !!userId,
    });

    const appliedCoupons = Array.isArray(appliedCouponsResponse?.data?.data) ? appliedCouponsResponse.data.data : (appliedCouponsResponse?.data?.applied_coupons || []);
    const totalDiscount = Array.isArray(appliedCoupons) ? appliedCoupons.reduce((acc: number, c: any) => acc + (parseFloat(c.discount_value || c.amount || 0) || 0), 0) : 0;

    // Fetch Delivery Charges
    const { data: deliveryResponse, isLoading: isDeliveryLoading, refetch: refetchDeliveryCharge } = useQuery({
        queryKey: ['getDeliveryCharge', selectedAddressId, vendorId, subtotal, userId, paymentMethod],
        queryFn: () => getDeliveryChargeApi('', {
            user_id: userId,
            vendor_id: vendorId,
            payment_mode: paymentMethod,
            total_amount: subtotal,
            user_address_id: selectedAddressId,
            customer_phone: user?.data?.contact_number || user?.contact_number || "",
        }),
        enabled: !!selectedAddressId && !!vendorId && subtotal > 0,
    });

    const breakdownData = deliveryResponse?.data?.data || deliveryResponse?.data || {};
    const shippingAmount = parseFloat(
        breakdownData.final_delivery_charge ||
        breakdownData.shipping_amount ||
        0
    );

    const handleApplyCoupon = async () => {
        if (!couponCode) return showToast("Please enter a code.", "error");
        try {
            await postApplyCouponApi("", {
                user_id: userId,
                coupon_code: couponCode.toUpperCase().trim(),
                vendor_id: vendorId,
                updated_by: "user"
            });
            setCouponCode("");
            await refetchAppliedCoupons();
            await refetchDeliveryCharge();
            showToast("Coupon applied successfully!", "success");
        } catch (err) {
            showToast(handleApiError(err), "error");
        }
    };

    const handleRemoveCoupon = async (couponId: number) => {
        try {
            await deleteCouponApi(`${cartId}/coupon/${couponId}/remove/`, {
                user_id: userId,
                vendor_id: vendorId,
                updated_by: "user"
            });
            await refetchAppliedCoupons();
            await refetchDeliveryCharge();
            showToast("Coupon removed.", "success");
        } catch (err) {
            showToast(handleApiError(err), "error");
        }
    };

    const handleSelectAddress = async (addressId: number) => {
        setSelectedAddressId(addressId);
        const currentUserId = user?.data?.id || user?.id;
        try {
            await updateSelectedAddressApi(`user/${currentUserId}/address/${addressId}`, { updated_by: currentUserId });
            showToast("Shipping address updated.", "success");
        } catch (err) {
            safeErrorLog("Error updating address", err);
            showToast("Failed to update shipping address.", "error");
        }
    };

    // Fetch addresses on mount if user is logged in
    useEffect(() => {
        const fetchAddresses = async () => {
            const currentUserId = user?.data?.id || user?.id;
            if (!currentUserId) return;

            setIsLoadingAddresses(true);
            try {
                const res = await getAddressApi(`user/${currentUserId}`);
                const addressData = res.data?.data || res.data || [];
                const addressList = Array.isArray(addressData) ? [...addressData].reverse() : [];
                setAddresses(addressList);

                // Find the address that is marked as selected on the backend
                const backendSelected = addressList.find((addr: any) => addr.selected_address);

                if (backendSelected) {
                    setSelectedAddressId(backendSelected.id);
                }
            } catch (err) {
                safeErrorLog("Error fetching addresses", err);
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        fetchAddresses();
    }, [user]);

    const handleUpdateQuantity = async (cartItemId: number, type: 'increase' | 'decrease', currentQty: number) => {
        if (type === 'decrease' && currentQty <= 1) {
            handleRemoveItem(cartItemId);
            return;
        }

        setIsUpdating(cartItemId);
        try {
            await updateCartitemsApi(`${cartItemId}/${type}/`);
            if (refetchCart) await refetchCart();
            await refetchDetailedCart();
            await refetchDeliveryCharge();
            showToast(`Product quantity ${type === 'increase' ? 'increased' : 'decreased'} successfully.`, "success");
        } catch (err) {
            showToast(handleApiError(err), "error");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        setIsUpdating(cartItemId);
        try {
            await deleteCartitemsApi(`${cartItemId}`);
            if (refetchCart) await refetchCart();
            await refetchDetailedCart();
            await refetchDeliveryCharge();
            showToast("Item successfully removed from your cart.", "success");
        } catch (err) {
            showToast(handleApiError(err), "error");
        } finally {
            setIsUpdating(null);
        }
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            showToast("Your cart is empty.", "error");
            return;
        }
        if (!selectedAddressId) {
            showToast("Please select a delivery address to continue.", "error");
            return;
        }

        setIsProcessing(true);
        try {
            const payload = {
                user_id: userId,
                vendor_id: vendorId,
                customer_phone: user?.data?.contact_number || user?.contact_number || "",
                cart_id: cartId,
                user_address_id: selectedAddressId,
                payment_mode: paymentMethod,
                total_amount: subtotal + shippingAmount - totalDiscount,
                updated_by: user?.data?.name || user?.name || "User"
            };

            if (paymentMethod === "Prepaid") {
                const res = await postPaymentApi("", payload);
                const data = res.data?.data || res.data;

                const options = {
                    key: data.razorpay_key,
                    amount: data.amount,
                    currency: data.currency,
                    name: "SHEYAS",
                    description: "Order Payment",
                    order_id: data.razorpay_order_id,
                    handler: async function (response: any) {
                        const finalOrderId =
                            data.order_response?.order?.id ||
                            data.order_id ||
                            data.id ||
                            data.data?.order_id;

                        setOrderId(finalOrderId);
                        setPaymentSuccess(true);
                        // Invalidate all related queries to clear the cart
                        await queryClient.invalidateQueries({ queryKey: ['getCartItemsDetailed'] });
                        if (refetchCart) await refetchCart();
                    },
                    prefill: {
                        name: user?.data?.name || user?.name,
                        email: user?.data?.email || user?.email,
                        contact: user?.data?.contact_number || user?.contact_number
                    },
                    theme: { color: "#000000" }
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();
            } else {
                const res = await postCODPaymentApi("", payload);
                if (res.status === 200 || res.status === 201) {
                    const data = res.data;
                    const finalOrderId =
                        data.order_response?.order?.id ||
                        data.data?.order_id ||
                        data.order_id ||
                        data.id;

                    setOrderId(finalOrderId);
                    setPaymentSuccess(true);
                    await queryClient.invalidateQueries({ queryKey: ['getCartItemsDetailed'] });
                    if (refetchCart) await refetchCart();
                }
            }
        } catch (err) {
            showToast(handleApiError(err), "error");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isUserLoading && hasToken) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin opacity-20" />
                    <p className="text-sm font-medium italic opacity-40">Loading your cart</p>
                </div>
            </div>
        );
    }

    if (!hasToken || (!user && !isUserLoading)) {
        return (
            <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-14 text-center">
                <div className="max-w-md mx-auto bg-gray-50 rounded-[3rem] p-12 border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                        <User className="w-10 h-10 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-serif italic mb-2">Your cart is waiting</h2>
                    <p className="text-gray-500 mb-6 italic leading-relaxed">
                        Please log in to view your saved items, add new products, and complete your purchase.
                    </p>
                    <Link
                        href="/login?redirect=/cart"
                        className="inline-flex items-center justify-center px-12 py-4 bg-black text-white rounded-full text-sm font-bold hover:opacity-90 transition-all uppercase tracking-widest shadow-lg"
                    >
                        Login to continue
                    </Link>
                </div>
            </main>
        );
    }

    if (isDetailedLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin opacity-20" />
                    <p className="text-sm font-medium italic opacity-40">Please wait! Fetching your cart items</p>
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 text-gray-800">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl sm:text-5xl text-[#000000] font-serif italic tracking-wide">Your cart</h1>
                <Link href="/eid-collection" className="text-lg font-bold border-b border-[#000000] pb-0.5 hover:cursor-pointer text-[#000000]">
                    Continue shopping
                </Link>
            </div>

            {cartItems.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="hidden md:grid grid-cols-[1fr_150px_120px] gap-8 border-b border-gray-200 pb-4 text-[16px] font-bold tracking-wide uppercase">
                            <span>Product</span>
                            <span className="text-center">Quantity</span>
                            <span className="text-right">Total</span>
                        </div>

                        <div className="space-y-10">
                            {cartItems.map((item: any) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_150px_120px] gap-6 md:gap-8 items-center border-b border-gray-100 pb-10 last:border-0">
                                    <div className="flex gap-4 sm:gap-6 items-center">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm bg-gray-50 flex-shrink-0">
                                            <Image
                                                src={item.display_image}
                                                alt={item.display_name || "Product Image"}
                                                fill
                                                className="object-cover object-top"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-base sm:text-lg font-medium leading-tight">{item.display_name}</h3>
                                            <p className="text-xs sm:text-sm opacity-60 italic">{item.display_price}</p>
                                            {item.display_size && item.display_size !== 'N/A' && (
                                                <p className="text-xs sm:text-sm font-semibold">Size: {item.display_size}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-center gap-4">
                                        <div className="flex items-center border-2 border-[#000000] rounded-full px-4 py-2 bg-white">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, 'decrease', item.quantity)}
                                                disabled={isUpdating === item.id}
                                                className="hover:opacity-60 transition-opacity p-1 disabled:opacity-30"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 sm:w-10 text-center text-sm font-bold">
                                                {isUpdating === item.id ? "..." : item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, 'increase', item.quantity)}
                                                disabled={isUpdating === item.id}
                                                className="hover:opacity-60 transition-opacity p-1 disabled:opacity-30"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={isUpdating === item.id}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 disabled:opacity-30"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="text-right text-lg font-bold text-[#000000]">
                                        ₹{(item.numeric_price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-serif italic flex items-center gap-2">
                                    <MapPin className="w-5 h-5" /> Delivery Address
                                </h2>
                                <Link href="/profile" className="text-xs font-bold border-b border-black">
                                    Manage
                                </Link>
                            </div>

                            {isLoadingAddresses ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-6 h-6 animate-spin opacity-20" />
                                </div>
                            ) : addresses.length > 0 ? (
                                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {addresses.map((addr) => (
                                        <label
                                            key={addr.id}
                                            className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAddressId === addr.id
                                                ? "border-[#000000] bg-white shadow-md"
                                                : "border-transparent bg-gray-100 hover:bg-gray-200"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    className="mt-1 accent-black"
                                                    checked={selectedAddressId === addr.id}
                                                    onChange={() => handleSelectAddress(addr.id)}
                                                />
                                                <div className="text-sm">
                                                    <p className="font-bold">{addr.address_type || 'Home'}</p>
                                                    <p className="opacity-70 line-clamp-2">
                                                        {addr.address_line1}, {addr.city}
                                                        {addr.state && `, ${addr.state}`} {addr.pincode && ` - ${addr.pincode}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-2xl space-y-3">
                                    <p className="text-sm opacity-60 italic">No addresses found.</p>
                                    <Link href="/profile?action=addAddress" className="inline-flex items-center gap-2 text-sm font-bold bg-black text-white px-4 py-2 rounded-full">
                                        <PlusCircle className="w-4 h-4" /> Add Address
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Promo Code Section */}
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 space-y-4">
                            <h2 className="text-xl font-serif italic flex items-center gap-2">
                                <Tag className="w-5 h-5" /> Promo Code
                            </h2>
                            <div className="relative flex items-center bg-white rounded-full p-1 border border-gray-200 focus-within:border-black transition-colors shadow-sm">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="w-full bg-transparent px-4 py-2 text-sm focus:outline-none uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                                >
                                    Apply
                                </button>
                            </div>

                            {appliedCoupons.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {appliedCoupons.map((coupon: any) => (
                                        <div key={coupon.id} className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                            <span>{coupon.coupon_code || coupon.code}</span>
                                            <button onClick={() => handleRemoveCoupon(coupon.id)} className="hover:text-red-400 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 space-y-4">
                            <h2 className="text-xl font-serif italic">Payment Method</h2>
                            <div className="flex gap-4">
                                {["Prepaid", "COD"].map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setPaymentMethod(method as any)}
                                        className={`flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${paymentMethod === method
                                            ? "bg-black text-white shadow-lg scale-[1.02]"
                                            : "bg-white text-black border border-gray-200 hover:border-black opacity-60"
                                            }`}
                                    >
                                        {method === "Prepaid" ? "Pay Online" : "Cash on Delivery"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#000000] text-white p-8 rounded-[2rem] shadow-2xl space-y-6">
                            <h2 className="text-2xl font-serif italic mb-4">Summary</h2>
                            <div className="space-y-4 border-b border-white/10 pb-6">
                                <div className="flex justify-between items-center opacity-60">
                                    <span className="italic text-sm">Subtotal</span>
                                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>

                                {totalDiscount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-400">
                                        <span className="italic text-sm">Discount</span>
                                        <span className="font-bold">- ₹{totalDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center opacity-60">
                                    <span className="italic text-sm">Delivery Charge</span>
                                    <span className="font-bold">
                                        {shippingAmount > 0 ? (
                                            `₹${shippingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                                        ) : (
                                            "FREE"
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-serif italic">Total</span>
                                <span className="text-3xl font-bold">₹{(subtotal + shippingAmount - totalDiscount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={cartItems.length === 0 || isProcessing}
                                className="w-full bg-white text-black py-4 rounded-full text-lg font-bold italic tracking-widest hover:bg-gray-100 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
                                {isProcessing ? "Processing..." : (paymentMethod === "Prepaid" ? "Pay and Place Order" : "Place Order")}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center space-y-[22px] bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <div className="space-y-2">
                        <p className="text-2xl font-serif italic text-black">Your cart is currently empty.</p>
                        <p className="text-sm text-gray-500">Find something you love in our collection.</p>
                    </div>
                    <Link href="/eid-collection">
                        <button className="bg-[#000000] text-white px-12 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-all shadow-xl">
                            Explore our Collection
                        </button>
                    </Link>
                </div>
            )}

            {/* Order Success Modal */}
            {paymentSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300 relative">
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setPaymentSuccess(false);
                            }}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex justify-center">
                            <div className="w-24 h-24 mb-3 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                        <div className="space-y-2 mb-7">
                            <h2 className="text-4xl font-serif italic text-black">Thank you!</h2>
                            <p className="text-gray-500 font-medium">Your order has been placed successfully.</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => router.push(`/orders/${orderId}`)}
                                className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all"
                            >
                                Track Your Order
                            </button>
                            <button
                                onClick={() => {
                                    setPaymentSuccess(false);
                                    router.push('/');
                                }}
                                className="w-full bg-transparent text-gray-400 py-2 rounded-full font-bold uppercase tracking-widest hover:text-black transition-all text-xs"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
