"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "meraf_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Listen for storage / custom event updates across components & tabs
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setWishlistIds(parsed);
        } else {
          setWishlistIds([]);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("wishlist_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("wishlist_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Save to localStorage whenever wishlistIds change
  const saveToStorage = useCallback((newList: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      window.dispatchEvent(new Event("wishlist_updated"));
    } catch {
      // ignore
    }
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => {
        let next: string[];
        if (prev.includes(productId)) {
          next = prev.filter((id) => id !== productId);
        } else {
          next = [...prev, productId];
        }
        saveToStorage(next);
        return next;
      });
    },
    [saveToStorage]
  );

  const addToWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => {
        if (prev.includes(productId)) return prev;
        const next = [...prev, productId];
        saveToStorage(next);
        return next;
      });
    },
    [saveToStorage]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => {
        const next = prev.filter((id) => id !== productId);
        saveToStorage(next);
        return next;
      });
    },
    [saveToStorage]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    saveToStorage([]);
  }, [saveToStorage]);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);
  const toggleWishlistDrawer = useCallback(() => setIsWishlistOpen((prev) => !prev), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
        toggleWishlistDrawer,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
