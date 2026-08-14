"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingBag } from "lucide-react";
import { useCart } from "@/src/features/cart/hooks/useCart";
import { useCartDrawer } from "@/src/features/cart/CartDrawerContext";
import { useSession } from "@/src/features/auth/hooks/useSession";
import { AccountDropdown } from "@/src/features/auth/components/AccountDropdown";
import { GoogleSignInButton } from "@/src/features/auth/GoogleSignInButton";
import { NotificationBell } from "@/src/features/notifications/components/NotificationBell";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";

const LOGO_URL =
  "https://res.cloudinary.com/drkxtuaeg/image/upload/v1785842112/lxvaiiwhocdppargd5bc.jpg";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: cart } = useCart();
  const { open: openCart } = useCartDrawer();
  const { isAuthenticated } = useSession();

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left — logo + brand */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src={LOGO_URL}
              alt="Rockshairmpire"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="font-heading text-lg text-brand hidden sm:inline">
              Rockshairmpire
            </span>
          </Link>

          {/* Center — nav links, desktop only */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Shop</NavLink>
          </nav>

          {/* Right — icons + auth */}
          <div className="flex items-center gap-1 sm:gap-2">
            {isAuthenticated && <NotificationBell />}

            <button
              onClick={openCart}
              className="relative text-brand p-2 cursor-pointer  "
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Desktop: account dropdown or sign-in button */}
            <div className="hidden md:block">
              {isAuthenticated ? <AccountDropdown /> : <GoogleSignInButton />}
            </div>

            {/* Mobile: hamburger only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden cursor-pointer text-brand p-2"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
