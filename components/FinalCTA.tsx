"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { X } from "lucide-react";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; life: number;
  }>>([]);
  const rafRef = useRef<number>(0);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4,
        life: Math.random(),
      });
    }

    const animate = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;

      ctx.clearRect(0, 0, cw, ch);

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.002;

        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * cw;
          p.y = ch + 10;
          p.life = 0;
        }
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;

        const fadeIn = Math.min(p.life * 4, 1);
        const fadeOut = Math.max(1 - (p.life - 0.7) * 3.3, 0);
        const alpha = p.opacity * fadeIn * (p.life > 0.7 ? fadeOut : 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 169, 106, ${alpha})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Scroll animation
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 80 },
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

    return () => ctx.revert();
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="cta"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "var(--background)" }}
      >
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(200,169,106,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div ref={contentRef} className="relative z-10 text-center max-w-3xl px-8">
          <div className="text-section-label mb-8">
            <span className="inline-block w-8 h-[1px] bg-[var(--champagne)] mr-3 align-middle" />
            BEGIN YOUR WORLD
            <span className="inline-block w-8 h-[1px] bg-[var(--champagne)] ml-3 align-middle" />
          </div>

          <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-display font-bold text-[var(--ink)] leading-[0.88] tracking-tight mb-6">
            Ready to be
            <br />
            <span className="font-editorial italic font-normal text-[var(--bronze)]">
              moved?
            </span>
          </h2>

          <p className="text-[var(--muted-ink)] text-section-body max-w-lg mx-auto mb-12 leading-relaxed">
            Every AUREON project begins with a conversation. Not a brief, not a
            contract &mdash; a conversation about who you are and what world you
            deserve.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="magnetic-area group relative px-10 py-4 rounded-full border border-[var(--bronze)] text-[var(--ink)] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[var(--ink)] hover:text-[var(--cloud)] hover:border-[var(--ink)] transition-all duration-700 ease-[var(--ease-aureon)]"
          >
            <span className="relative z-10">Request Consultation</span>
            <div className="absolute inset-0 rounded-full bg-[rgba(200,169,106,0.05)] group-hover:bg-transparent transition-colors duration-700" />
          </button>

          {/* Bottom accent */}
          <div className="mt-20 flex flex-col items-center gap-4">
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--champagne)] to-transparent" />
            <p className="text-[var(--stone)] text-[10px] tracking-[0.3em] uppercase">
              AUREON &mdash; Since MMXVIII
            </p>
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[rgba(23,19,15,0.85)] backdrop-blur-md" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg mx-4 bg-[var(--surface)] rounded-2xl p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(200,169,106,0.1)] transition-colors duration-300"
                aria-label="Close modal"
              >
                <X size={16} className="text-[var(--muted-ink)]" />
              </button>

              <div className="text-section-label text-[var(--champagne)] mb-3">
                PRIVATE CONSULTATION
              </div>
              <h3 className="text-2xl font-display font-bold text-[var(--ink)] mb-2 tracking-tight">
                Begin your world
              </h3>
              <p className="text-[var(--muted-ink)] text-sm mb-8">
                Share a few details and our creative director will reach out within 48 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-transparent border-b border-[var(--stone)] py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)] focus:border-[var(--champagne)] focus:outline-none transition-colors duration-300"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent border-b border-[var(--stone)] py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)] focus:border-[var(--champagne)] focus:outline-none transition-colors duration-300"
                    required
                  />
                </div>
                <div>
                  <select
                    className="w-full bg-transparent border-b border-[var(--stone)] py-3 text-sm text-[var(--stone)] focus:border-[var(--champagne)] focus:outline-none transition-colors duration-300 cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Interest
                    </option>
                    <option value="buy">Commission a World</option>
                    <option value="rent">Temporary Residence</option>
                    <option value="sell">Legacy Transfer</option>
                    <option value="consult">General Consultation</option>
                  </select>
                </div>
                <div>
                  <textarea
                    placeholder="Tell us about your vision..."
                    rows={3}
                    className="w-full bg-transparent border-b border-[var(--stone)] py-3 text-sm text-[var(--ink)] placeholder:text-[var(--stone)] focus:border-[var(--champagne)] focus:outline-none transition-colors duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[var(--ink)] text-[var(--cloud)] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[var(--bronze)] transition-colors duration-500 mt-4"
                >
                  Submit Request
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
