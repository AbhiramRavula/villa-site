"use client";

import { useState, useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

const SERVICES = [
  {
    id: "rent",
    title: "Rent",
    subtitle: "Temporary Worlds",
    description:
      "Experience AUREON living without permanence. Our curated portfolio of furnished residences offers seasonal or annual access to spaces that redefine what rental means.",
    features: [
      "Fully furnished architectural residences",
      "Dedicated concierge and household staff",
      "Seasonal rotation across global properties",
      "Minimum 3-month commitment",
    ],
    gradient: "linear-gradient(180deg, #2a2520 0%, #1a1815 100%)",
    accent: "from-amber-900/40 to-amber-950/60",
  },
  {
    id: "sell",
    title: "Sell",
    subtitle: "Legacy Transfer",
    description:
      "When an AUREON property changes hands, it is not a transaction. It is a transfer of legacy. Our private sales division handles every detail with museum-level discretion.",
    features: [
      "Off-market confidential listings",
      "Architectural documentation and provenance",
      "Private viewing by appointment only",
      "Global network of qualified principals",
    ],
    gradient: "linear-gradient(180deg, #1a1520 0%, #14121a 100%)",
    accent: "from-purple-900/40 to-purple-950/60",
  },
  {
    id: "buy",
    title: "Buy",
    subtitle: "Commission a World",
    description:
      "The ultimate expression of AUREON: a bespoke residence designed from inception. From site selection to the final brushstroke, every decision is yours.",
    features: [
      "Complete bespoke design from concept to completion",
      "Global site acquisition and due diligence",
      "36-60 month creation timeline",
      "Lifetime structural warranty",
    ],
    gradient: "linear-gradient(180deg, #14201a 0%, #101815 100%)",
    accent: "from-emerald-900/40 to-emerald-950/60",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const columnsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* Section label */}
      <div className="absolute top-12 left-12 z-20">
        <div className="text-section-label text-[var(--stone)]">
          <span className="inline-block w-6 h-[1px] bg-[var(--champagne)] mr-3 align-middle" />
          SERVICES
        </div>
      </div>

      {/* 3-column accordion */}
      <div className="flex h-screen">
        {SERVICES.map((service, i) => (
          <div
            key={service.id}
            ref={(el) => { columnsRef.current[i] = el; }}
            className={cn(
              "relative h-full overflow-hidden cursor-pointer transition-all duration-1000 ease-[var(--ease-aureon)]",
              activeIndex === i ? "flex-[3]" : "flex-1"
            )}
            onClick={() => setActiveIndex(i)}
            onMouseEnter={() => setActiveIndex(i)}
          >
            {/* Background */}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{ background: service.gradient }}
            />

            {/* Divider line */}
            {i > 0 && (
              <div className="absolute top-0 left-0 w-[1px] h-full bg-white/5 z-10" />
            )}

            {/* Collapsed state - vertical title */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                activeIndex === i ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <h3
                className="text-[clamp(2rem,4vw,4rem)] font-display font-bold text-white/20 -rotate-90 whitespace-nowrap tracking-tight"
              >
                {service.title}
              </h3>
            </div>

            {/* Expanded state */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-end p-10 md:p-16 transition-all duration-700",
                activeIndex === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
              )}
            >
              <div className="max-w-lg">
                <div className="text-section-label text-[var(--champagne)] mb-4">
                  {service.subtitle}
                </div>
                <h3 className="text-[clamp(3rem,6vw,6rem)] font-display font-bold text-white leading-[0.85] tracking-tight mb-6">
                  {service.title}
                </h3>
                <p className="text-white/60 text-section-body mb-8 leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-3 mb-10">
                  {service.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-3 text-white/50 text-sm"
                      style={{
                        transitionDelay: `${fi * 80}ms`,
                      }}
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--champagne)] mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className="group flex items-center gap-3 text-[var(--champagne)] text-xs uppercase tracking-[0.2em] font-medium hover:text-white transition-colors duration-500">
                  <span>Inquire</span>
                  <span className="w-8 h-[1px] bg-[var(--champagne)] group-hover:w-12 transition-all duration-500" />
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
