# DEPROS Portfolio Content Audit

**Pass:** 05A — Portfolio Content Audit  
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

---

## 2. PDF Portfolio Taxonomy

Extraction from `PF DEPROS 2026_B.pdf` across all 21 pages.

### Overview of PDF Structure
- **Page 01:** Cover — `STUDIO PROFILE / PORTFOLIO`
- **Page 02:** Introduction — `STUDIO PROFILE / Hello There! / WHAT WE DO`
- **Page 03:** Notable Clients — `NOTABLE CLIENTS` (12 client entries)
- **Page 04:** Portfolio Section Divider — `PORTFOLIO / "Good design is good business..."`
- **Pages 05–20:** Portfolio Works (14 distinct portfolio presentations across categories)
- **Page 21:** Contact / Outro — `CONTACT / LETS DO IT`

### Full Catalog of PDF Portfolio Items (Pages 05–20)

| Page | Header Category on PDF | Project Name (Verbatim) | Subtitle / Descriptor (Verbatim) | Client (Verbatim) | Scope / Notes (Verbatim) | Presentation Type |
|---|---|---|---|---|---|---|
| **05** | `01 / DEP ROS`<br>`PRODUCT DESIGN` | `JANUS BIFROUS` | `Artisan Beer` | `Locale Brewery` | Multi-image spread: 3 bottle visual panels + top identity badge | Standalone Project Presentation |
| **06** | `PRODUCT DESIGN` *(continued)* | `COCO FLAMINGO` | `Summer Pale Ale` | `Locale Brewery` | Multi-image spread: Flamingo artwork, beach scene, 3-can lineup | Standalone Project Presentation |
| **07** | `PRODUCT DESIGN` *(continued)* | `KRAKEN RUM` | `Spiced Rum Edition` | `Locale Brewery` | Multi-image spread: 2 bottle shots + cocktail lifestyle scene | Standalone Project Presentation |
| **08** | `PRODUCT DESIGN` *(continued)* | `BLONDE ALE / GOLDEN ALE` | `Craft Beer Series` | `Locale Brewery` | Multi-can / bottle lineup rendering | Standalone Project Presentation |
| **09** | `PRODUCT DESIGN` *(continued)* | `LOCALE FRUIT WINE` | `Cultured Beverages` | `Locale Brewery` | Single composite product visual (cider/fruit wine bottle lineup) | Standalone Project Presentation |
| **10** | `PRODUCT DESIGN` *(continued)* | `MINI LIQUEUR PARTY` | `Event Edition Series` | `Locale Brewery` | Single composite product visual (mini shot bottle set) | Standalone Project Presentation |
| **11** | `PRODUCT DESIGN` *(continued)* | `BERASSA SNACK` | `Modern Heritage Snack` | `Gumindo Bogamanis` | Single composite packaging pouch visual | Standalone Project Presentation |
| **12** | `PRODUCT DESIGN` *(continued)* | `ARIN ARAK LIQUEUR` | `Traditional Spirit Redesign` | `Arin` | Single composite bottle & packaging rendering | Standalone Project Presentation |
| **13** | `02 / DEP ROS`<br>`BRAND IDENTITY` | `MITRA KOPLING` | `Identity System & Brand Implementation` | `Kapal Api` | Multi-image spread: Brand guidelines book, merchandise, apparel | Standalone Project Presentation |
| **14** | `03 / DEP ROS`<br>`LOGOS` | `LOGOS COLLECTION` *(implicit title on page)* | `Selected Marks & Symbols (2020–2026)` *(PDF: grid of marks)* | Multiple / Various | Multi-logo showcase grid featuring: Kopi Tungku, Dapoer Bu Gendut, Locale, Suite, etc. | Grouped / Index Showcase |
| **15** | `04 / DEP ROS`<br>`CORPORATE IDENTITY` | `WHYSUPER & MILLIMETER` | `Brand System, Stationery & Guidelines` | `Whysuper / Millimeter` | Multi-image spread: Corporate stationery, business cards, identity manual | Standalone Project Presentation |
| **16** | `MARKETING KIT` *(no category number printed on PDF)* | `E-BOOK MARKETING KIT` | `Comprehensive Guide` | `Eco Mailing` | Single composite visual: Digital tablet / e-book mockup | Standalone Project Presentation |
| **17** | `SALES TOOLS` *(no category number printed on PDF)* | `SERVICE KIT SALES TOOLS` | `B2B Sales Presentation` | `Suit Solution Group` | Single composite visual: Printed / digital deck layout | Standalone Project Presentation |
| **18** | `GRAPHIC & VISUAL` *(no category number printed on PDF)* | `FLOOR / WALL IMAGES / VISUAL CARD / GRAPHIC & ELSE` | `Environmental & Spatial Graphic Design` | Various local brands | Multi-asset visual collage (environmental graphics, retail signs, cards) | Grouped / Showcase Presentation |
| **19** | `05/ DEP ROS`<br>`SOCIAL MEDIA CONTENT` | `LOCALE INSTAGRAM FEEDS` | `Visual Grid Strategy & Content Creation` | `Locale Brewery` | Single composite visual (Instagram 9-grid feed layout) | Standalone Project Presentation |
| **20** | `SOCIAL MEDIA CONTENT` *(continued)* | `KOPI TUNGKU INSTAGRAM STORY` | `Daily Content & Promotional Stories` | `Kopi Tungku` | Single composite visual (mobile story screen series) | Standalone Project Presentation |

---

## 3. Repository Portfolio Inventory

Inspection of current repository data in `src/lib/data.ts`.

### Currently Defined Projects in `FEATURED_PROJECTS` (Total: 5)

```typescript
// Summary of records in src/lib/data.ts
```

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

Inspection of all files in `public/images/projects/` with physical dimensions (`pixelWidth` x `pixelHeight`), aspect ratio, and role.

| Folder / Asset Path | Dimensions (W x H) | Aspect Ratio | Likely Role | Corresponding PDF Project |
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

| PDF Page | Category (PDF) | Project (PDF Name) | Current Repository Data (`data.ts`) | Assets Available | Metadata Status | Audit Status | Notes |
|---|---|---|---|---|---|---|---|
| **05** | `01 Product Design` | Janus Bifrous | Exists (`janus-bifrous`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Full multi-image framing active |
| **06** | `01 Product Design` | Coco Flamingo | Exists (`coco-flamingo`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Full multi-image framing active |
| **07** | `01 Product Design` | Kraken Rum | Exists (`kraken-rum`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Full multi-image framing active |
| **08** | `01 Product Design` | Blonde Ale / Golden Ale | Not in `data.ts` | `blonde-ale-hero.png` & `blonde-ale/hero.png` | Needs year, scope, description | **MISSING DATA** | Single/composite asset exists; no multi-panel split |
| **09** | `01 Product Design` | Locale Fruit Wine | Not in `data.ts` | `locale-fruit-wine-hero.png` | Needs year, scope, description | **MISSING DATA** | Composite hero asset exists |
| **10** | `01 Product Design` | Mini Liqueur Party | Not in `data.ts` | `mini-liqueur-party-hero.png` | Needs year, scope, description | **MISSING DATA** | Composite hero asset exists |
| **11** | `01 Product Design` | Berassa Snack | Not in `data.ts` | `berassa-snack-hero.png` | Needs year, scope, description | **MISSING DATA** | Composite hero asset exists |
| **12** | `01 Product Design` | Arin Arak Liqueur | Not in `data.ts` | `arin-arak-hero.png` & `arin-arak/hero.png` | Needs year, scope, description | **MISSING DATA** | Composite hero asset exists |
| **13** | `02 Brand Identity` | Mitra Kopling | Exists (`mitra-kopling`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Full multi-image framing active |
| **14** | `03 Logos` | Logos Collection | Not in `data.ts` | `logos-collection-hero.png` | Needs year, scope, description | **MISSING DATA** | Grouped logo showcase spread |
| **15** | `04 Corporate Identity` | Whysuper & Millimeter | Exists (`whysuper-millimeter`) | Hero + 3 segmented panels | Complete (with repo description) | **READY** | Full multi-image framing active |
| **16** | `Marketing Kit` *(No # on PDF)* | E-Book Marketing Kit | Not in `data.ts` | `e-book-marketing-hero.png` | Needs year, scope, description | **MISSING DATA** | Composite hero asset exists |
| **17** | `Sales Tools` *(No # on PDF)* | Service Kit Sales Tools | Not in `data.ts` | `sales-tools-hero.png` | Needs year, scope, description | **MISSING DATA** | Composite hero asset exists |
| **18** | `Graphic & Visual` *(No # on PDF)* | Floor / Wall Images / Visual Card | Not in `data.ts` | `bounce-bali-hero.png` (representing visual) | Needs year, scope, description | **AMBIGUOUS** | Asset named `bounce-bali-hero.png` maps to page 18 graphic spread |
| **19** | `05 Social Media Content` | Locale Instagram Feeds | Not in `data.ts` | `locale-social-hero.png` | Needs year, scope, description | **MISSING DATA** | Composite hero asset exists |
| **20** | `Social Media Content` | Kopi Tungku Instagram Story | Not in `data.ts` | `kopi-tungku-hero.png` | Needs year, scope, description | **MISSING DATA** | Composite hero asset exists |

---

## 6. Missing / Partial Content

To scale the portfolio representation (for `/work` or expanded views), the following 9 projects from the PDF require structured data records and metadata decisions:

1. **`blonde-ale` (Blonde Ale / Golden Ale)**
   - Client: `Locale Brewery`
   - Subtitle: `Craft Beer Series`
   - Category: `Product Design`
   - Missing: Year, Scope, Description, Segmented Panels (if multi-framing is desired).
2. **`locale-fruit-wine` (Locale Fruit Wine)**
   - Client: `Locale Brewery`
   - Subtitle: `Cultured Beverages`
   - Category: `Product Design`
   - Missing: Year, Scope, Description.
3. **`mini-liqueur-party` (Mini Liqueur Party)**
   - Client: `Locale Brewery`
   - Subtitle: `Event Edition Series`
   - Category: `Product Design`
   - Missing: Year, Scope, Description.
4. **`berassa-snack` (Berassa Snack)**
   - Client: `Gumindo Bogamanis`
   - Subtitle: `Modern Heritage Snack`
   - Category: `Product Design`
   - Missing: Year, Scope, Description.
5. **`arin-arak` (Arin Arak Liqueur)**
   - Client: `Arin`
   - Subtitle: `Traditional Spirit Redesign`
   - Category: `Product Design`
   - Missing: Year, Scope, Description.
6. **`logos-collection` (Logos Collection)**
   - Client: `Multiple / Various`
   - Subtitle: `Selected Marks & Symbols (2020–2026)`
   - Category: `Logos`
   - Missing: Scope, Description, structural treatment (is it a single project or interactive index?).
7. **`e-book-marketing` (E-Book Marketing Kit)**
   - Client: `Eco Mailing`
   - Subtitle: `Comprehensive Guide`
   - Category: `Marketing Kit`
   - Missing: Year, Scope, Description.
8. **`sales-tools` (Service Kit Sales Tools)**
   - Client: `Suit Solution Group`
   - Subtitle: `B2B Sales Presentation`
   - Category: `Marketing Kit` or `Sales Tools`
   - Missing: Year, Scope, Description.
9. **`kopi-tungku` (Kopi Tungku Instagram Story)**
   - Client: `Kopi Tungku`
   - Subtitle: `Daily Content & Promotional Stories`
   - Category: `Social Media Content`
   - Missing: Year, Scope, Description.
10. **`locale-social` (Locale Instagram Feeds)**
    - Client: `Locale Brewery`
    - Subtitle: `Visual Grid Strategy & Content Creation`
    - Category: `Social Media Content`
    - Missing: Year, Scope, Description.

---

## 7. Ambiguities & Discrepancies

### A. Category Numbering Discrepancy (PDF vs Discovery Doc)
- **In PDF `PF DEPROS 2026_B.pdf`:**
  - Page 05: `01 / DEP ROS PRODUCT DESIGN`
  - Page 13: `02 / DEP ROS BRAND IDENTITY`
  - Page 14: `03 / DEP ROS LOGOS`
  - Page 15: `04 / DEP ROS CORPORATE IDENTITY`
  - Page 16: `MARKETING KIT` *(No category number prefix printed)*
  - Page 17: `SALES TOOLS` *(No category number prefix printed)*
  - Page 18: `GRAPHIC & VISUAL` *(No category number prefix printed)*
  - Page 19: `05/ DEP ROS SOCIAL MEDIA CONTENT` *(Printed as category `05` on the PDF)*
- **In `01_DEPROS_DISCOVERY_AND_ARCHITECTURE.md`:**
  - Standardized as 7 sequential numbered categories: `01 Product Design`, `02 Brand Identity`, `03 Logos`, `04 Corporate Identity`, `05 Marketing Kit`, `06 Graphic & Visual`, `07 Social Media Content`.

### B. Client Numbering in PDF (Page 03)
- The PDF lists 12 client boxes on page 03 with numbers: `1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10, 11` (contains duplicate number 7 for both *Mitra Kopling* and *Mulia Offset*).

### C. `bounce-bali-hero.png` Asset Naming vs PDF Page 18
- The file `public/images/projects/bounce-bali-hero.png` corresponds visually to PDF Page 18 (`GRAPHIC & VISUAL: FLOOR / WALL IMAGES / VISUAL CARD / GRAPHIC & ELSE`), where one of the graphic murals featured in the collage is for "BOUNCE BALI". The asset filename reflects a specific mural within the composite presentation.

### D. Single Composite Images vs Multi-Image Subdirectories
- Currently, only 5 projects have dedicated subdirectories with separately sliced panels (`janus-bifrous`, `coco-flamingo`, `kraken-rum`, `mitra-kopling`, `whysuper-millimeter`).
- Two additional folders exist (`arin-arak`, `blonde-ale`) but only contain `hero.png`.
- The remaining 7 projects currently exist as single flat composite PNGs in `public/images/projects/`.

---

## 8. Recommended Content Readiness Classification

### READY FOR WORK ARCHIVE (5 Projects)
These projects have complete metadata in `data.ts`, active multi-image panel assets, and full ProjectFraming compatibility:
1. `janus-bifrous` (Janus Bifrous)
2. `coco-flamingo` (Coco Flamingo)
3. `kraken-rum` (Kraken Rum)
4. `mitra-kopling` (Mitra Kopling)
5. `whysuper-millimeter` (Whysuper & Millimeter)

### NEEDS CONTENT / DATA WORK (8 Projects)
Assets exist in `public/images/projects/`, but structured project data needs to be authored in `data.ts` (adding year, scope, verified client, and factual descriptions):
1. `blonde-ale` (Blonde Ale / Golden Ale)
2. `locale-fruit-wine` (Locale Fruit Wine)
3. `mini-liqueur-party` (Mini Liqueur Party)
4. `berassa-snack` (Berassa Snack)
5. `arin-arak` (Arin Arak Liqueur)
6. `e-book-marketing` (E-Book Marketing Kit)
7. `sales-tools` (Service Kit Sales Tools)
8. `kopi-tungku` (Kopi Tungku Instagram Story)
9. `locale-social` (Locale Instagram Feeds)

### REQUIRES DECISION / STRUCTURAL SPECIFICATION (2 Projects)
Presentations that represent collections/collages rather than standard single-client case studies:
1. `logos-collection` (Logos Collection — Page 14): Decision needed on whether this is framed as a single composite showcase card or an interactive SVG mark grid.
2. `graphic-visual` / `bounce-bali` (Graphic & Visual collage — Page 18): Decision needed on project slug, naming, and category attribution (`Graphic & Visual` vs `Spatial`).

---

## 9. Audit Conclusion

1. **Total Portfolio Items Identified in Source PDF:** **14 distinct presentations/spreads** across 16 content pages (Pages 05–20).
2. **Total Currently Represented in Repository Data (`src/lib/data.ts`):** **5 projects**.
3. **Total with Matching Visual Assets in `public/images/projects/`:** **14 items** (5 with multi-panel sliced assets, 9 with single/composite hero assets).
4. **Total Incomplete (Missing Structured Data or Metadata):** **9 items**.
5. **Pre-requisites Before Implementing `/work` Archive:**
   - Author structured data records for the 9 unlisted projects in `data.ts`.
   - Resolve category taxonomy (standardizing the 7 categories across the PDF's literal `01–05` numbering vs architecture document's `01–07`).
   - Decide whether non-sliced projects render via single-asset framing (which `ProjectFraming` already supports seamlessly) or require segmented extraction.
