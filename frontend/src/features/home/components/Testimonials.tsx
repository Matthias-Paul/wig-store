"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const REVIEWS = [
  {
    name: "Amaka Okafor",
    initials: "AO",
    text: "The quality is unmatched. My bundle still looks brand new after months of wear. Definitely ordering again — this is now my go-to store.",
    rating: 5,
  },
  {
    name: "Chidinma Eze",
    initials: "CE",
    text: "Fast delivery and the hair feels so natural on. Customer service was also super helpful when I had questions about my order.",
    rating: 5,
  },
  {
    name: "Funmi Adeyemi",
    initials: "FA",
    text: "Exactly as pictured, maybe even better in person. The closure blended perfectly with my hairline — I've gotten so many compliments.",
    rating: 5,
  },
  {
    name: "Ngozi Uche",
    initials: "NU",
    text: "I was nervous ordering hair online but this exceeded expectations. Rich, full, and it takes color beautifully. Highly recommend.",
    rating: 5,
  },
];

const AUTO_ADVANCE_MS = 5000;

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % REVIEWS.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? REVIEWS.length - 1 : i - 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [goNext]);

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
    if (distance > 50) goNext();
    else if (distance < -50) goPrev();
    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/60 to-white overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-widest text-gold uppercase mb-2">
          Reviews
        </span>
        <h2 className="font-heading text-3xl md:text-4xl text-gray-900">
          Loved by Our Customers
        </h2>
      </div>

      <div className="relative max-w-2xl mx-auto px-4">
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {REVIEWS.map((review) => (
              <div key={review.name} className="w-full flex-shrink-0 px-2">
                <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm text-center relative">
                  <Quote
                    className="text-brand/10 absolute top-6 left-1/2 -translate-x-1/2"
                    size={44}
                  />
                  <div className="relative flex gap-0.5 justify-center text-gold mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p className="relative text-gray-700 leading-relaxed text-sm md:text-base">
                    "{review.text}"
                  </p>
                  <div className="flex items-center justify-center gap-2.5 mt-6">
                    <div className="h-10 w-10 rounded-full bg-brand-tint text-brand flex items-center justify-center text-xs font-semibold">
                      {review.initials}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous testimonial"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10 rounded-full bg-white shadow-md items-center justify-center text-gray-500 hover:text-brand transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next testimonial"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10 rounded-full bg-white shadow-md items-center justify-center text-gray-500 hover:text-brand transition-colors"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-7">
          {REVIEWS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={clsx(
                "h-1.5 rounded-full transition-all",
                index === activeIndex ? "w-6 bg-brand" : "w-1.5 bg-gray-300",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
