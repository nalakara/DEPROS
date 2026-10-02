# DEPROS Portfolio Content Audit

**Pass:** 05A / 05A.1 — Portfolio Content Audit & Presentation Taxonomy  
**Date:** October 2026  
**Auditor:** Antigravity AI  
**Repository:** `nalakara/DEPROS`  
**Target Output File:** `01_DEPROS_PORTFOLIO_CONTENT_AUDIT.md`  

---

## 1. Audit Scope

This document provides a factual, non-destructive content and asset audit comparing the source DEPROS portfolio presentation against the current repository state.

### Sources of Truth
1. **Primary Source:** `PF DEPROS 2026_B.pdf` (21-page portfolio deck).
2. **Secondary Source:** `01_DEPROS_DISCOVERY_AND_ARCHITECTURE.md` (Initial discovery and architectural breakdown).
3. **Repository State:** Current `main` branch codebase:
   - `src/lib/data.ts` (Data structures, project records, client list, services)
   - `src/lib/types.ts` (Type definitions for projects, images, framing)
   - `src/components/portfolio/` (`ProjectFraming.tsx`, `framingEngine.ts`, `ProjectCard.tsx`)
   - `public/images/projects/` (Extracted project assets and multi-image folders)
   - `public/images/extracted/` (Full-page PDF raster extractions)

### Audit Rules Applied
- **Audit-only:** No application code, schemas, components, styles, or assets were modified.
- **Terminology Preservation:** Verbatim text extraction from PDF pages without creative copywriting or extrapolation.
- **Strict Discrepancy Tracking:** Differences between the PDF and the architecture document are explicitly recorded without premature reconciliation.
- **Explicit Missing Attribution:** Missing information is flagged as `NOT FOUND IN SOURCE` or `REPO-SUPPLIED / NOT VERIFIED AGAINST PDF`.
- **Presentation Distinction:** Explicit distinction between **Standalone Project Presentations** and **Grouped / Showcase Presentations**.

---

## 2. PDF Portfolio Taxonomy

Extraction from `PF DEPROS 2026_B.pdf` across all 21 pages.

### Overview of PDF Structure
- **Page 01:** Cover — `STUDIO PROFILE / PORTFOLIO`
- **Page 02:** Introduction — `STUDIO PROFILE / Hello There! / WHAT WE DO`
- **Page 03:** Notable Clients — `NOTABLE CLIENTS` (12 client entries, numbered 1–11 with duplicate 7)
- **Page 04:** Portfolio Section Divider — `PORTFOLIO / "Good design is good business..."`
- **Pages 05–20:** Portfolio Works (16 distinct portfolio presentation units across 16 content pages)
- **Page 21:** Contact / Outro — `CONTACT / LETS DO IT`

### Full Catalog of PDF Portfolio Presentation Units (Pages 05–20)

Across the 16 portfolio content pages (Pages 05–20), there are **16 distinct portfolio presentation units**:
- **Pages 05–12 (8 units):** Product Design presentations
- **Page 13 (1 unit):** Brand Identity presentation
- **Page 14 (1 unit):** Logos presentation
- **Page 15 (1 unit):** Corporate Identity presentation
- **Page 16 (1 unit):** Marketing Kit presentation
- **Page 17 (1 unit):** Sales Tools presentation
- **Page 18 (1 unit):** Graphic & Visual presentation
- **Pages 19–20 (2 units):** Social Media Content presentations

| Page | Header Category on PDF | Presentation / Project Name (Verbatim) | Subtitle / Descriptor (Verbatim) | Client (Verbatim) | Scope / Layout Notes (Verbatim) | Presentation Type |
|---|---|---|---|---|---|---|
| **05** | `01 / DEP ROS`<br>`PRODUCT DESIGN` | `JANUS BIFROUS` | `Artisan Beer` | `Locale Brewery` | Multi-image spread: 3 bottle visual panels + top identity badge | **Standalone Project Presentation** |
| **06** | `PRODUCT DESIGN` *(continued)* | `COCO FLAMINGO` | `Summer Pale Ale` | `Locale Brewery` | Multi-image spread: Flamingo artwork, beach scene, 3-can lineup | **Standalone Project Presentation** |
| **07** | `PRODUCT DESIGN` *(continued)* | `KRAKEN RUM` | `Spiced Rum Edition` | `Locale Brewery` | Multi-image spread: 2 bottle shots + cocktail lifestyle scene | **Standalone Project Presentation** |
| **08** | `PRODUCT DESIGN` *(continued)* | `BLONDE ALE / GOLDEN ALE` | `Craft Beer Series` | `Locale Brewery` | Multi-can / bottle lineup rendering | **Standalone Project Presentation** |
| **09** | `PRODUCT DESIGN` *(continued)* | `LOCALE FRUIT WINE` | `Cultured Beverages` | `Locale Brewery` | Single composite product visual (cider/fruit wine bottle lineup) | **Standalone Project Presentation** |
| **10** | `PRODUCT DESIGN` *(continued)* | `MINI LIQUEUR PARTY` | `Event Edition Series` | `Locale Brewery` | Single composite product visual (mini shot bottle set) | **Standalone Project Presentation** |
| **11** | `PRODUCT DESIGN` *(continued)* | `BERASSA SNACK` | `Modern Heritage Snack` | `Gumindo Bogamanis` | Single composite packaging pouch visual | **Standalone Project Presentation** |
| **12** | `PRODUCT DESIGN` *(continued)* | `ARIN ARAK LIQUEUR` | `Traditional Spirit Redesign` | `Arin` | Single composite bottle & packaging rendering | **Standalone Project Presentation** |
| **13** | `02 / DEP ROS`<br>`BRAND IDENTITY` | `MITRA KOPLING` | `Identity System & Brand Implementation` | `Kapal Api` | Multi-image spread: Brand guidelines book, merchandise, apparel | **Standalone Project Presentation** |
| **14** | `03 / DEP ROS`<br>`LOGOS` | `LOGOS COLLECTION` *(implicit title on page)* | `Selected Marks & Symbols (2020–2026)` *(PDF: grid of marks)* | Multiple / Various | Multi-logo showcase grid featuring: Kopi Tungku, Dapoer Bu Gendut, Locale, Suite, etc. | **Grouped / Showcase Presentation** |
| **15** | `04 / DEP ROS`<br>`CORPORATE IDENTITY` | `WHYSUPER & MILLIMETER` | `Brand System, Stationery & Guidelines` | `Whysuper / Millimeter` | Multi-image spread: Corporate stationery, business cards, identity manual | **Standalone Project Presentation** |
| **16** | `MARKETING KIT` *(no category number printed on PDF)* | `E-BOOK MARKETING KIT` | `Comprehensive Guide` | `Eco Mailing` | Single composite visual: Digital tablet / e-book mockup | **Standalone Project Presentation** |
| **17** | `SALES TOOLS` *(no category number printed on PDF)* | `SERVICE KIT SALES TOOLS` | `B2B Sales Presentation` | `Suit Solution Group` | Single composite visual: Printed / digital deck layout | **Standalone Project Presentation** |
| **18** | `GRAPHIC & VISUAL` *(no category number printed on PDF)* | `FLOOR / WALL IMAGES / VISUAL CARD / GRAPHIC & ELSE` | `Environmental & Spatial Graphic Design` | Various local brands | Multi-asset visual collage (environmental graphics, retail signs, cards) | **Grouped / Showcase Presentation** |
| **19** | `05/ DEP ROS`<br>`SOCIAL MEDIA CONTENT` | `LOCALE INSTAGRAM FEEDS` | `Visual Grid Strategy & Content Creation` | `Locale Brewery` | Single composite visual (Instagram 9-grid feed layout) | **Standalone Project Presentation** |
| **20** | `SOCIAL MEDIA CONTENT` *(continued)* | `KOPI TUNGKU INSTAGRAM STORY` | `Daily Content & Promotional Stories` | `Kopi Tungku` | Single composite visual (mobile story screen series) | **Standalone Project Presentation** |

### Breakdown by Presentation Type
- **Standalone Project Presentations (14 items):**
  1. Janus Bifrous (Page 05)
  2. Coco Flamingo (Page 06)
  3. Kraken Rum (Page 07)
  4. Blonde Ale / Golden Ale (Page 08)
  5. Locale Fruit Wine (Page 09)
  6. Mini Liqueur Party (Page 10)
  7. Berassa Snack (Page 11)
  8. Arin Arak Liqueur (Page 12)
  9. Mitra Kopling (Page 13)
  10. Whysuper & Millimeter (Page 15)
  11. E-Book Marketing Kit (Page 16)
  12. Service Kit Sales Tools (Page 17)
  13. Locale Instagram Feeds (Page 19)
  14. Kopi Tungku Instagram Story (Page 20)
- **Grouped / Showcase Presentations (2 items):**
  15. Logos Collection (Page 14) — Grid of marks/symbols across multiple clients
  16. Graphic & Visual (Floor / Wall Images / Visual Card / Graphic & Else) (Page 18) — Environmental & spatial collage

---

## 3. Repository Portfolio Inventory

Inspection of current repository data in `src/lib/data.ts`.

### Currently Defined Projects in `FEATURED_PROJECTS` (Total: 5)

#### Record 1: `janus-bifrous`
- **ID / Slug:** `janus-bifrous`
- **Title:** `Janus Bifrous`
- **Subtitle:** `Artisan Beer Packaging`
- **Category:** `Product Design`
- **Client:** `Locale Brewery`
- **Year:** `2024`
- **Description:** `A dual-faced artisan beer packaging design exploring symmetry, mythology, and botanical textures. Built with tactile label materials and bespoke heraldic illustration.` *(REPO-SUPPLIED / NOT VERIFIED AGAINST PDF)*
- **Scope:** `["Label Design", "Illustration", "Print Production", "Brand Identity"]`
- **Legacy Image Field (`image`):** `/images/projects/janus-bifrous/hero.png`
- **Images Array (`images`):** 3 items:
  1. `/images/projects/janus-bifrous/bottle-left.png` (714x795, ratio 0.898, role: primary)
  2. `/images/projects/janus-bifrous/circle-detail.png` (595x795, ratio 0.748, role: detail)
  3. `/images/projects/janus-bifrous/bottle-right.png` (595x795, ratio 0.748, role: supporting)
- **Framing Config (`framingConfig`):** `mode: 'auto', mobileStack: true, gap: 'md'`

#### Record 2: `coco-flamingo`
- **ID / Slug:** `coco-flamingo`
- **Title:** `Coco Flamingo`
- **Subtitle:** `Summer Pale Ale Series`
- **Category:** `Product Design`
- **Client:** `Locale Brewery`
- **Year:** `2024`
- **Description:** `Vibrant, sun-drenched visual identity and can packaging for a tropical pale ale series. Combining bold avian illustration with retro-modern typography.` *(REPO-SUPPLIED / NOT VERIFIED AGAINST PDF)*
- **Scope:** `["Can Packaging", "Key Visual", "Art Direction", "Merchandise"]`
- **Legacy Image Field (`image`):** `/images/projects/coco-flamingo/hero.png`
- **Images Array (`images`):** 3 items:
  1. `/images/projects/coco-flamingo/flamingo-art.png` (516x886, ratio 0.582, role: primary)
  2. `/images/projects/coco-flamingo/bottle-center.png` (733x886, ratio 0.827, role: primary)
  3. `/images/projects/coco-flamingo/beach-bottles.png` (654x886, ratio 0.738, role: supporting)
- **Framing Config (`framingConfig`):** `mode: 'auto', mobileStack: true, gap: 'md'`

#### Record 3: `kraken-rum`
- **ID / Slug:** `kraken-rum`
- **Title:** `Kraken Rum`
- **Subtitle:** `Spiced Rum Edition`
- **Category:** `Product Design`
- **Client:** `Locale Brewery`
- **Year:** `2023`
- **Description:** `Dark, ornate bottle packaging and label typography inspired by deep-sea nautical folklore and Victorian engraved bookplates.` *(REPO-SUPPLIED / NOT VERIFIED AGAINST PDF)*
- **Scope:** `["Bottle Packaging", "Embossed Label", "Custom Typography", "Box Design"]`
- **Legacy Image Field (`image`):** `/images/projects/kraken-rum/hero.png`
- **Images Array (`images`):** 3 items:
  1. `/images/projects/kraken-rum/bottle-left.png` (615x886, ratio 0.694, role: primary)
  2. `/images/projects/kraken-rum/bottle-center.png` (674x886, ratio 0.761, role: detail)
  3. `/images/projects/kraken-rum/lifestyle-right.png` (615x886, ratio 0.694, role: supporting)
- **Framing Config (`framingConfig`):** `mode: 'auto', mobileStack: true, gap: 'md'`

#### Record 4: `mitra-kopling`
- **ID / Slug:** `mitra-kopling`
- **Title:** `Mitra Kopling`
- **Subtitle:** `Identity System & Guidelines`
- **Category:** `Brand Identity`
- **Client:** `Kapal Api Global`
- **Year:** `2023`
- **Description:** `Comprehensive brand identity overhaul for an automotive services franchise network. Complete with brand guidelines, signage systems, and uniform guidelines.` *(REPO-SUPPLIED / NOT VERIFIED AGAINST PDF)*
- **Scope:** `["Brand Strategy", "Visual Identity", "Signage System", "Guidelines"]`
- **Legacy Image Field (`image`):** `/images/projects/mitra-kopling/hero.png`
- **Images Array (`images`):** 3 items:
  1. `/images/projects/mitra-kopling/brand-guide.png` (575x931, ratio 0.618, role: primary)
  2. `/images/projects/mitra-kopling/merchandise.png` (833x931, ratio 0.895, role: detail)
  3. `/images/projects/mitra-kopling/apparel.png` (496x931, ratio 0.533, role: supporting)
- **Framing Config (`framingConfig`):** `mode: 'auto', mobileStack: true, gap: 'md'`

#### Record 5: `whysuper-millimeter`
- **ID / Slug:** `whysuper-millimeter`
- **Title:** `Whysuper & Millimeter`
- **Subtitle:** `Corporate Stationery System`
- **Category:** `Corporate Identity`
- **Client:** `Whysuper Studio`
- **Year:** `2024`
- **Description:** `Precision corporate collateral, business card systems, and editorial stationery design for a multidisciplinary creative agency.` *(REPO-SUPPLIED / NOT VERIFIED AGAINST PDF)*
- **Scope:** `["Corporate Identity", "Stationery Suite", "Print Finishes", "Folder Design"]`
- **Legacy Image Field (`image`):** `/images/projects/whysuper-millimeter/hero.png`
- **Images Array (`images`):** 3 items:
  1. `/images/projects/whysuper-millimeter/stationery-left.png` (714x931, ratio 0.767, role: primary)
  2. `/images/projects/whysuper-millimeter/cards-center.png` (773x931, ratio 0.830, role: detail)
  3. `/images/projects/whysuper-millimeter/guidelines-right.png` (417x931, ratio 0.448, role: supporting)
- **Framing Config (`framingConfig`):** `mode: 'auto', mobileStack: true, gap: 'md'`

---

## 4. Asset Inventory

Inspection of all files in `public/images/projects/` with physical dimensions (`pixelWidth` x `pixelHeight`), aspect ratio, and role. All **16 presentation units** have corresponding visual assets in `public/images/projects/`.

| Folder / Asset Path | Dimensions (W x H) | Aspect Ratio | Likely Role | Corresponding PDF Presentation Unit |
|---|---|---|---|---|
| **`public/images/projects/` (Root Files)** | | | | |
| `janus-bifrous-hero.png` | 1584 x 754 | 2.101 : 1 | Hero / Composite | Janus Bifrous (Page 05) |
| `coco-flamingo-hero.png` | 1584 x 754 | 2.101 : 1 | Hero / Composite | Coco Flamingo (Page 06) |
| `kraken-rum-hero.png` | 1584 x 754 | 2.101 : 1 | Hero / Composite | Kraken Rum (Page 07) |
| `blonde-ale-hero.png` | 1584 x 754 | 2.101 : 1 | Hero / Composite | Blonde Ale / Golden Ale (Page 08) |
| `locale-fruit-wine-hero.png` | 1584 x 754 | 2.101 : 1 | Hero / Composite | Locale Fruit Wine (Page 09) |
| `mini-liqueur-party-hero.png` | 1584 x 754 | 2.101 : 1 | Hero / Composite | Mini Liqueur Party (Page 10) |
| `berassa-snack-hero.png` | 1584 x 754 | 2.101 : 1 | Hero / Composite | Berassa Snack (Page 11) |
| `arin-arak-hero.png` | 1584 x 754 | 2.101 : 1 | Hero / Composite | Arin Arak Liqueur (Page 12) |
| `mitra-kopling-hero.png` | 1584 x 763 | 2.076 : 1 | Hero / Composite | Mitra Kopling (Page 13) |
| `logos-collection-hero.png` | 1584 x 800 | 1.980 : 1 | Hero / Composite | Logos Collection (Page 14) |
| `whysuper-corporate-hero.png` | 1584 x 763 | 2.076 : 1 | Hero / Composite | Whysuper & Millimeter (Page 15) |
| `e-book-marketing-hero.png` | 1584 x 763 | 2.076 : 1 | Hero / Composite | E-Book Marketing Kit (Page 16) |
| `sales-tools-hero.png` | 1584 x 763 | 2.076 : 1 | Hero / Composite | Service Kit Sales Tools (Page 17) |
| `bounce-bali-hero.png` | 1584 x 782 | 2.026 : 1 | Hero / Composite | Graphic & Visual / Floor & Wall (Page 18) |
| `locale-social-hero.png` | 1584 x 709 | 2.234 : 1 | Hero / Composite | Locale Instagram Feeds (Page 19) |
| `kopi-tungku-hero.png` | 1584 x 800 | 1.980 : 1 | Hero / Composite | Kopi Tungku Instagram Story (Page 20) |
| **`public/images/projects/janus-bifrous/`** | | | | |
| `hero.png` | 1902 x 795 | 2.392 : 1 | Composite Hero | Janus Bifrous (Page 05) |
| `bottle-left.png` | 714 x 795 | 0.898 : 1 | Panel 1 (Primary) | Janus Bifrous (Page 05) |
| `circle-detail.png` | 595 x 795 | 0.748 : 1 | Panel 2 (Detail) | Janus Bifrous (Page 05) |
| `bottle-right.png` | 595 x 795 | 0.748 : 1 | Panel 3 (Supporting) | Janus Bifrous (Page 05) |
| **`public/images/projects/coco-flamingo/`** | | | | |
| `hero.png` | 1902 x 886 | 2.147 : 1 | Composite Hero | Coco Flamingo (Page 06) |
| `flamingo-art.png` | 516 x 886 | 0.582 : 1 | Panel 1 (Primary) | Coco Flamingo (Page 06) |
| `bottle-center.png` | 733 x 886 | 0.827 : 1 | Panel 2 (Primary) | Coco Flamingo (Page 06) |
| `beach-bottles.png` | 654 x 886 | 0.738 : 1 | Panel 3 (Supporting) | Coco Flamingo (Page 06) |
| **`public/images/projects/kraken-rum/`** | | | | |
| `hero.png` | 1902 x 886 | 2.147 : 1 | Composite Hero | Kraken Rum (Page 07) |
| `bottle-left.png` | 615 x 886 | 0.694 : 1 | Panel 1 (Primary) | Kraken Rum (Page 07) |
| `bottle-center.png` | 674 x 886 | 0.761 : 1 | Panel 2 (Detail) | Kraken Rum (Page 07) |
| `lifestyle-right.png` | 615 x 886 | 0.694 : 1 | Panel 3 (Supporting) | Kraken Rum (Page 07) |
| **`public/images/projects/mitra-kopling/`** | | | | |
| `hero.png` | 1902 x 931 | 2.043 : 1 | Composite Hero | Mitra Kopling (Page 13) |
| `brand-guide.png` | 575 x 931 | 0.618 : 1 | Panel 1 (Primary) | Mitra Kopling (Page 13) |
| `merchandise.png` | 833 x 931 | 0.895 : 1 | Panel 2 (Detail) | Mitra Kopling (Page 13) |
| `apparel.png` | 496 x 931 | 0.533 : 1 | Panel 3 (Supporting) | Mitra Kopling (Page 13) |
| **`public/images/projects/whysuper-millimeter/`** | | | | |
| `hero.png` | 1902 x 931 | 2.043 : 1 | Composite Hero | Whysuper & Millimeter (Page 15) |
| `stationery-left.png` | 714 x 931 | 0.767 : 1 | Panel 1 (Primary) | Whysuper & Millimeter (Page 15) |
| `cards-center.png` | 773 x 931 | 0.830 : 1 | Panel 2 (Detail) | Whysuper & Millimeter (Page 15) |
| `guidelines-right.png` | 417 x 931 | 0.448 : 1 | Panel 3 (Supporting) | Whysuper & Millimeter (Page 15) |
| **`public/images/projects/blonde-ale/`** | | | | |
| `hero.png` | 1902 x 840 | 2.264 : 1 | Composite Hero | Blonde Ale / Golden Ale (Page 08) |
| **`public/images/projects/arin-arak/`** | | | | |
| `hero.png` | 1902 x 852 | 2.232 : 1 | Composite Hero | Arin Arak Liqueur (Page 12) |

---

## 5. PDF ↔ Repository Reconciliation Matrix

| PDF Page | Category (PDF Header) | Presentation / Project Name | Current Repository Data (`data.ts`) | Assets Available | Metadata Status | Audit Status | Presentation Type |
|---|---|---|---|---|---|---|---|
| **05** | `01 Product Design` | Janus Bifrous | Exists (`janus-bifrous`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Standalone Project |
| **06** | `01 Product Design` | Coco Flamingo | Exists (`coco-flamingo`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Standalone Project |
| **07** | `01 Product Design` | Kraken Rum | Exists (`kraken-rum`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Standalone Project |
| **08** | `01 Product Design` | Blonde Ale / Golden Ale | Not in `data.ts` | `blonde-ale-hero.png` & `blonde-ale/hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |
| **09** | `01 Product Design` | Locale Fruit Wine | Not in `data.ts` | `locale-fruit-wine-hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |
| **10** | `01 Product Design` | Mini Liqueur Party | Not in `data.ts` | `mini-liqueur-party-hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |
| **11** | `01 Product Design` | Berassa Snack | Not in `data.ts` | `berassa-snack-hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |
| **12** | `01 Product Design` | Arin Arak Liqueur | Not in `data.ts` | `arin-arak-hero.png` & `arin-arak/hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |
| **13** | `02 Brand Identity` | Mitra Kopling | Exists (`mitra-kopling`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Standalone Project |
| **14** | `03 Logos` | Logos Collection | Not in `data.ts` | `logos-collection-hero.png` | Needs scope, structural model | **MISSING DATA** | Grouped / Showcase |
| **15** | `04 Corporate Identity` | Whysuper & Millimeter | Exists (`whysuper-millimeter`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Standalone Project |
| **16** | `Marketing Kit` *(No #)* | E-Book Marketing Kit | Not in `data.ts` | `e-book-marketing-hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |
| **17** | `Sales Tools` *(No #)* | Service Kit Sales Tools | Not in `data.ts` | `sales-tools-hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |
| **18** | `Graphic & Visual` *(No #)* | Floor / Wall Images / Visual Card / Graphic & Else | Not in `data.ts` | `bounce-bali-hero.png` | Needs scope, structural model | **AMBIGUOUS** | Grouped / Showcase |
| **19** | `05 Social Media Content` | Locale Instagram Feeds | Not in `data.ts` | `locale-social-hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |
| **20** | `Social Media Content` | Kopi Tungku Instagram Story | Not in `data.ts` | `kopi-tungku-hero.png` | Needs year, scope, description | **MISSING DATA** | Standalone Project |

---

## 6. Missing / Incomplete Content Inventory

There are **11 portfolio presentation units** from the PDF that are currently unrepresented in `src/lib/data.ts`.

### A. Standalone Projects Missing Structured Data (9 Units)

1. **`blonde-ale` (Blonde Ale / Golden Ale)**
   - Source Page: Page 08
   - Client: `Locale Brewery`
   - Subtitle: `Craft Beer Series`
   - Category (PDF): `01 Product Design`
   - Missing: Year, Scope, Description, Segmented Panels (if multi-framing is desired).
2. **`locale-fruit-wine` (Locale Fruit Wine)**
   - Source Page: Page 09
   - Client: `Locale Brewery`
   - Subtitle: `Cultured Beverages`
   - Category (PDF): `01 Product Design`
   - Missing: Year, Scope, Description.
3. **`mini-liqueur-party` (Mini Liqueur Party)**
   - Source Page: Page 10
   - Client: `Locale Brewery`
   - Subtitle: `Event Edition Series`
   - Category (PDF): `01 Product Design`
   - Missing: Year, Scope, Description.
4. **`berassa-snack` (Berassa Snack)**
   - Source Page: Page 11
   - Client: `Gumindo Bogamanis`
   - Subtitle: `Modern Heritage Snack`
   - Category (PDF): `01 Product Design`
   - Missing: Year, Scope, Description.
5. **`arin-arak` (Arin Arak Liqueur)**
   - Source Page: Page 12
   - Client: `Arin`
   - Subtitle: `Traditional Spirit Redesign`
   - Category (PDF): `01 Product Design`
   - Missing: Year, Scope, Description.
6. **`e-book-marketing` (E-Book Marketing Kit)**
   - Source Page: Page 16
   - Client: `Eco Mailing`
   - Subtitle: `Comprehensive Guide`
   - Category (PDF): `Marketing Kit`
   - Missing: Year, Scope, Description.
7. **`sales-tools` (Service Kit Sales Tools)**
   - Source Page: Page 17
   - Client: `Suit Solution Group`
   - Subtitle: `B2B Sales Presentation`
   - Category (PDF): `Sales Tools`
   - Missing: Year, Scope, Description.
8. **`locale-social` (Locale Instagram Feeds)**
   - Source Page: Page 19
   - Client: `Locale Brewery`
   - Subtitle: `Visual Grid Strategy & Content Creation`
   - Category (PDF): `05 Social Media Content`
   - Missing: Year, Scope, Description.
9. **`kopi-tungku` (Kopi Tungku Instagram Story)**
   - Source Page: Page 20
   - Client: `Kopi Tungku`
   - Subtitle: `Daily Content & Promotional Stories`
   - Category (PDF): `Social Media Content`
   - Missing: Year, Scope, Description.

### B. Grouped / Showcase Presentations Requiring Structural Specification (2 Units)

10. **`logos-collection` (Logos Collection)**
    - Source Page: Page 14
    - Client: `Multiple / Various`
    - Subtitle: `Selected Marks & Symbols (2020–2026)`
    - Category (PDF): `03 Logos`
    - Missing: Scope, Description, structural treatment (single showcase card vs interactive marks grid).
11. **`graphic-visual` / `bounce-bali` (Floor / Wall Images / Visual Card / Graphic & Else)**
    - Source Page: Page 18
    - Client: `Various local brands`
    - Subtitle: `Environmental & Spatial Graphic Design`
    - Category (PDF): `Graphic & Visual`
    - Missing: Canonical slug, naming normalization, scope, description.

---

## 7. Ambiguities & Source Discrepancies

### A. Category Numbering & Taxonomy Discrepancy
- **In Primary Source (`PF DEPROS 2026_B.pdf`):**
  - Page 05: `01 / DEP ROS PRODUCT DESIGN`
  - Page 13: `02 / DEP ROS BRAND IDENTITY`
  - Page 14: `03 / DEP ROS LOGOS`
  - Page 15: `04 / DEP ROS CORPORATE IDENTITY`
  - Page 16: `MARKETING KIT` *(Separate unnumbered header)*
  - Page 17: `SALES TOOLS` *(Separate unnumbered header)*
  - Page 18: `GRAPHIC & VISUAL` *(Separate unnumbered header)*
  - Page 19: `05/ DEP ROS SOCIAL MEDIA CONTENT` *(Printed with literal prefix `05` on the PDF)*
- **In Discovery Document (`01_DEPROS_DISCOVERY_AND_ARCHITECTURE.md`):**
  - Standardized as 7 sequential numbered categories (`01 Product Design`, `02 Brand Identity`, `03 Logos`, `04 Corporate Identity`, `05 Marketing Kit`, `06 Graphic & Visual`, `07 Social Media Content`).
- **Pass 05B Decision Required:** Whether to preserve the literal PDF presentation headers (`Marketing Kit` + `Sales Tools` as separate items or unified) and how to number categories in the canonical CMS content model.

### B. Marketing Kit vs Sales Tools Separation
- On Pages 16 and 17, the PDF explicitly prints distinct headers: `MARKETING KIT` (Page 16 for Eco Mailing) and `SALES TOOLS` (Page 17 for Suit Solution Group). They are preserved as separate presentation units at source level and must not be silently merged in the audit.

### C. Client Numbering in PDF (Page 03)
- The PDF lists 12 client boxes on page 03 with numbers: `1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11` (contains duplicate number 7 for both *Mitra Kopling* and *Mulia Offset*).

### D. `bounce-bali-hero.png` Asset Naming vs PDF Page 18
- The file `public/images/projects/bounce-bali-hero.png` corresponds visually to PDF Page 18 (`GRAPHIC & VISUAL: FLOOR / WALL IMAGES / VISUAL CARD / GRAPHIC & ELSE`), where one of the graphic murals featured in the collage is for "BOUNCE BALI". The asset filename reflects a specific mural within the composite presentation, not the canonical presentation name.

### E. Presentation Model: Standalone Project vs Grouped Showcase
- 14 items are standalone client projects with single or multi-image assets.
- 2 items (Logos on Page 14, Graphic & Visual on Page 18) are multi-client grouped showcases / collages. The canonical CMS model in PASS 05B will decide how these are modeled.

---

## 8. Recommended Content Readiness Classification

Total Presentation Units Audited: **16 Presentation Units**

### READY FOR WORK ARCHIVE (5 Presentation Units)
These projects have complete metadata in `data.ts`, active multi-image panel assets, and full ProjectFraming compatibility:
1. `janus-bifrous` (Janus Bifrous)
2. `coco-flamingo` (Coco Flamingo)
3. `kraken-rum` (Kraken Rum)
4. `mitra-kopling` (Mitra Kopling)
5. `whysuper-millimeter` (Whysuper & Millimeter)

### NEEDS CONTENT / DATA WORK (9 Presentation Units)
Assets exist in `public/images/projects/`, but structured project data needs to be authored in `data.ts` (adding year, scope, verified client, and descriptions):
1. `blonde-ale` (Blonde Ale / Golden Ale)
2. `locale-fruit-wine` (Locale Fruit Wine)
3. `mini-liqueur-party` (Mini Liqueur Party)
4. `berassa-snack` (Berassa Snack)
5. `arin-arak` (Arin Arak Liqueur)
6. `e-book-marketing` (E-Book Marketing Kit)
7. `sales-tools` (Service Kit Sales Tools)
8. `locale-social` (Locale Instagram Feeds)
9. `kopi-tungku` (Kopi Tungku Instagram Story)

### REQUIRES DECISION / STRUCTURAL SPECIFICATION (2 Presentation Units)
Presentations that represent collections/collages rather than standard single-client case studies:
1. `logos-collection` (Logos Collection — Page 14): Decision needed on whether this is framed as a single composite showcase card or an interactive SVG mark grid.
2. `graphic-visual` / `bounce-bali` (Graphic & Visual collage — Page 18): Decision needed on canonical slug, naming, and category attribution (`Graphic & Visual` vs `Spatial`).

*Arithmetic Validation: 5 (Ready) + 9 (Needs Content/Data Work) + 2 (Requires Decision) = 16 Total Presentation Units.*

---

## 9. Audit Conclusion

1. **Total Portfolio Presentation Units Identified in Source PDF:** **16 distinct presentation units** (14 standalone project presentations + 2 grouped/showcase presentations) across 16 portfolio content pages (Pages 05–20).
2. **Total Currently Represented in Repository Data (`src/lib/data.ts`):** **5 projects**.
3. **Total with Matching Visual Assets in `public/images/projects/`:** **16 presentation units** (5 with multi-panel sliced asset directories, 11 with single/composite hero assets).
4. **Total Incomplete (Missing Structured Data or Metadata):** **11 presentation units** (9 standalone projects needing metadata + 2 grouped showcases requiring structural decisions).
5. **Pre-requisites Before Implementing `/work` Archive:**
   - Author structured data records for the 11 unlisted presentation units in `data.ts`.
   - Resolve category taxonomy mapping in PASS 05B (PDF literal `01–05` with unnumbered sections vs discovery `01–07` sequential taxonomy).
   - Decide presentation and data model for grouped showcases (`logos-collection` and `graphic-visual`).
   - Decide whether non-sliced projects render via single-asset framing (which `ProjectFraming` already supports seamlessly) or require segmented extraction.
