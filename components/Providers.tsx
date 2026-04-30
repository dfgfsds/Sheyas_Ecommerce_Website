"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VendorProvider } from "@/context/VendorContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { UserProvider } from "@/context/UserContext";
import { CartItemProvider } from "@/context/CartItemContext";
import { ToastProvider } from "@/context/ToastContext";
import ToasterProvider from "@/components/ToasterProvider";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <VendorProvider>
          <UserProvider>
            <CartItemProvider>
              <ProductsProvider>
                <ToasterProvider />
                {children}
              </ProductsProvider>
            </CartItemProvider>
          </UserProvider>
        </VendorProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
