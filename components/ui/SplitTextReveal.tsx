"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

interface SplitTextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  trigger?: string;
}

export default function SplitTextReveal({
  children,
  className = "",
  as: Tag = "p",
  delay = 0,
  stagger = 0.03,
  trigger,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const container = containerRef.current;
    if (!container) return;

    const words = wordsRef.current.filter(Boolean);
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0, y: 30, rotationX: 40 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: trigger
            ? {
                trigger: trigger,
                start: "top 80%",
                once: true,
              }
            : {
                trigger: container,
                start: "top 80%",
                once: true,
              },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [delay, stagger, trigger]);

  const wordList = children.split(" ");

  return (
    <Tag
      ref={containerRef as React.RefObject<never>}
      className={className}
      style={{ perspective: "600px" }}
    >
      {wordList.map((word, i) => (
        <span
          key={i}
          ref={(el) => { if (el) wordsRef.current[i] = el; }}
          className="inline-block mr-[0.3em] will-change-transform"
          style={{ opacity: 0, transformStyle: "preserve-3d" }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}
