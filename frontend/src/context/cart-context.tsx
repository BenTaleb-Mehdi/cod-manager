"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductOffer } from "@/types/storefront";

export interface CartItem {
  id: string; // Composite unique key: productId + offerId
  product: Product;
  offer: ProductOffer;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, offer?: ProductOffer, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalMAD: number;
  totalItems: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "meraf_storefront_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore write errors
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, offer?: ProductOffer, quantity = 1) => {
    const selectedOffer =
      offer ||
      product.offers.find((o) => o.isPopular) ||
      product.offers[0] || {
        id: "pack-1",
        title: "1 Pièce",
        quantity: 1,
        priceMAD: product.priceMAD,
        compareAtPriceMAD: product.compareAtPriceMAD,
        savingsMAD: product.compareAtPriceMAD - product.priceMAD,
      };

    const itemId = `${product.id}-${selectedOffer.id}`;

    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === itemId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: itemId,
          product,
          offer: selectedOffer,
          quantity,
        },
      ];
    });

    // Auto open cart drawer so customer sees their item immediately
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalMAD = items.reduce(
    (sum, item) => sum + item.offer.priceMAD * item.quantity,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalMAD,
        totalItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
