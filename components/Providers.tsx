"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VendorProvider } from "@/context/VendorContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { UserProvider } from "@/context/UserContext";
import { CartItemProvider } from "@/context/CartItemContext";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <VendorProvider>
        <UserProvider>
          <CartItemProvider>
            <ProductsProvider>
              {children}
            </ProductsProvider>
          </CartItemProvider>
        </UserProvider>
      </VendorProvider>
    </QueryClientProvider>
  );
}
