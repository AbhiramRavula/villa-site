# AUREON — Private Architectural Worlds

> **Live Demo:** [villa-site-two.vercel.app](https://villa-site-two.vercel.app/)

<p align="center">
  <video src="public/aureon-preview.mp4" width="100%" controls autoplay loop muted></video>
</p>

Aureon is a premium, cinematic architectural portfolio showcase designed to offer a luxurious, immersive storytelling experience. Built around a core philosophy that _“luxury is not decoration — it is precision made emotional”_, the site combines high-end WebGL graphics, scroll-driven physics/timelines, smooth scrolling, and custom typography to frame architecture as the ultimate private world.

---

## 🏗️ Tech Stack & Key Libraries

Aureon is built on a modern, high-performance web stack optimized for smooth rendering, cinematic animations, and responsive interactions:

- **Core Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript, React 18)
- **Styling Engine**: [Tailwind CSS](https://tailwindcss.com/) & custom CSS Custom Properties (Vanilla CSS tokens)
- **Physics-Synced Smooth Scroll**: [Lenis Scroll](https://github.com/darkroomengineering/lenis)
- **Timeline & Scroll-Driven Animations**: [GSAP (GreenSock Animation Platform)](https://gsap.com/) & [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- **Interactive 3D Graphics**: [Three.js](https://threejs.org/) via React Three Fiber ([@react-three/fiber](https://github.com/pmndrs/react-three-fiber)) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Motion Transitions**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🎨 Design System & Aesthetics (`app/globals.css` & `tailwind.config.ts`)

Aureon adopts a premium, warm-neutral palette that feels grounded, refined, and editorial:

### Harmonious Color Palette

- `--background` / `bg-background`: `#F5EFE4` (Warm Mist / Cream)
- `--surface` / `bg-surface`: `#FFF8EE` (Warm White / Alabaster)
- `--stone` / `text-stone`: `#D8C3A5` (Neutral Grayish-Gold)
- `--champagne` / `text-champagne`: `#C8A96A` (Primary Metallic Gold accent)
- `--bronze` / `text-bronze`: `#8A6A3E` (Darker Metallic Bronze accent)
- `--ink` / `text-ink`: `#17130F` (Cinematic Warm Black)
- `--muted-ink` / `text-muted-ink`: `#6F6558` (Softer Olive-Brown)
- `--cloud` / `text-cloud`: `#FFFFFF` (Pure White)

### Typography Hierarchy

- **Sans & Display Fonts**: `Inter` (geometric, clean layout structure)
- **Editorial Serif Font**: `Cormorant Garamond` (high-contrast, italic, luxurious headings)
- **Hero Headers**: Large clamped headers (`text-hero` / `clamp(4rem, 10vw, 11rem)`) with high tracking adjustments.

### Layout Grid & Transitions

- **Spacing Grid**: Strict 8px-base layout system (`--space-1` to `--space-24`).
- **Signature Easings**: Smooth custom ease cubic-bezier curves (`--ease-aureon`: `cubic-bezier(0.25, 0.1, 0.25, 1)`).

---

## 🌟 Interactive Experience & Features

Aureon is built with unique cinematic features that create a tactile connection between user interaction and page layout:

1.  **Asset-Synced Preloader (`Preloader.tsx`)**:
    Monitors the preloading status of the 192 cinematic frames and plays an elegant fading entrance animation once loaded, blocking standard scroll input until the environment is fully initialized.
2.  **Cinematic Hero Canvas (`HeroSection.tsx`)**:
    Integrates a canvas frame-by-frame player that preloads 192 sequential high-quality images. The sequence is bound directly to ScrollTrigger, translating scroll coordinates into film frames. Features multiple parallax fog layers (`cloud-overlay.png`) and 3D copy offsets on scroll.
3.  **Scroll-Driven Manifesto (`ManifestoSection.tsx`)**:
    Highlights the core architectural philosophy, fading individual words into high-contrast `--ink` colors letter-by-letter as the user scrolls, creating a rhythmic reading pace.
4.  **Horizontal Anthology Track (`AnthologySection.tsx`)**:
    Translates vertical scrolls into a seamless horizontal project slider. Features individual card parallax image offsets and hovering stat reveals for key projects (_Villa Solaris_, _Tower Meridian_, _Estate Umbra_).
5.  **WebGL Architectural Sculpture (`CraftSection.tsx` & `ThreeArchitecturalFragment.tsx`)**:
    Synthesizes standard text panels with a WebGL canvas. A custom-modeled 3D abstract sculpture rotates and scales dynamically relative to the user's scroll speed, using React Three Fiber.
6.  **Signature Amenities Panel (`SignatureAmenitiesSection.tsx`)**:
    A detailed catalog of premium amenities (Thermal Spa, Art Vault, Infinity Edge Pool) with sliding curtains and scroll-triggered zoom transitions.
7.  **Dynamic Custom Cursor (`CustomCursor.tsx`)**:
    A customized client-side cursor combining a fast-following inner dot and a delayed, lagging outer circle that responds to coordinates (safely disabled on touch devices).
8.  **Consultation Request Portal (`FinalCTA.tsx`)**:
    A dark-ambient contact screen featuring custom canvas particle background noise. Clicking "Request Consultation" opens a Framer-Motion-animated popup form with full validation.

---

## 📁 Codebase Structure

```filepath
├── app/
│   ├── globals.css          # Design system base, variables, utility mappings, fonts
│   ├── layout.tsx           # Global Next.js wrapper and HTML shell settings
│   └── page.tsx             # Main page orchestrator (Lenis loop & ScrollTrigger setup)
├── components/
│   ├── ui/
│   │   ├── MagneticButton.tsx # Smooth hover magnet effect for buttons
│   │   ├── SectionLabel.tsx   # Premium horizontal divider lines
│   │   └── SplitTextReveal.tsx # Character reveal entrance animations
│   ├── AnthologySection.tsx   # Horizontal project timeline slider
│   ├── AtmosphereLayer.tsx    # Background floating particle overlays
│   ├── CraftSection.tsx       # Standard text blocks side-by-side with R3F WebGL Canvas
│   ├── CustomCursor.tsx       # Mouse tracking client-side circles
│   ├── FinalCTA.tsx           # Canvas particle footer & contact modal
│   ├── FloatingNav.tsx        # Scroll-aware navigation bar & mobile menus
│   ├── HeroSection.tsx        # Frame sequence player with parallax cloud-masks
│   ├── ManifestoSection.tsx   # Typography highlight trigger
│   ├── Preloader.tsx          # Initial entry loading bar percentage tracker
│   ├── PrivateAccessSection.tsx # Exclusive editorial split content
│   ├── ServicesSection.tsx    # Rhythmic grid layouts for design services
│   └── ThreeArchitecturalFragment.tsx # R3F Canvas and 3D architectural meshes
├── lib/
│   ├── gsap.ts              # GSAP Core initialization and ScrollTrigger plugin registration
│   ├── lenis.ts             # Lenis smooth scroll instances and setup hooks
│   └── utils.ts             # Performance helpers (Reduced Motion media checks, CSS merger)
├── public/
│   ├── hero-frames/         # 192 static sequential image frames for the canvas animation
│   └── images/              # Multi-scale project webp files, overlays, and catalog images
├── package.json             # Scripts & dependency declarations
└── tsconfig.json            # Strict TypeScript configuration
```

---

## 🚀 Getting Started & Execution

Follow these commands to configure the development environment or build the website for production:

### 1. Install Dependencies

Initialize the project package tree:

```bash
npm install
```

### 2. Run the Development Server

Launch a local development environment with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

### 3. Build for Production

Generate optimized static pages and bundled production files:

```bash
npm run build
```

### 4. Run Production Build

Start the production server locally on port 3000:

```bash
npm run start
```

### 5. Linting check

Run ESLint checkups:

```bash
npm run lint
```
