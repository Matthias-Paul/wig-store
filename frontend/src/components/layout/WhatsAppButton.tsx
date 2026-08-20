"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK;

export function WhatsAppButton() {
  const pathname = usePathname();

  // Hidden on admin routes — this is a customer support channel, not needed in the dashboard
  if (pathname.startsWith("/admin")) return null;

  const href = WHATSAPP_LINK;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 md:right-6 bottom-[15%] z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-30" />
      <span className="relative flex items-center justify-center h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-success text-white shadow-lg shadow-success/30 hover:scale-105 transition-transform">
        <MessageCircle size={26} fill="currentColor" strokeWidth={0} />
      </span>

      {/* Tooltip on hover, desktop only */}
      <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
