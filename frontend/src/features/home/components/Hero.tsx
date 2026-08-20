import Link from "next/link";
import Image from "next/image";
import { Star, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Layered mesh-gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-tint via-white to-gold-tint" />
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-brand/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/20 rounded-full blur-[100px]" />

      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #7E297E 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="text-center md:text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-brand/15 rounded-full pl-2 pr-4 py-1.5 shadow-sm mb-6">
            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand text-white">
              <Sparkles size={12} />
            </span>
            <span className="text-xs font-semibold text-brand tracking-wide">
              Worldwide Shipping
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-gray-900">
            Experience the luxury of{" "}
            <span className="relative inline-block text-brand">
              beautiful hair.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="10"
                viewBox="0 0 200 10"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8C50 2 150 2 198 8"
                  stroke="#C9A24B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="text-gray-600 mt-6 text-base md:text-lg max-w-md mx-auto md:mx-0">
            Rock every hair with confidence
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-9 justify-center md:justify-start">
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-brand/25"
              >
                Shop the Collection
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/70 backdrop-blur-sm"
              >
                Explore Bundles
              </Button>
            </Link>
          </div>

          {/* Social proof row */}
          <div className="flex items-center gap-3 justify-center md:justify-start mt-10">
            <div className="flex -space-x-3">
              {["A", "C", "F", "M"].map((letter) => (
                <div
                  key={letter}
                  className="h-9 w-9 rounded-full bg-brand-tint border-2 border-white flex items-center justify-center text-brand text-xs font-semibold"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Trusted by 50+ happy customers
              </p>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative hidden md:block">
          {/* Decorative offset frame behind the image */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-brand/20 to-gold/20 rounded-[2rem] rotate-3" />

          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-brand/20 ring-1 ring-black/5">
            <Image
              src="/images/hero.png"
              alt="Rockshairmpire hair collection"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          {/* Floating trust badge */}
          <div className="absolute top-6 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 border border-gray-100">
            <span className="flex items-center justify-center h-9 w-9 rounded-full bg-success/10 text-success">
              <ShieldCheck size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Secure Payment
              </p>
              <p className="text-xs text-gray-500">
                Encrypted checkout via Paystack
              </p>
            </div>
          </div>

          {/* Floating stat card */}
          <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100">
            <p className="font-heading text-2xl text-brand">50+</p>
            <p className="text-xs text-gray-500">Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
