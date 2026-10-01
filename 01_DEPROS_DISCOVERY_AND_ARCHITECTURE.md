# DEPROS Portfolio Website — Discovery & Architecture Proposal
**Document:** `01_DEPROS_DISCOVERY_AND_ARCHITECTURE.md`  
**Status:** Ready for Review  
**Source of Truth:** `PF DEPROS 2026_B.pdf` & `DEPROS_WEBSITE_BLUEPRINT.md`  
**Digital Interaction Reference:** Poch Studio (Interaction / motion rhythm only)

---

## 1. Source Analysis

The primary source material (`PF DEPROS 2026_B.pdf`, 21 pages) documents DEPROS as a Bali-based boutique design and brand development studio driven by clarity, confidence, and intentional restraint.

### Studio Information & Positioning
- **Studio Name:** DEPROS (Design & Brand Development)
- **Base / Location:** Bali, Indonesia
- **Core Manifesto:** *"Confident in Vision. Disruptive by Design. Intentional in Every Detail."* / *"Challenge the Usual. Break the Expected."* / *"We believe strong brands are built through restraint — where simplicity becomes the foundation for bold, memorable statements."*
- **Contact Channels:**
  - Email: `depros.bali@gmail.com`
  - WhatsApp / Tel: `+62 (0) 8180 5588 333` / `+62 (0) 8123 9584 802`

### Core Services
1. Brand Development
2. Creative Direction
3. Graphic Design
4. Product Design (Packaging)
5. Digital Marketing
6. Social Media Concept & Content
7. Print-Ready Artwork / Sales Tools

### Portfolio Content & Taxonomy Extracted from Source
| # | Category | Featured Projects in PDF | Key Clients |
|---|---|---|---|
| 01 | **Product Design** | Janus Bifrous (Herbs Liqueur), Coco Flamingo (Coconut Liqueur), Kraken Rum (Jamaican Style Rum), Blonde & Golden Ale (Craft Beer), Locale Fruit Wine, Mini Liqueur Party (Special Edition), Berassa (Rice Crispy Snack), Arin (Arak Liqueur) | Locale Brewery, Gumindo Bogamanis, Arin |
| 02 | **Brand Identity** | Mitra Kopling (Komunitas Pedagang Kopi Keliling) | Kapal Api |
| 03 | **Logos** | Rija Hotels, Torrence Land & Cattle, Treasure Supreme High, SkyHigh, Complete VIP Concierge, Fab Master, Mimesa, Antidote, Millimeter Workshop, Lucky Fox, Bali Boo, Copalhead, Kopi Rakjat, Cassia, Paron Coffee, Etan, Anabasii | Various Local & Regional Brands |
| 04 | **Corporate Identity** | Whysuper (Corporate Stationery & System), Millimeter Workshop (Brand Guidelines) | Whysuper, Millimeter Workshop |
| 05 | **Marketing Kit** | E-Book Marketing Kit, Service Kit / Sales Tools | Eco Mailing London, Suit Solution Group (NetSuite) |
| 06 | **Graphic & Visual** | Floor & Wall Graphics, Visual Cards, Environmental Signage | Bounce Bali Trampoline Centre, etc. |
| 07 | **Social Media Content** | Locale Instagram Feeds, Kopi Tungku Stories | Locale Brewery, Kopi Tungku |

### Notable Client Record
11+ prominent hospitality and enterprise clients including *Nusa Dua Beach Hotel, Westin Nusa Dua, Niko Bali, Sunset Island Property, Waterbom Bali, 3V Villas Kerobokan, 3V Resort Rening, Sundays Beach Club, Aloita Resort Batam, Finns Beach Club, Finns Recreation Club, and Bisma Cottages Ubud*.

---

## 2. Visual DNA Summary

The visual character of DEPROS is bold, editorial, structured, and unpretentious.

```
┌────────────────────────────────────────────────────────────────────────┐
│  DEPROS PALETTE                                                        │
│  ■ Primary Orange   : #FF4600 / #FF4500 (Vibrant, confident hero field)│
│  ■ Pure Black       : #0D0D0D / #000000 (Typographic weight & contrast)│
│  ■ Crisp White      : #FFFFFF (Spacious canvas & negative space)       │
│  ■ Light Gray / Muted: #F4F4F4 / #E8E8E8 (Subtle structural borders)   │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Graphic Motifs & Styling Rules
1. **The Diagonal Slash (`/`)**: Used consistently across logos, numbering (`01 / DEP ROS`), and divider marks.
2. **Section Numbering & Monospaced Indexing**: Strict `01 / DEP ROS`, `02 / DEP ROS` prefixes.
3. **Typography**:
   - **Display / Headers**: Condensed, bold, tight geometric or sans-serif (uppercase display with wide tracking for subheadings like `S T U D I O   P R O F I L E`).
   - **Body & Metadata**: Clean, high-legibility geometric sans-serif (e.g. Inter / Space Grotesk / Plus Jakarta Sans) paired with monospaced small metadata caps.
4. **Editorial Composition**: Clean hairline horizontal dividers (`1px solid #000000` or `#E5E5E5`), asymmetric multi-column grids, and generous negative space around high-contrast imagery.
5. **Micro Graphic Accents**: Small geometric coordinates (`. + o`), minimalist metadata tags (`VOL 350ml`, `21+`, `Ja`).

---

## 3. Website Structure

A streamlined 4-view information architecture without unnecessary sub-pages:

```
DEPROS PORTFOLIO
│
├── / (HOME)
│   ├── Hero Section (Statement, dynamic brand mark, direct contact trigger)
│   ├── Selected Work (Curated project showcase with direct category jumps)
│   ├── Services & Capabilities (What We Do overview)
│   ├── Studio Summary & Selected Clients (Notable clients grid)
│   └── Contact Section ("LET'S DO IT" direct engagement CTA)
│
├── /work (WORK ARCHIVE & FILTER)
│   ├── Category Filter Tabs (All, Product Design, Brand Identity, Logos, Corporate Identity, Marketing Kit, Graphic & Visual, Social Media)
│   └── Responsive Project Grid / Editorial Index
│
├── /work/[slug] (PROJECT DETAIL)
│   ├── Project Header (Index, Category, Client, Scope, Year, Short Pitch)
│   ├── Hero Showcase (Large-format imagery)
│   ├── Editorial Layout / Gallery (Curated image sequence)
│   └── Next Project Navigation (Seamless continuous browsing)
│
├── /studio (STUDIO & MANIFESTO)
│   ├── Full Manifesto & Philosophy
│   ├── Detailed Capabilities Breakdown
│   ├── Complete Notable Client Directory
│   └── Studio Location (Bali, Indonesia)
│
└── /contact (CONTACT)
    ├── Direct Email (`depros.bali@gmail.com`)
    ├── Direct WhatsApp / Phone access
    └── Studio Location & Project Inquiry Form/Trigger
```

---

## 4. Portfolio & Content Model

Kept practical, flat, and maintainable. Supports Level 2 CMS capability (content + presentation sequencing):

```typescript
interface Project {
  id: string;
  title: string;          // e.g. "Janus Bifrous"
  subtitle?: string;       // e.g. "Herbs Liqueur"
  slug: string;           // e.g. "janus-bifrous"
  category: CategorySlug; // "product-design" | "brand-identity" | "logos" | ...
  clientName: string;     // e.g. "Locale Brewery"
  clientLogo?: string;
  scopeOfWork: string[];  // ["Packaging Design", "Illustration", "Print Artwork"]
  industry?: string;      // "Beverage & Hospitality"
  location?: string;      // "Bali, Indonesia"
  year: string;           // "2024"
  summary: string;        // Short editorial pitch from PDF
  heroImage: {
    url: string;
    alt: string;
    aspectRatio?: string;
  };
  gallery: Array<{
    url: string;
    alt: string;
    caption?: string;
    layout?: "full" | "half" | "third" | "editorial-stack";
  }>;
  featured: boolean;      // For homepage selected work
  featuredOrder?: number; // Ordering on homepage
  order: number;          // Archive sorting index
  status: "published" | "draft";
}

interface Client {
  id: string;
  name: string;           // e.g. "Finns Beach Club"
  scope: string;          // e.g. "Brand Identity, Visual Assets & Art Directions"
  industry: string;       // e.g. "Hospitality"
  location: string;       // e.g. "Canggu Bali"
  logo?: string;
  order: number;
}
```

---

## 5. CMS Recommendation

### Recommendation: **Decap CMS (formerly Netlify CMS) / Static Markdown CMS** OR **Sanity.io (Free Tier)**

**Selected Strategy for Simplicity & Zero-Maintenance:**
- **Primary Recommendation: Local Markdown/Contentlayer or Decap CMS (Git-based)**
  - *Why:* Zero server bills, zero database maintenance, content lives in GitHub repo, instant local previews, automatic deployment via Vercel.
  - *Control:* Exposes fields for all metadata, image uploads, featured flags, and drag-and-drop ordering without allowing arbitrary layout destruction.
- **Alternative if Client Demands Cloud UI:** **Sanity.io** (configured strictly with rigid schemas matching the project model).

*CMS Limitation Guardrail:* The CMS will only manage structured data and image assets. All typographic styling, grid behaviors, and transitions remain strictly locked in code.

---

## 6. Simple Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Logo, nav links (Work, Studio, Contact), quick status
│   │   ├── Footer.tsx           # Contact details, Bali tag, copyright, back-to-top
│   │   └── SectionContainer.tsx # Consistent grid margins & padding
│   ├── brand/
│   │   ├── DeprosLogo.tsx       # SVG vector logo mark with "/" motif
│   │   ├── SlashDivider.tsx     # Reusable slash indicator
│   │   └── SectionHeader.tsx    # "01 / DEP ROS [CATEGORY]" standardized header
│   ├── portfolio/
│   │   ├── ProjectCard.tsx      # Hover-reactive editorial card
│   │   ├── ProjectGrid.tsx      # Responsive multi-column layout
│   │   ├── CategoryFilter.tsx   # Clean category pill/tab selector
│   │   ├── ProjectHero.tsx      # High-impact detail header & intro
│   │   ├── ProjectGallery.tsx   # Adaptive gallery layouts (full/split/detail)
│   │   └── NextProject.tsx      # Seamless next-case study link
│   ├── studio/
│   │   ├── ManifestoBlock.tsx   # Typographic statement layout
│   │   ├── ServicesList.tsx     # Clean accordion/list of capabilities
│   │   └── ClientTable.tsx      # Structured client index from PDF
│   └── ui/
│       ├── Button.tsx           # Editorial pill / underline CTA
│       └── TransitionReveal.tsx # Restrained fade/clip wrapper
```

---

## 7. Motion Approach (Restrained & Editorial)

Studied from Poch Studio's rhythm, but adapted to DEPROS's bold typographic identity:

- **Choreography Model:** `REST → REVEAL → SETTLE` (never continuous wandering animation).
- **Page Transitions:** Crisp opacity/translate reveal on route changes (no disorienting screen sweeps).
- **Image Reveal:** Clean vertical clip-path or gentle scale (`1.04` to `1.0`) on viewport intersection.
- **Card Hover:** Subtle image brightness or subtle zoom accompanied by instant typography micro-shift.
- **Header:** Lightweight sticky bar with backdrop blur and hairline divider.
- **Strict Guardrails:** No custom trailing cursor, no heavy 3D WebGL scenes, no constant background animations. All motion strictly honors `prefers-reduced-motion`.

---

## 8. Responsive Approach

- **Desktop (1200px+)**: Dynamic multi-column editorial spreads reflecting the magazine-like layout of the PDF.
- **Tablet (768px – 1199px)**: 2-column balanced grid, preserved horizontal rules, legible metadata stacks.
- **Mobile (< 768px)**:
  - Preserved section numbering (`01 / DEP ROS`) and slash motifs.
  - Full-bleed image impact with generous touch targets.
  - Client table converts into clean, scannable cards/list items.
  - Sticky bottom or compact top navigation for friction-free browsing.

---

## 9. Recommended Tech Stack

| Layer | Tool | Rationale |
|---|---|---|
| **Framework** | **Next.js 15 (App Router)** | Excellent image optimization (`next/image`), static generation for blazing speed, built-in SEO. |
| **Language** | **TypeScript** | Strict typing for portfolio records, zero runtime overhead. |
| **Styling** | **Tailwind CSS v4 / Vanilla CSS Variables** | Fast utility development with centralized DEPROS design tokens (colors, fonts, rules). |
| **Animation** | **Motion (Framer Motion)** | Lightweight, reliable scroll/viewport triggers and layout animations. |
| **Icons & Assets** | **Lucide Icons & SVG Vectors** | Minimal, sharp, zero external weight. |
| **Hosting** | **Vercel** | Instant automated deploys, global edge CDN for high-resolution packaging imagery. |

---

## 10. Suggested Project Folder Structure

```
depros-website/
├── content/
│   ├── projects/           # Markdown / JSON records for all portfolio items
│   └── clients.json        # Structured client records from PDF
├── public/
│   ├── images/
│   │   ├── projects/       # Extracted & optimized high-res portfolio images
│   │   └── branding/       # Logos, icons, vector accents
│   └── fonts/              # Custom brand typography
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout (Header, Footer, Font definitions)
│   │   ├── page.tsx        # Homepage
│   │   ├── work/
│   │   │   ├── page.tsx    # Portfolio archive & filter
│   │   │   └── [slug]/
│   │   │       └── page.tsx# Project detail case study
│   │   ├── studio/
│   │   │   └── page.tsx    # Studio & Manifesto
│   │   ├── contact/
│   │   │   └── page.tsx    # Contact view
│   │   └── globals.css     # Design tokens & base typographic styles
│   ├── components/         # Modular UI components (as listed in Section 6)
│   ├── lib/
│   │   ├── projects.ts     # Content fetching & sorting utilities
│   │   └── types.ts        # TypeScript interfaces
│   └── styles/
│       └── tokens.css      # Core brand variables (colors, spacing, rules)
├── package.json
└── tsconfig.json
```

---

## 11. Implementation Phases

1. **Phase 1: Project Setup & Design Token Foundation**
   - Initialize clean Next.js + TypeScript environment.
   - Configure DEPROS color tokens (`#FF4600`, black, white), typography scale, and hairline dividers.
2. **Phase 2: Asset Extraction & Content Seeding**
   - Extract imagery from PDF into optimized WebP assets.
   - Populate local structured project data for all 7 categories and 12+ client records.
3. **Phase 3: Core Component Development**
   - Implement Header, Footer, Brand Mark, Section Labels, Project Cards, and Client Tables.
4. **Phase 4: Page Assembly & Route Construction**
   - Build Homepage, Work Archive with interactive category filtering, Dynamic Case Study (`[slug]`), and Studio/Contact pages.
5. **Phase 5: Restrained Motion & Polish**
   - Add image reveal animations, hover states, and smooth route transitions.
6. **Phase 6: QA, Responsive Auditing & Launch Readiness**
   - Audit visual fidelity against the PDF across mobile, tablet, and desktop screens.

---

## 12. Important Decisions & Assumptions

1. **Asset Source**: High-resolution project imagery will be extracted directly from the PDF vector/raster streams or optimized for digital display.
2. **Category Handling**: Categories are handled as instant client-side / URL-queried filters on `/work` rather than 7 distinct static pages to keep navigation fast and intuitive.
3. **Contact Action**: The "LET'S DO IT" and Contact triggers link directly to email (`mailto:depros.bali@gmail.com`) and direct WhatsApp chat, matching the direct boutique studio workflow.
4. **No Premature Complexity**: We will avoid building heavy custom CMS backends or backend databases until the core frontend portfolio experience is built and approved.

---
*Ready for user review before proceeding to implementation.*
