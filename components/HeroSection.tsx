"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/* -- Config -- */
const TOTAL_FRAMES = 192;
const FRAME_PATH = "/hero-frames/frame_";
const FRAME_EXT = ".png";

const pad = (n: number) => String(n).padStart(6, "0");
const frameUrl = (i: number) => `${FRAME_PATH}${pad(i)}${FRAME_EXT}`;

const COPY_SEQUENCE = [
  { text: "AUREON", type: "title" as const, start: 0, end: 15 },
  { text: "Some structures are built.", type: "line" as const, start: 12, end: 26 },
  { text: "Others are summoned.", type: "line" as const, start: 23, end: 36 },
  { text: "Private worlds.", type: "accent" as const, start: 33, end: 46 },
  { text: "Suspended beyond expectation.", type: "line" as const, start: 43, end: 58 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const cloudBackRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudForeRef = useRef<HTMLDivElement>(null);
  const cloudUltraRef = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrame = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = images.current[index];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  /* -- Canvas resize + frame preload -- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      drawFrame(currentFrame.current);
    };
    resize();
    window.addEventListener("resize", resize);

    let loadedCount = 0;
    let cancelled = false;

    const loadImage = (index: number): Promise<void> =>
      new Promise((resolve) => {
        if (cancelled || images.current[index]) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          if (cancelled) { resolve(); return; }
          images.current[index] = img;
          loadedCount++;
          const currentProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(currentProgress);
          
          window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: currentProgress } }));

          if (index === currentFrame.current) {
            drawFrame(index);
          }
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          const currentProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(currentProgress);
          window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: currentProgress } }));
          resolve();
        };
        img.src = frameUrl(index);
      });

    const indices = (step: number) =>
      Array.from({ length: Math.ceil(TOTAL_FRAMES / step) }, (_, k) => k * step);

    const preload = async () => {
      await loadImage(0);
      drawFrame(0);

      if (cancelled) return;
      await Promise.all(indices(20).map(loadImage));

      if (cancelled) return;
      await Promise.all(indices(10).map(loadImage));

      if (cancelled) return;
      await Promise.all(indices(5).map(loadImage));

      for (let i = 0; i < TOTAL_FRAMES; i += 60) {
        if (cancelled) return;
        await Promise.all(
          Array.from({ length: 30 }, (_, k) => i + k * 2).filter((n) => n < TOTAL_FRAMES).map(loadImage)
        );
      }

      for (let i = 0; i < TOTAL_FRAMES; i += 30) {
        if (cancelled) return;
        await Promise.all(
          Array.from({ length: 30 }, (_, k) => i + k).filter((n) => n < TOTAL_FRAMES).map(loadImage)
        );
      }
    };

    preload();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
  }, [drawFrame]);

  /* -- Scroll-driven animation -- */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wrapper = document.getElementById("hero-root");
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const frameProgress = self.progress;
          const targetIndex = Math.min(
            Math.floor(frameProgress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );

          let bestIndex = targetIndex;
          if (!images.current[targetIndex]) {
            bestIndex = 0;
            for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
              const lo = targetIndex - offset;
              const hi = targetIndex + offset;
              if (lo >= 0 && images.current[lo]) { bestIndex = lo; break; }
              if (hi < TOTAL_FRAMES && images.current[hi]) { bestIndex = hi; break; }
            }
          }

          if (bestIndex !== currentFrame.current) {
            currentFrame.current = bestIndex;
            drawFrame(bestIndex);
          }
        },
      });

      if (bloomRef.current) {
        gsap.fromTo(
          bloomRef.current,
          { opacity: 0.05 },
          {
            opacity: 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top top",
              end: "55% bottom",
              scrub: 1,
            },
          }
        );
      }

      if (cloudBackRef.current && cloudMidRef.current && cloudForeRef.current && cloudUltraRef.current && fogRef.current) {
        const cloudTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "55% top", 
            end: "95% top",   
            scrub: true,
          },
        });

        cloudTl.fromTo(
          cloudBackRef.current,
          { y: "100vh", opacity: 0 },
          { y: "-150vh", opacity: 0.8, duration: 1.5, ease: "none" },
          0
        );
        
        cloudTl.fromTo(
          cloudMidRef.current,
          { y: "100vh", opacity: 0 },
          { y: "-180vh", opacity: 0.9, duration: 1.5, ease: "none" },
          0.15
        );
        
        cloudTl.fromTo(
          cloudForeRef.current,
          { y: "110vh", opacity: 0 },
          { y: "-220vh", opacity: 1, duration: 1.5, ease: "none" },
          0.3
        );

        cloudTl.fromTo(
          cloudUltraRef.current,
          { y: "120vh", opacity: 0 },
          { y: "-260vh", opacity: 1, duration: 1.5, ease: "none" },
          0.45
        );

        cloudTl.fromTo(fogRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 1, ease: "power2.in" }, 
          0.8
        );
      }

      if (finalTextRef.current) {
        gsap.fromTo(
          finalTextRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wrapper,
              start: "75% top",
              end: "95% top",
              scrub: true,
            },
          }
        );
      }

      copyRefs.current.forEach((el, i) => {
        if (!el) return;

        const { start, end } = COPY_SEQUENCE[i];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: `${start}% top`,
            end: `${end}% top`,
            scrub: 1,
          },
        });

        const entries = [
          { rotationX: 10, rotationY: -5 },
          { rotationX: -5, rotationY: 5 },
          { rotationX: 5, rotationY: -10 },
          { rotationX: 0, rotationY: 10 },
          { rotationX: -10, rotationY: 0 },
        ];
        const entry = entries[i % entries.length];

        if (i === 4) {
          tl.fromTo(
            el,
            { opacity: 0, z: -1000, x: "20vw", scale: 0.8, ...entry },
            { opacity: 1, z: 0, x: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" }
          );
          tl.to(
            el,
            { opacity: 0, z: 800, x: "-100vw", scale: 1.5, rotationY: -30, duration: 0.6, ease: "power2.in" }
          );
        } else {
          tl.fromTo(
            el,
            { opacity: 0, z: -1500, scale: 0.6, ...entry },
            { opacity: 1, z: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" }
          );
          tl.to(
            el,
            { opacity: 0, z: 1500, scale: 2.5, duration: 0.6, ease: "power2.in" }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [drawFrame]);

  /* -- Page load entrance -- */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const tl = gsap.timeline({ delay: 2.0 });

    if (overlayRef.current) {
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    }

    if (copyRefs.current[0]) {
      tl.fromTo(
        copyRefs.current[0],
        { opacity: 0, y: 60, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
        0.2
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sticky top-0 w-full h-screen overflow-hidden"
      style={{ zIndex: 10 }}
      aria-label="Hero - Scroll to explore"
    >
      {/* Frame canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Cinematic vignette */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            linear-gradient(180deg, rgba(23,19,15,0.3) 0%, rgba(23,19,15,0.0) 30%, rgba(23,19,15,0.0) 60%, rgba(23,19,15,0.45) 100%),
            linear-gradient(90deg, rgba(23,19,15,0.2) 0%, transparent 25%, transparent 75%, rgba(23,19,15,0.2) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Golden bloom */}
      <div
        ref={bloomRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 25%, rgba(200,169,106,0.18) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Dense Fog Layer */}
      <div
        ref={fogRef}
        className="absolute inset-0 pointer-events-none z-[4] opacity-0"
        style={{ background: "#e8e5df" }}
        aria-hidden="true"
      />

      {/* Clouds Overlay Container */}
      <div 
        className="absolute inset-0 pointer-events-none z-[5] overflow-visible"
        style={{ mixBlendMode: "screen" }}
      >
        <div
          ref={cloudBackRef}
          className="absolute inset-0"
          style={{ mixBlendMode: "screen", filter: "blur(8px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/cloud-overlay.png" 
            alt="" 
            className="w-full h-[200vh] object-cover" 
            style={{ 
              transform: "scale(1.4)", 
              objectPosition: "center",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)"
            }} 
          />
        </div>
        <div
          ref={cloudMidRef}
          className="absolute inset-0"
          style={{ mixBlendMode: "screen", filter: "blur(4px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/cloud-overlay.png" 
            alt="" 
            className="w-full h-[200vh] object-cover" 
            style={{ 
              transform: "scaleX(-1) scaleY(1.2)", 
              objectPosition: "center",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)"
            }} 
          />
        </div>
        <div
          ref={cloudForeRef}
          className="absolute inset-0"
          style={{ mixBlendMode: "screen" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/cloud-overlay.png" 
            alt="" 
            className="w-full h-[200vh] object-cover" 
            style={{ 
              transform: "scale(1.1)", 
              objectPosition: "center",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)"
            }} 
          />
        </div>
        <div
          ref={cloudUltraRef}
          className="absolute inset-0"
          style={{ mixBlendMode: "screen", filter: "blur(2px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/cloud-overlay.png" 
            alt="" 
            className="w-full h-[200vh] object-cover" 
            style={{ 
              transform: "scaleX(-1) scale(1.6)", 
              objectPosition: "center",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
            }} 
          />
        </div>
      </div>

      {/* 3D Copy Sequence */}
      <div
        className="absolute inset-0 z-[6] flex items-center justify-center pointer-events-none"
        style={{ perspective: "1200px" }}
      >
        {COPY_SEQUENCE.map((item, i) => (
          <div
            key={i}
            ref={(el) => { copyRefs.current[i] = el; }}
            className="absolute text-center will-change-transform"
            style={{
              opacity: 0,
              transformStyle: "preserve-3d",
            }}
          >
            {item.type === "title" ? (
              <h1 className="text-hero text-white drop-shadow-[0_4px_60px_rgba(200,169,106,0.35)]">
                {item.text}
              </h1>
            ) : item.type === "accent" ? (
              <p className="font-editorial italic text-[clamp(1.5rem,4vw,3.5rem)] text-[var(--champagne)] tracking-wide">
                {item.text}
              </p>
            ) : (
              <p className="text-hero-sub text-white/90 font-light max-w-[60vw]">
                {item.text}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Final editorial text block */}
      <div
        ref={finalTextRef}
        className="absolute bottom-0 left-0 right-0 z-[7] flex flex-col items-center justify-end pb-20 pointer-events-none opacity-0"
      >
        <p className="text-section-label mb-4 text-[var(--muted-ink)]">PRIVATE ARCHITECTURAL WORLDS</p>
        <h2 className="font-editorial italic text-[clamp(1.25rem,2.5vw,2rem)] text-[var(--ink)] text-center max-w-lg leading-relaxed">
          Luxury is not decoration &mdash; it is precision made emotional.
        </h2>
      </div>
    </section>
  );
}
