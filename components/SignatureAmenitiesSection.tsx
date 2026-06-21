"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const AMENITIES = [
  {
    id: "spa",
    title: "Private Thermal Spa",
    subtitle: "Basalt & Water",
    description:
      "A subterranean sanctuary carved from volcanic stone, where heated mineral pools merge with cold plunge chambers. Designed for absolute solitude.",
    detail: "Temperature-controlled basalt chambers with chromotherapy lighting and acoustic isolation rated at 65 dB.",
    image: "/images/amenities/spa.png",
    gradient: "linear-gradient(135deg, #2a2520 0%, #3a3025 40%, #1a1815 100%)",
  },
  {
    id: "vault",
    title: "Art Vault",
    subtitle: "Climate-Controlled Gallery",
    description:
      "A museum-grade underground gallery with atmospheric precision. Your collection, preserved and displayed under conditions that rival the Louvre.",
    detail: "Humidity held at 45% \u00B1 2%, temperature at 21\u00B0C. UV-filtered lighting with 98 CRI for true color rendering.",
    image: "/images/amenities/vault.png",
    gradient: "linear-gradient(135deg, #1a1520 0%, #252035 40%, #14121a 100%)",
  },
  {
    id: "pool",
    title: "Infinity Edge Pool",
    subtitle: "Horizon Dissolved",
    description:
      "A zero-edge pool engineered to dissolve into the sky. The water surface aligns precisely with the horizon, creating a seamless visual infinity.",
    detail: "Heated to 28\u00B0C year-round. Overflow system creates a mirror-perfect surface with zero visible edge.",
    image: "/images/amenities/pool.png",
    gradient: "linear-gradient(135deg, #14201a 0%, #1a3025 40%, #101815 100%)",
  },
];

export default function SignatureAmenitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item) => {
        if (!item) return;

        const imageWrap = item.querySelector(".amenity-image-wrap") as HTMLElement;
        const curtain = item.querySelector(".amenity-curtain") as HTMLElement;
        const content = item.querySelector(".amenity-content") as HTMLElement;

        if (imageWrap) {
          // Parallax on the image
          gsap.fromTo(
            imageWrap,
            { y: "20%" },
            {
              y: "-20%",
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        if (curtain) {
          // Curtain reveal
          gsap.fromTo(
            curtain,
            { scaleY: 1 },
            {
              scaleY: 0,
              transformOrigin: "top",
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                end: "top 30%",
                scrub: 1,
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 60%",
                end: "top 30%",
                scrub: 1,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="relative py-32 md:py-48"
      style={{ background: "var(--surface)" }}
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 mb-24">
        <div className="text-section-label mb-6">
          <span className="inline-block w-6 h-[1px] bg-[var(--champagne)] mr-3 align-middle" />
          SIGNATURE AMENITIES
        </div>
        <h2 className="text-section-title font-display text-[var(--ink)] max-w-3xl">
          Beyond amenity.<br />
          <span className="font-editorial italic text-[var(--bronze)]">Into ritual.</span>
        </h2>
      </div>

      {/* Amenity items */}
      <div className="space-y-32 md:space-y-48">
        {AMENITIES.map((amenity, i) => (
          <div
            key={amenity.id}
            ref={(el) => { itemsRef.current[i] = el; }}
            className={`max-w-7xl mx-auto px-8 md:px-16 flex flex-col ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-12 md:gap-20`}
          >
            {/* Image side */}
            <div className="w-full md:w-1/2 relative overflow-hidden rounded-lg" style={{ aspectRatio: "4/5" }}>
              <div className="amenity-image-wrap absolute inset-[-20%]">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${amenity.image})` }}
                />
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none"
                  style={{ background: amenity.gradient }}
                />
              </div>
              {/* Curtain */}
              <div
                className="amenity-curtain absolute inset-0 z-10"
                style={{ background: "var(--surface)" }}
              />
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[var(--champagne)] z-20 opacity-40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[var(--champagne)] z-20 opacity-40" />
            </div>

            {/* Content side */}
            <div className="amenity-content w-full md:w-1/2">
              <div className="text-section-label text-[var(--champagne)] mb-4">
                {amenity.subtitle}
              </div>
              <h3 className="text-[clamp(2rem,3.5vw,3.5rem)] font-display font-bold text-[var(--ink)] leading-[0.95] tracking-tight mb-6">
                {amenity.title}
              </h3>
              <p className="text-section-body text-[var(--muted-ink)] mb-6 max-w-md">
                {amenity.description}
              </p>
              <div className="border-t border-[var(--stone)] pt-4">
                <p className="text-xs text-[var(--muted-ink)] leading-relaxed font-mono">
                  {amenity.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
