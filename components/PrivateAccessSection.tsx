"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

export default function PrivateAccessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!spotlightRef.current || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spotlightRef.current.style.setProperty("--spot-x", `${x}px`);
    spotlightRef.current.style.setProperty("--spot-y", `${y}px`);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener("mousemove", handleMouseMove, { passive: true });

    const ctx = gsap.context(() => {
      // Fade in the section content
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "top 20%",
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, [handleMouseMove]);

  return (
    <section
      ref={sectionRef}
      id="private-access"
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#0a0908" }}
    >
      {/* Spotlight mask layer */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle 200px at var(--spot-x, 50%) var(--spot-y, 50%),
            transparent 0%,
            rgba(10, 9, 8, 0.3) 40%,
            rgba(10, 9, 8, 0.85) 100%
          )`,
        }}
      />

      {/* Hidden content revealed by spotlight */}
      <div
        ref={maskRef}
        className="absolute inset-0 z-5"
        style={{
          background: `
            radial-gradient(ellipse 40% 30% at 25% 35%, rgba(200,169,106,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 30% 40% at 75% 65%, rgba(138,106,62,0.03) 0%, transparent 70%)
          `,
        }}
      />

      {/* Scattered text elements that appear under spotlight */}
      <div className="absolute inset-0 z-[5]">
        <span className="absolute top-[15%] left-[10%] text-white/[0.03] font-editorial italic text-6xl">
          Silence
        </span>
        <span className="absolute top-[30%] right-[15%] text-white/[0.03] font-display text-4xl tracking-tight">
          PRIVATE
        </span>
        <span className="absolute bottom-[35%] left-[20%] text-white/[0.03] font-editorial italic text-5xl">
          Exclusivity
        </span>
        <span className="absolute bottom-[20%] right-[25%] text-white/[0.03] font-display text-3xl tracking-widest">
          BY INVITATION
        </span>
        <span className="absolute top-[50%] left-[45%] text-white/[0.02] font-display text-8xl font-bold -translate-x-1/2">
          A
        </span>

        {/* Decorative lines */}
        <div className="absolute top-[25%] left-[5%] w-32 h-[1px] bg-[var(--champagne)] opacity-[0.03] rotate-12" />
        <div className="absolute bottom-[30%] right-[8%] w-24 h-[1px] bg-[var(--champagne)] opacity-[0.03] -rotate-6" />
        <div className="absolute top-[60%] left-[60%] w-40 h-[1px] bg-[var(--champagne)] opacity-[0.02] rotate-45" />
      </div>

      {/* Central content */}
      <div
        ref={contentRef}
        className="relative z-20 text-center max-w-2xl px-8"
      >
        <div className="text-section-label text-[var(--champagne)] mb-8">
          <span className="inline-block w-8 h-[1px] bg-[var(--champagne)] mr-3 align-middle opacity-50" />
          PRIVATE ACCESS
          <span className="inline-block w-8 h-[1px] bg-[var(--champagne)] ml-3 align-middle opacity-50" />
        </div>

        <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-display font-bold text-white leading-[0.9] tracking-tight mb-6">
          Not for everyone.
          <br />
          <span className="font-editorial italic font-normal text-[var(--champagne)]">
            For the singular.
          </span>
        </h2>

        <p className="text-white/40 text-section-body max-w-lg mx-auto mb-10 leading-relaxed">
          AUREON operates by introduction only. Our client roster is deliberately
          limited to ensure every project receives our complete creative attention.
          If you have been referred, we are already expecting you.
        </p>

        {/* Invitation code input */}
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="INVITATION CODE"
              className="bg-transparent border border-white/10 rounded-full px-6 py-3 text-xs text-white/60 tracking-[0.2em] uppercase w-56 focus:border-[var(--champagne)] focus:outline-none transition-colors duration-500 placeholder:text-white/20"
            />
          </div>
          <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-[var(--champagne)] hover:bg-[rgba(200,169,106,0.05)] transition-all duration-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="var(--champagne)" strokeWidth="1" />
            </svg>
          </button>
        </div>

        {/* Subtle disclaimer */}
        <p className="text-white/10 text-[10px] tracking-[0.15em] uppercase mt-6">
          Verified introductions only
        </p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/[0.03] z-20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/[0.03] z-20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/[0.03] z-20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/[0.03] z-20" />
    </section>
  );
}
