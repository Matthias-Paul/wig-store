"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const SWIPE_THRESHOLD = 50; // minimum px distance to count as a real swipe

export function ProductImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  function goPrev() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function goNext() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > SWIPE_THRESHOLD) {
      goNext(); // swiped left → next image
    } else if (distance < -SWIPE_THRESHOLD) {
      goPrev(); // swiped right → previous image
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  if (images.length === 0) {
    return (
      <div className="h-[24rem] w-full rounded-lg bg-gray-100 sm:h-[28rem] md:h-[32rem]" />
    );
  }

  return (
    <div className="w-full min-w-0">
      <div
        className="relative overflow-hidden rounded-lg bg-gray-100 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[activeIndex]}
          alt={alt}
          width={900}
          height={1200}
          className="h-[24rem] w-full object-cover object-top sm:h-[28rem] md:h-[32rem]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="hidden text-black cursor-pointer md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="hidden text-black cursor-pointer md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow items-center justify-center"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dot indicators — mobile only, since swipe has no visible arrows to hint at more images */}
            <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={clsx(
                    "h-1.5 rounded-full transition-all",
                    index === activeIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-3 w-full min-w-0">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={clsx(
                "relative shrink-0 cursor-pointer w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                index === activeIndex ? "border-brand" : "border-transparent",
              )}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
