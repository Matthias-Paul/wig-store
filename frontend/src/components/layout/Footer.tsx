// components/layout/Footer.tsx
import Link from 'next/link';
import {  Mail, Phone, MapPin } from 'lucide-react';
// import { Input } from '@/src/components/ui/Input';
// import { Button } from '@/src/components/ui/Button';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <>
      <footer className="bg-gray-900 text-gray-300">
        {/* Newsletter strip */}
        {/* <div className="border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-heading text-white text-xl">
                Stay in the loop
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Get early access to new arrivals and exclusive discounts.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-w-[220px]"
              />
              <Button variant="gold" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div> */}

        {/* Main link grid */}
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 text-sm">
          {/* Brand column — spans full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-white text-xl mb-3">
              Rockshairmpire
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Premium bundles, closures, and luxury wigs — quality hair,
              delivered with care.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand transition-colors"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand transition-colors"
              >
                <FaFacebook size={16} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand transition-colors"
              >
                <FaXTwitter size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Shop</h4>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?discount=true"
                  className="hover:text-white transition-colors"
                >
                  Sale
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Account</h4>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link
                  href="/orders"
                  className="hover:text-white transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-white transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/notifications"
                  className="hover:text-white transition-colors"
                >
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Help</h4>
            <ul className="space-y-2.5 text-gray-400">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-white transition-colors"
                >
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms Of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 truncate md:col-span-1">
            <h4 className="text-white font-medium mb-3">Get in Touch</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 flex-shrink-0" />
                <span>support@rockshairmpire.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 flex-shrink-0" />
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 flex-shrink-0" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>
              @ {new Date().getFullYear()} Rockshairmpire. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* <Link
                href="/privacy"
                className="hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link> */}
              <Link
                href="/terms"
                className="hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Secured payments via</span>
              <span className="font-semibold text-gray-300">Paystack</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}