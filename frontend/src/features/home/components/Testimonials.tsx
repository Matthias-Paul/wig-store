"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const REVIEWS = [
  {
    name: "Tiara",
    initials: "T",
    text: "The hair is even more gorgeous physically, the texture is very pleasing. The delivery was swift too, Rocks hairmpire is my go to store henceforth.",
    rating: 5,
  },
  {
    name: "Elizabeth",
    initials: "E",
    text: "My hair? Yes, one of the best purchases I've made, ever. Everyone kept giving me beautiful compliments. The hair is gorgeous, breathable, and exactly what I ordered. The packaging too, it was mind blowing, I could keep buying hairs every day just because of the beautiful packaging. The hair was nothing short of expectations, thank youuu!!",
    rating: 5,
  },
  {
    name: "Omolara",
    initials: "O",
    text: "The wig arrived beautifully packaged and styled. Wore it for an event and got compliments all day, the hair boosted my confidence and made me feel seen. Highly recommend!",
    rating: 5,
  },
  {
    name: "Bukola",
    initials: "B",
    text: "I absolutely love my hair! It turned out even more beautiful in person. The quality, attention to detail, and overall finish exceeded my expectations. Thank you so much for delivering such an amazing experience. May God continue to bless you and prosper the work of your hands!",
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
                <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm text-center relative flex flex-col h-[340px] md:h-[320px]">
                  <Quote
                    className="text-brand/10 absolute top-6 left-1/2 -translate-x-1/2"
                    size={44}
                  />
                  <div className="relative flex gap-0.5 justify-center text-gold mb-4 shrink-0">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <div className="relative flex-1 flex items-center justify-center min-h-0">
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      "{review.text}"
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2.5 mt-6 shrink-0">
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
