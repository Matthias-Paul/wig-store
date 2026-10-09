import Link from "next/link";
import { Button } from "@/src/components/ui/Button";

const STORY_STEPS = [
  {
    title: "The Beginning",
    body: "It all started with a dream during my undergraduate years. Driven by a love for neat, beautiful looks, I wanted to help my fellow students enhance their appearance without the stress of high costs or long wait times. After the COVID break, I returned to school with a deeper passion for beauty and fashion, starting small by doing hair and makeup for my roommate and flatmates.",
  },
  {
    title: "The Evolution",
    body: "As my skills grew, so did my clientele, moving from friends to paying customers for hair services and wigs. In 2022, I transitioned from a small business to a formal brand called Rocksglam Beauty Haven. At that stage, I offered a broad spectrum of services, including makeup, hair styling, pedicures, nail painting, and wig sales.",
  },
  {
    title: "A New Era",
    body: "After graduating, I realized the importance of specializing to serve my clients more effectively. I chose to niche down by treating hair as its own distinct entity, recognizing it as a foundational element of beauty. This led to the launch of Rocks Hairmpire in October 2026, a brand dedicated entirely to hair excellence. The name Rocks Hairmpire was chosen and designed to be easily accessible to everyone because it’s a direct interpretation of its name, and self-explanatory.",
  },
] as const;

const WHY_POINTS = [
  {
    title: "Wide Varieties",
    body: "From premium quality human hair bundles and luxury wigs to affordable, budget-friendly hair blends.",
  },
  {
    title: "Wholesale and Retail Options",
    body: "Perfect for both individuals and resellers.",
  },
  {
    title: "Hair Maintenance",
    body: "The health of our customers’ hair is paramount to us; we sell hair kits and accessories to assist with your maintenance routine.",
  },
  {
    title: "Expert Guidance",
    body: "Our team helps you find the perfect hair for any moment or occasion.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-tint via-white to-gold-tint" />
        <div className="absolute top-0 right-1/4 h-[420px] w-[420px] rounded-full bg-brand/10 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-gold/20 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #7E297E 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 py-16 md:py-24 text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            About Us
          </p>
          <h1 className="mt-3 font-heading text-4xl md:text-5xl text-gray-900 leading-tight">
            Rocks Hairmpire
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-gray-600 leading-relaxed">
            Rock every hair with confidence.
          </p>
        </div>
      </section>

      {/* Welcome */}
      <section className="mx-auto max-w-3xl px-4 py-14 md:py-16">
        <h2 className="font-heading text-2xl md:text-3xl text-gray-900">
          Welcome to Rocks Hairmpire Enterprises
        </h2>
        <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
          <p>
            Founded in 2021 by Damilola Janet Adesina, our company recognized a
            distinct gap in the market for affordable, premium, and luxury hair
            bundles and wigs—particularly in meeting every woman&apos;s hair
            needs and budget, driven by the belief that a woman&apos;s
            confidence is directly connected to how she feels about her hair.
          </p>
          <p>
            Since our founding, we have consistently met the growing demand for
            affordable hair bundles, wigs, human hair, raw, luxury, and premium
            hair that suits every woman. We are passionate about selling hair
            kits that help maintain the quality and lifespan of the hair, as
            well as accessories that help amplify its beauty.
          </p>
          <p>
            Whether you&apos;re looking to buy premium hair, raw and luxury
            hair, affordable and high-quality hair blends, or hair accessories
            and kits that suit your specific hair type, Rocks Hairmpire is your
            one-stop destination.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-y border-gray-100">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-16">
          <h2 className="font-heading text-2xl md:text-3xl text-gray-900">
            Our Story
          </h2>
          <p className="mt-3 text-gray-500 text-sm">
            From a student dream to a brand built for hair excellence.
          </p>

          <ol className="mt-10 space-y-0">
            {STORY_STEPS.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white text-sm font-semibold shadow-sm">
                    {index + 1}
                  </span>
                  {index < STORY_STEPS.length - 1 && (
                    <span className="mt-2 w-px flex-1 bg-brand/20" />
                  )}
                </div>
                <div className="pt-1">
                  <h3 className="font-heading text-xl text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-5xl px-4 py-14 md:py-16">
        <div className="max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl text-gray-900">
            Why Choose Rocks Hairmpire?
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            At Rocks Hairmpire, we believe that the right hair can enhance your
            look, transform moments, build confidence, and create unforgettable
            memories. That&apos;s why we carefully source every strand to ensure
            premium quality and authenticity.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {WHY_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-brand/10 bg-brand-tint/40 p-6"
            >
              <h3 className="font-heading text-lg text-brand">{point.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {point.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-heading text-xl md:text-2xl text-center text-brand">
          Our Motto: Rock every hair with confidence.
        </p>
      </section>

      {/* Mission */}
      <section className="relative overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-dark to-gray-900" />
        <div className="relative mx-auto max-w-3xl px-4 py-14 md:py-16 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-white">
            Our Mission
          </h2>
          <p className="mt-5 text-white/85 leading-relaxed">
            Our mission is simple: meeting every woman&apos;s hair needs within
            Nigeria and beyond, enhancing everyday looks with hair that
            inspires, uplifts, and builds confidence.
          </p>
          <p className="mt-4 text-white/75 leading-relaxed">
            Whether you&apos;re looking for luxury human hair, affordable hair
            blends, hair bundles, or wigs—or hair accessories and kits for
            personal use or profitable hair supplies—Rocks Hairmpire is here to
            serve you.
          </p>
          <p className="mt-8 text-gold-tint font-medium">
            Thank you for making us part of your hair journey.
          </p>
          <div className="mt-8">
            <Link href="/products">
              <Button variant="gold" size="lg">
                Shop the Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
