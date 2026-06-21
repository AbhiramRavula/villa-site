"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const MANIFESTO_TEXT =
  "We do not build homes. We summon worlds. Every line, every shadow, every silence is composed. Architecture is the last luxury that cannot be faked. It is the discipline of emotion, the choreography of light, and the geometry of longing. At AUREON, we believe privacy is the ultimate material. Space is sculpted. Time is suspended. And what remains is yours alone.";

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const words = wordsRef.current.filter(Boolean);
      if (words.length === 0) return;

      // Set initial state
      gsap.set(words, { opacity: 0.08, scale: 0.97 });

      // Pin the section and reveal words one by one on scroll
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 3}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          words.forEach((word, i) => {
            const wordStart = i / words.length;
            const wordEnd = (i + 1) / words.length;
            const wordProgress = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart)));

            gsap.set(word, {
              opacity: 0.08 + wordProgress * 0.92,
              scale: 0.97 + wordProgress * 0.03,
              color: wordProgress > 0.5 ? "var(--ink)" : "var(--stone)",
            });
          });
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const words = MANIFESTO_TEXT.split(" ");

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,169,106,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16">
        {/* Section label */}
        <div className="text-section-label mb-12 text-center">
          <span className="inline-block w-8 h-[1px] bg-[var(--champagne)] mr-3 align-middle" />
          MANIFESTO
          <span className="inline-block w-8 h-[1px] bg-[var(--champagne)] ml-3 align-middle" />
        </div>

        {/* Word-by-word reveal */}
        <p className="text-manifesto text-center leading-[1.15] tracking-tight">
          {words.map((word, i) => (
            <span
              key={i}
              ref={(el) => { if (el) wordsRef.current[i] = el; }}
              className="inline-block mr-[0.3em] will-change-transform transition-colors duration-100"
              style={{ opacity: 0.08, color: "var(--stone)" }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Bottom accent */}
        <div className="mt-16 flex justify-center">
          <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--champagne)] to-transparent" />
        </div>
      </div>
    </section>
  );
}
