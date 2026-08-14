"use client";

import { useState } from "react";
import { MessageCircle, Link2, Check } from "lucide-react";

export function ShareButtons({ productName }: { productName: string }) {
  const [copied, setCopied] = useState(false);

  function getShareUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function shareToWhatsApp() {
    const text = `Check this out: ${productName} — ${getShareUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center  gap-3 pt-4 border-t border-gray-100">
      <span className="text-xs text-gray-400 font-medium">
        Share this product
      </span>
      <button
        onClick={shareToWhatsApp}
        aria-label="Share on WhatsApp"
        className="h-8 w-8 rounded-full cursor-pointer bg-gray-50 hover:bg-success/10 hover:text-success flex items-center justify-center text-gray-500 transition-colors"
      >
        <MessageCircle size={14} />
      </button>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="h-8 w-8 rounded-full cursor-pointer bg-gray-50 hover:bg-brand-tint hover:text-brand flex items-center justify-center text-gray-500 transition-colors"
      >
        {copied ? <Check size={14} /> : <Link2 size={14} />}
      </button>
    </div>
  );
}
