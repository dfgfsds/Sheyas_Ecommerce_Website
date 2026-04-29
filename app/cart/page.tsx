"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useCartItem } from '@/context/CartItemContext';
import { useProducts } from '@/context/ProductsContext';
import { useAuthRedirect } from '@/context/useAuthRedirect';
import { useUser } from '@/context/UserContext';
import { 
    getAddressApi, 
    getVendorDeliveryDetailsApi, 
    patchUserSelectAddressAPi,
    postPaymentApi, 
    postCODPaymentApi, 
    getDeliveryDetailsApi 
} from '@/api-endpoints/CartsApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  ChevronLeft,
  MapPin,
  CreditCard,
  Banknote,
  Circle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/context/VendorContext';
import Script from 'next/script';

export default function CartPage() {
  useAuthRedirect({ requireAuth: true, redirectTo: '/login' });

  const { cartItems, isLoading, isUpdating, updateQuantity, removeFromCart, refetchCart, clearCart } = useCartItem();
  const { products } = useProducts();
  const { user } = useUser();
  const { vendorId } = useVendor();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('prepaid');
  const [hasAddress, setHasAddress] = useState(false);
  const [primaryAddress, setPrimaryAddress] = useState<any>(null);
  const [addressLoading, setAddressLoading] = useState(true);

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [siteDetails, setSiteDetails] = useState<any>('');

  // Fetch primary address
  useEffect(() => {
    if (!user?.id && !user?.user_id) return;
    const actualUserId = user?.id || user?.user_id;
    setAddressLoading(true);
    getAddressApi(`user/${actualUserId}/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const primary = data.find((a: any) => a.is_primary) || data[0] || null;
        if (primary) {
          const parts = (primary.address_line1 || '').split(',').map((p: string) => p.trim());
          setPrimaryAddress({
            ...primary,
            name: primary.customer_name || primary.full_name || primary.name || '',
            mobile: primary.contact_number || primary.mobile || '',
            pincode: primary.postal_code || '',
            house_no: parts[0] || '',
            area: parts.slice(1).join(', ') || '',
          });
          setHasAddress(true);
        }
      })
      .catch(() => { })
      .finally(() => setAddressLoading(false));
  }, [user]);

  const fetchSite = async () => {
    try {
      const response: any = await getVendorDeliveryDetailsApi(vendorId || "159");
      setSiteDetails(response?.data);
    } catch (err) {
      console.error('Fetch Site Details Error:', err);
    }
  };

  const RAZOR_PAY_KEY = Array.isArray(siteDetails)
    ? siteDetails[0]?.payment_gateway_client_id
    : siteDetails?.payment_gateway_client_id || 'rzp_live_RKNXWxLvWCeZr6';

  // Fetch delivery charges
  useEffect(() => {
    fetchSite();
  }, [vendorId]);

  const handlePlaceOrder = async () => {
    if (!user?.id && !user?.user_id || !primaryAddress) {
        setErrorMsg("Please add or select a delivery address.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        return;
    }

    setIsPlacingOrder(true);
    setErrorMsg("");

    try {
      const actualUserId = user?.id || user?.data?.id || user?.user_id;

      // Programmatically set the selected address on the backend
      if (primaryAddress?.id && actualUserId) {
        try {
          await patchUserSelectAddressAPi(`user/${actualUserId}/address/${primaryAddress.id}`, {
            updated_by: user?.name || user?.data?.name || "Guest",
            vendor_id: vendorId || 159
          });
          console.log(`Successfully synced address ${primaryAddress.id} for user ${actualUserId}`);
        } catch (err) {
          console.error("Select address fallback error: ", err);
          setErrorMsg("Failed to sync your address. Please add or select an address again.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 4000);
          setIsPlacingOrder(false);
          return;
        }
      }

      const payload = {
        user_id: parseInt(actualUserId),
        vendor_id: vendorId || 159,
        customer_phone: user?.contact_number || user?.mobile || user?.data?.contact_number || primaryAddress?.mobile || "0000000000",
      };

      if (paymentMethod === "cod") {
        await postCODPaymentApi('', payload);
        await clearCart();
        refetchCart();
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push("/profile/orders");
        }, 5000);
      } else {
        const response = await postPaymentApi('', payload);
        const { payment_order_id, final_price } = response.data;

        const options = {
          key: RAZOR_PAY_KEY,
          amount: final_price * 100,
          currency: "INR",
          name: "Eid Collection",
          description: "Abaya Order",
          order_id: payment_order_id,
          handler: async function (response: any) {
            await clearCart();
            refetchCart();
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false);
              router.push("/profile/orders");
            }, 5000);
          },
          prefill: {
            name: user?.name || user?.data?.name || "Customer",
            email: user?.email || user?.data?.email || "",
            contact: user?.contact_number || user?.data?.contact_number || user?.mobile || primaryAddress?.mobile || "",
          },
          notes: {
            address: "Selected Address",
          },
          theme: {
            color: "#000000",
          },
        };

        const razor = new (window as any).Razorpay(options);
        razor.open();
      }
    } catch (error) {
      console.error("Order Failure:", error);
      setErrorMsg("Payment sync error detected. Please check connection.");
      setShowFailureModal(true);
      setTimeout(() => setShowFailureModal(false), 5000);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Merge cart items with product details
  const cartWithDetails = useMemo(() => {
    if (!cartItems || !products) return [];
    return cartItems.map((item: any) => {
      const productDetail = products.find((p: any) => p.id === item.product);
      return {
        ...item,
        detail: productDetail || {
          name: "Unknown Abaya",
          price: item.price || 0,
          image_urls: ["/abaya_1.png"],
          brand_name: "EID"
        }
      };
    });
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    return cartWithDetails.reduce((acc: number, item: any) => {
      const price = parseFloat(item.detail.price) || 0;
      return acc + (price * item.quantity);
    }, 0);
  }, [cartWithDetails]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading && cartWithDetails.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest animate-pulse">Syncing Collection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-24 pb-20 px-6 overflow-x-hidden relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Global Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-red-50 border border-red-200 px-6 py-3 rounded-full flex items-center gap-3 shadow-xl"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 font-bold tracking-widest text-xs uppercase">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-black">Your Shopping Cart</h1>
          </div>
          <Link href="/eid-collection" className="flex items-center gap-2 text-black font-bold text-sm hover:translate-x-[-4px] transition-transform w-fit border-b border-black pb-0.5">
            <ChevronLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {cartWithDetails.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-gray-50 border border-gray-100 rounded-[40px]"
          >
            <div className="p-8 bg-white rounded-full border border-gray-100 shadow-sm">
              <ShoppingBag className="w-16 h-16 text-gray-300" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif italic tracking-tight">Your Cart is Empty</h2>
              <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium">Find something special from our latest Eid Collection.</p>
            </div>
            <Link href="/eid-collection" className="px-10 py-4 bg-black text-white font-black uppercase text-xs tracking-widest rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95">
              Browse Collection
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* ITEMS LIST */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {cartWithDetails.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group p-6 bg-gray-50 border border-gray-100 rounded-3xl flex gap-6 items-center flex-wrap sm:flex-nowrap hover:border-black/10 transition-colors relative"
                  >
                    {isUpdating && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-3xl flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-black animate-spin" />
                      </div>
                    )}

                    <div className="relative w-28 h-36 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                      <Image
                        src={item.detail.image_urls?.[0] || "/abaya_1.png"}
                        alt={item.detail.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">{item.detail.brand_name || "EID"}</span>
                      <h3 className="font-serif italic text-xl truncate tracking-tight text-black mb-2">{item.detail.name}</h3>
                      <p className="text-lg font-bold text-black">{formatPrice(parseFloat(item.detail.price))}</p>
                      {item.size_name && <p className="text-xs font-semibold text-gray-500 mt-1">Size: {item.size_name}</p>}
                    </div>

                    <div className="flex items-center gap-5 bg-white rounded-full p-2 px-4 border border-gray-100 flex-shrink-0 self-end sm:self-auto ml-auto shadow-sm">
                      <button
                        disabled={isUpdating || Number(item.quantity) <= 1}
                        onClick={() => updateQuantity(item, Number(item.quantity) - 1)}
                        className="p-2 hover:text-black text-gray-500 transition-colors disabled:opacity-30"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="font-black w-10 text-center text-black text-xl">{item.quantity}</span>
                      <button
                        disabled={isUpdating}
                        onClick={() => updateQuantity(item, Number(item.quantity) + 1)}
                        className="p-2 hover:text-black text-gray-500 transition-colors disabled:opacity-30"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      disabled={isUpdating}
                      onClick={() => removeFromCart(item.id)}
                      className="p-4 bg-red-50 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-2xl transition-all flex-shrink-0 group/trash disabled:opacity-30"
                    >
                      <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SUMMARY */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 sticky top-24"
              >
                {/* SHIPPING ADDRESS */}
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black tracking-widest text-gray-400 uppercase">Shipping Address</h3>
                  </div>
                  {addressLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 text-black animate-spin" />
                    </div>
                  ) : primaryAddress ? (
                    <div className="border border-black/10 bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-black font-bold text-sm">{primaryAddress.name}</p>
                        <p className="text-gray-500 text-xs leading-relaxed mt-1">
                          {primaryAddress.house_no}{primaryAddress.area && `, ${primaryAddress.area}`}<br />
                          {primaryAddress.city}, {primaryAddress.state} - {primaryAddress.pincode}
                        </p>
                        <p className="text-gray-400 text-xs font-bold mt-1">{primaryAddress.mobile}</p>
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-black uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> Delivering Here
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-white">
                      <MapPin className="w-6 h-6 text-gray-300" />
                      <span className="text-xs text-gray-400 font-bold tracking-widest uppercase">No Address Found</span>
                      <Link href="/profile/address" className="mt-2 bg-black text-white font-black uppercase text-[10px] tracking-widest px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-transform">
                        Add Address
                      </Link>
                    </div>
                  )}
                </div>

                {/* PRICE DETAILS */}
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
                  <h3 className="text-sm font-black tracking-widest text-gray-400 uppercase mb-6">Order Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold tracking-tight text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold tracking-tight text-gray-600">
                      <span>Shipping</span>
                      <span>{deliveryCharge === 0 ? "Calculated at checkout" : formatPrice(deliveryCharge)}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-xl font-black text-black mt-4">
                      <span>Total</span>
                      <span>{formatPrice(subtotal + deliveryCharge)}</span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHOD */}
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
                  <h3 className="text-sm font-black tracking-widest text-gray-400 uppercase mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod('prepaid')}
                      className={`w-full flex items-center gap-3 border rounded-2xl p-4 transition-all ${paymentMethod === 'prepaid' ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-white/50 hover:bg-white text-gray-400'}`}
                    >
                      {paymentMethod === 'prepaid' ? <CheckCircle2 className="w-5 h-5 text-black" /> : <Circle className="w-5 h-5" />}
                      <CreditCard className={`w-5 h-5 ${paymentMethod === 'prepaid' ? 'text-black' : ''}`} />
                      <span className={`text-sm font-bold tracking-tight ${paymentMethod === 'prepaid' ? 'text-black' : ''}`}>
                        Prepaid (UPI / Cards)
                      </span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full flex items-center gap-3 border rounded-2xl p-4 transition-all ${paymentMethod === 'cod' ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-white/50 hover:bg-white text-gray-400'}`}
                    >
                      {paymentMethod === 'cod' ? <CheckCircle2 className="w-5 h-5 text-black" /> : <Circle className="w-5 h-5" />}
                      <Banknote className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-black' : ''}`} />
                      <span className={`text-sm font-bold tracking-tight ${paymentMethod === 'cod' ? 'text-black' : ''}`}>
                        Cash on Delivery
                      </span>
                    </button>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="space-y-4 pt-2">
                  <button
                    disabled={!hasAddress || isPlacingOrder}
                    onClick={handlePlaceOrder}
                    className="w-full py-5 bg-black text-white font-black text-sm tracking-[0.2em] uppercase rounded-full shadow-2xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isPlacingOrder ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Processing...
                      </div>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                  {!hasAddress && (
                    <p className="text-[10px] text-red-500 font-black tracking-widest text-center uppercase">
                      Please add an address to proceed
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white p-8 md:p-12 rounded-[40px] shadow-2xl text-center max-w-lg w-full overflow-hidden"
            >
              <div className="mb-6 inline-flex p-5 bg-green-50 rounded-full border border-green-100">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-serif italic text-black mb-4">Order Successful!</h2>
              <p className="text-gray-500 font-medium text-sm mb-8 leading-relaxed">
                Your order has been placed successfully. <br /> Check your orders for the shipment status.
              </p>
              <div className="flex items-center justify-center gap-2 text-black text-xs font-black tracking-[0.2em] uppercase">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting To Orders...
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Failure Modal */}
      <AnimatePresence>
        {showFailureModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white border border-red-100 p-8 md:p-12 rounded-[40px] shadow-2xl text-center max-w-lg w-full"
            >
              <div className="mb-6 inline-flex p-5 bg-red-50 rounded-full">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <h2 className="text-3xl font-serif italic text-red-500 mb-4">Order Failed</h2>
              <p className="text-gray-500 font-medium text-sm mb-8 leading-relaxed">
                {errorMsg || "Something went wrong while processing your order."}
              </p>
              <button 
                onClick={() => setShowFailureModal(false)}
                className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
