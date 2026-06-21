"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const ThreeArchitecturalFragment = dynamic(
  () => import("./ThreeArchitecturalFragment"),
  { ssr: false }
);

const CRAFT_COPY = [
  { label: "PHILOSOPHY", text: "Architecture is not about what you see. It is about what you feel when you can no longer see." },
  { label: "MATERIAL", text: "Every surface tells a story. We source stone from quarries that have supplied cathedrals for centuries." },
  { label: "LIGHT", text: "We design for the golden hour. Every room is calibrated to catch the exact moment day becomes night." },
  { label: "SILENCE", text: "True luxury is the absence of noise. Our walls are engineered to hold silence like a precious material." },
];

export default function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const copyBlocksRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Animate copy blocks in sequence
          copyBlocksRef.current.forEach((block, i) => {
            if (!block) return;
            const blockStart = i / CRAFT_COPY.length;
            const blockEnd = (i + 1) / CRAFT_COPY.length;
            const blockMid = (blockStart + blockEnd) / 2;

            let opacity = 0;
            let y = 60;

            if (progress >= blockStart && progress < blockMid) {
              const p = (progress - blockStart) / (blockMid - blockStart);
              opacity = p;
              y = 60 * (1 - p);
            } else if (progress >= blockMid && progress < blockEnd) {
              const p = (progress - blockMid) / (blockEnd - blockMid);
              opacity = 1 - p;
              y = -40 * p;
            }

            gsap.set(block, { opacity, y });
          });

          // Dispatch scroll progress for the 3D WebGL sculpture
          window.dispatchEvent(new CustomEvent("craft-scroll", { detail: { progress } }));
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craft"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(200,169,106,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Section label */}
      <div className="absolute top-12 left-12 z-20">
        <div className="text-section-label text-[var(--stone)]">
          <span className="inline-block w-6 h-[1px] bg-[var(--champagne)] mr-3 align-middle" />
          THE CRAFT
        </div>
      </div>

      <div className="relative h-screen flex items-center">
        {/* Left side: 3D architectural sculpture */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <div
            ref={canvasContainerRef}
            className="relative will-change-transform w-full h-[65vh] max-w-lg flex items-center justify-center"
            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
          >
            <ThreeArchitecturalFragment />
          </div>
        </div>

        {/* Right side: Typography sequence */}
        <div className="w-1/2 h-full flex items-center justify-center relative">
          {CRAFT_COPY.map((item, i) => (
            <div
              key={i}
              ref={(el) => { copyBlocksRef.current[i] = el; }}
              className="absolute max-w-md px-8 will-change-transform"
              style={{ opacity: 0 }}
            >
              <div className="text-section-label text-[var(--champagne)] mb-6">
                {item.label}
              </div>
              <p className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-display font-light text-white/90 leading-[1.2] tracking-tight">
                {item.text}
              </p>
              <div className="mt-8 w-12 h-[1px] bg-gradient-to-r from-[var(--champagne)] to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
