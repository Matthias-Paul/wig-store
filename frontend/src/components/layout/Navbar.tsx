"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useCartDrawer } from "@/src/features/cart/CartDrawerContext";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { AccountDropdown } from "@/src/features/auth/components/AccountDropdown";
import { GoogleSignInButton } from "@/src/features/auth/GoogleSignInButton";

export function Navbar() {
  const { data: cart } = useCart();
  const { open } = useCartDrawer();
  const { isAuthenticated } = useSession();

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading text-xl text-brand">
          Rockshairmpire
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <Link href="/products" className="hover:text-brand">
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={open}
            className="relative p-2"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {isAuthenticated ? <AccountDropdown /> : <GoogleSignInButton />}
        </div>
      </div>
    </header>
  );
}
