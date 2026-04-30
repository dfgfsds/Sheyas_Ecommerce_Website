"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCartitemsApi, deleteCartitemsApi, postCartitemApi, updateCartitemsApi } from "../api-endpoints/CartsApi";
import { useUser } from "./UserContext";
import { useVendor } from "./VendorContext";

// Context
const CartItemContext = createContext<any | undefined>(undefined);

// Provider
export function CartItemProvider({ children }: { children: ReactNode }) {
    const [cartId, setCartId] = useState<string | null>(null);
    const { user } = useUser();
    const { vendorId } = useVendor();

    useEffect(() => {
        const storedCartId = localStorage.getItem('cartId');
        setCartId(storedCartId);
    }, []);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["getCartitemsData", cartId],
        queryFn: () => getCartitemsApi(`/${cartId}`),
        enabled: !!cartId,
    });

    // Mutations for cart actions
    const updateQuantityMutation = useMutation({
        mutationFn: ({ item, quantity }: { item: any, quantity: number }) => {
            const userId = user?.data?.id || user?.id;
            const payload = {
                cart: Number(cartId),
                user: Number(userId),
                vendor: Number(vendorId || 159),
                created_by: Number(userId),
                product: Number(item.product),
                quantity: Number(quantity),
                variant: item.variant ? Number(item.variant) : null
            };
            return postCartitemApi("", payload);
        },
        onSuccess: () => refetch(),
    });

    const removeItemMutation = useMutation({
        mutationFn: (itemId: any) => deleteCartitemsApi(`${itemId}/`),
        onSuccess: () => refetch(),
    });

    const updateQuantity = (item: any, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateQuantityMutation.mutate({ item, quantity: newQuantity });
    };

    const removeFromCart = (itemId: any) => {
        removeItemMutation.mutate(itemId);
    };

    const clearCart = async () => {
        localStorage.removeItem('cartId');
        setCartId(null);
        refetch();
    };

    return (
        <CartItemContext.Provider
            value={{
                cartItems: data?.data || data || [],
                isLoading,
                isUpdating: updateQuantityMutation.isPending || removeItemMutation.isPending,
                updateQuantity,
                removeFromCart,
                refetchCart: refetch,
                clearCart,
            }}
        >
            {children}
        </CartItemContext.Provider>
    );
}

// Hook
export function useCartItem() {
    const context = useContext(CartItemContext);
    if (!context) {
        throw new Error("useCartItem must be used within a CartItemProvider");
    }
    return context;
}
