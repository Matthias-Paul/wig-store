"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyableReference({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-brand transition-colors group"
      title="Click to copy"
    >
      <span className="truncate max-w-[140px]">{value}</span>
      {copied ? (
        <Check size={12} className="text-success shrink-0" />
      ) : (
        <Copy
          size={12}
          className="shrink-0 cursor-pointer"
        />
      )}
    </button>
  );
}
