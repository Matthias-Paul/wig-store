'use client';

import { useMemo, useState } from 'react';
import type { ProductVariant } from '@/src/types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | undefined) => void;
}

export function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedLength, setSelectedLength] = useState<number | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const lengths = useMemo(
    () => [...new Set(variants.map((v) => v.length))].sort((a, b) => a - b),
    [variants],
  );

  const patterns = useMemo(
    () => [...new Set(variants.map((v) => v.pattern))],
    [variants],
  );

  function isPatternAvailable(pattern: string) {
    if (selectedLength === null) return true;
    return variants.some((v) => v.length === selectedLength && v.pattern === pattern);
  }

  function isLengthAvailable(length: number) {
    if (selectedPattern === null) return true;
    return variants.some((v) => v.length === length && v.pattern === selectedPattern);
  }

  function handleLengthSelect(length: number) {
    setSelectedLength(length);
    const variant = variants.find((v) => v.length === length && v.pattern === selectedPattern);
    onVariantChange(variant);
  }

  function handlePatternSelect(pattern: string) {
    setSelectedPattern(pattern);
    const variant = variants.find((v) => v.length === selectedLength && v.pattern === pattern);
    onVariantChange(variant);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Length</p>
        <div className="flex flex-wrap gap-2">
          {lengths.map((length) => (
            <button
              key={length}
              onClick={() => handleLengthSelect(length)}
              disabled={!isLengthAvailable(length)}
              className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                selectedLength === length
                  ? 'bg-brand text-white border-brand'
                  : 'border-gray-300 hover:border-brand disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              {length}"
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Pattern</p>
        <div className="flex flex-wrap gap-2">
          {patterns.map((pattern) => (
            <button
              key={pattern}
              onClick={() => handlePatternSelect(pattern)}
              disabled={!isPatternAvailable(pattern)}
              className={`px-3 py-1.5 rounded-md border text-sm capitalize transition-colors ${
                selectedPattern === pattern
                  ? 'bg-brand text-white border-brand'
                  : 'border-gray-300 hover:border-brand disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              {pattern}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}