import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gray-50/70" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative  max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div className="relative order-last md:order-first">
          <div className="absolute -inset-4 border bg-gradient-to-tr from-brand/20 to-gold/20 border-white/20 rounded-[1.75rem] rotate-2 hidden md:block" />
          <div className="relative  aspect-[4/5] max-w-xs mx-auto md:max-w-none rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/hero.png"
              alt="Rockshairmpire"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 60vw, 40vw"
            />
          </div>
        </div>

        {/* Text */}
        <div className="text-center md:text-left">
          <span className="inline-block text-xs font-semibold tracking-widest text-brand uppercase mb-3">
            Join Rockshairmpire
          </span>
          <h2 className="font-heading text-3xl md:text-4xl  leading-tight">
            Ready to find your
            <br className="hidden md:block" /> perfect look?
          </h2>
          <p className=" text-sm md:text-base mt-4 max-w-sm mx-auto md:mx-0">
            Browse the full collection and discover premium hair that feels like
            your own — handpicked, delivered with care.
          </p>
          <Link href="/products">
            <Button variant="gold" size="lg" className="mt-8">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
