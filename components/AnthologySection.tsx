"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const PROJECTS = [
  {
    id: "villa-solaris",
    title: "Villa Solaris",
    location: "Santorini, Greece",
    year: "2024",
    category: "Private Residence",
    description: "A clifftop sanctuary where volcanic stone meets infinite horizon. Every room frames the Aegean as living art.",
    image: "/images/projects/villa-01.webp",
    stats: { area: "2,400 m\u00B2", duration: "36 months", materials: "Basalt, Bronze, Glass" },
  },
  {
    id: "tower-meridian",
    title: "Tower Meridian",
    location: "Dubai, UAE",
    year: "2023",
    category: "Luxury Tower",
    description: "A 62-storey vertical garden that breathes. Living walls cascade through sky lobbies, defying desert expectations.",
    image: "/images/projects/tower-01.webp",
    stats: { area: "48,000 m\u00B2", duration: "48 months", materials: "Titanium, Marble, Cedar" },
  },
  {
    id: "estate-umbra",
    title: "Estate Umbra",
    location: "Kyoto, Japan",
    year: "2024",
    category: "Private Estate",
    description: "Where Japanese silence meets European scale. A compound of shadows, water, and ancient timber reimagined.",
    image: "/images/projects/estate-01.webp",
    stats: { area: "5,800 m\u00B2", duration: "42 months", materials: "Hinoki, Granite, Steel" },
  },
];

export default function AnthologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Parallax for each card image
      const cards = track.querySelectorAll(".anthology-card");
      cards.forEach((card) => {
        const img = card.querySelector(".anthology-img") as HTMLElement;
        if (img) {
          gsap.fromTo(
            img,
            { x: "-15%" },
            {
              x: "15%",
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "left right",
                end: "right left",
                scrub: true,
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
      id="anthology"
      className="relative overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* Section label */}
      <div className="absolute top-12 left-12 z-20">
        <div className="text-section-label text-[var(--stone)]">
          <span className="inline-block w-6 h-[1px] bg-[var(--champagne)] mr-3 align-middle" />
          SELECTED WORLDS
        </div>
      </div>

      {/* Counter */}
      <div className="absolute top-12 right-12 z-20">
        <span className="text-[var(--stone)] font-mono text-xs tracking-widest">
          {hoveredIndex !== null ? `0${hoveredIndex + 1}` : "01"} / 0{PROJECTS.length}
        </span>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex items-stretch h-screen will-change-transform"
        style={{ width: `${PROJECTS.length * 80 + 40}vw` }}
      >
        {/* Leading spacer */}
        <div className="flex-shrink-0 w-[15vw] flex items-center justify-center">
          <h2 className="text-section-title text-[var(--cloud)] font-display -rotate-90 whitespace-nowrap">
            Anthology
          </h2>
        </div>

        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className="anthology-card flex-shrink-0 w-[65vw] md:w-[55vw] h-full flex items-center px-8"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden group cursor-pointer">
              {/* Image container with parallax */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="anthology-img absolute inset-[-20%] bg-cover bg-center transition-transform duration-700 ease-out"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(23,19,15,0.45) 0%, rgba(138,106,62,0.15) 50%, rgba(23,19,15,0.65) 100%), url(${project.image})`,
                  }}
                />
              </div>

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(23,19,15,0.85)] via-[rgba(23,19,15,0.2)] to-transparent z-10" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                {/* Category + Year */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[var(--champagne)] text-xs tracking-[0.2em] uppercase font-medium">
                    {project.category}
                  </span>
                  <span className="w-6 h-[1px] bg-[var(--stone)]" />
                  <span className="text-[var(--stone)] text-xs tracking-widest font-mono">
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[clamp(2rem,4vw,4rem)] font-display font-bold text-white leading-[0.9] tracking-tight mb-3">
                  {project.title}
                </h3>

                {/* Location */}
                <p className="font-editorial italic text-[var(--champagne)] text-lg mb-4">
                  {project.location}
                </p>

                {/* Description - reveals on hover */}
                <div className="overflow-hidden">
                  <p className="text-white/60 text-sm leading-relaxed max-w-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    {project.description}
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex gap-8 mt-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 ease-out">
                  {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[var(--stone)] text-[10px] uppercase tracking-[0.15em] block mb-1">
                        {key}
                      </span>
                      <span className="text-white/80 text-sm font-light">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="var(--champagne)" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {/* Trailing spacer */}
        <div className="flex-shrink-0 w-[15vw]" />
      </div>
    </section>
  );
}
