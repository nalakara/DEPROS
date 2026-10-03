# DEPROS CMS Architecture Contract

**Pass:** CMS-01 — CMS Architecture Discovery & Contract Definition  
**Date:** October 2026  
**Repository:** `nalakara/DEPROS`  
**Status:** Approved Architectural Baseline  

---

## 1. Core Architectural Boundary

The DEPROS website separates content ownership from presentation logic:

```mermaid
graph TD
    subgraph CMS["HEADLESS CMS (Content & Editorial Authority)"]
        A[Content Records & Taxonomy]
        B[Asset Media Library & Intrinsic Metadata]
        C[Editorial Curation: featured, order, published]
    end

    subgraph ADAPTER["DATA ADAPTER LAYER (Contract & Validation)"]
        D[Schema Validation: Zod / Type Narrowing]
        E[Derived Properties: categorySlug, displayIndex, image fallback]
    end

    subgraph FRONTEND["DEPROS FRONTEND (Presentation & Behavioral Authority)"]
        F[Routing: /, /work, /work/:slug]
        G[Framing Engine: computeFramingRows]
        H[Artwork Integrity: object-contain, hairline grid]
        I[Interactive UI: filtering, continuous loop nav, typography]
    end

    CMS -->|Raw API / GraphQL / JSON| ADAPTER
    ADAPTER -->|CanonicalPortfolioEntry[]| FRONTEND
```

### Inviolable Principles
1. **CMS Authority:** The CMS is the sole source of truth for portfolio content, client entities, media assets, descriptive copy, and editorial curation status.
2. **Frontend Authority:** The Next.js frontend is the sole authority for design tokens, typography, layout mathematics, framing row algorithms, responsive stacking, routing, and filtering behaviors.
3. **Decoupled Types:** No vendor-specific SDK types (e.g. `SanityDocument`, `PayloadCollection`) shall leak directly into DEPROS presentation components. All data consumed by components must be validated into `CanonicalPortfolioEntry`.

---

## 2. Canonical Model → CMS Field Mapping

| Field | Current TS Type | CMS Field Type | Ownership | Notes |
|---|---|---|---|---|
| `id` | `string` | System Document ID / UID | CMS | Immutable unique record identity. |
| `slug` | `string` | Slug field (regex: `^[a-z0-9-]+$`) | CMS | Public URL route identifier (`/work/[slug]`). |
| `title` | `string` | Single-line Text (Required) | CMS | Canonical presentation title. |
| `subtitle` | `string?` | Single-line Text (Optional) | CMS | Product / project descriptor. |
| `category` | `SemanticCategoryId` | Select / Enum (Required) | CMS | One of 7 canonical categories. |
| `presentationType` | `"standalone" \| "grouped"` | Select / Radio (Required) | CMS | Presentation structure type. |
| `contentSubtype` | `"marketing-kit" \| "sales-tools"?` | Select / Radio (Optional) | CMS | Sub-classification within `marketing-kit`. |
| `client` | `string?` | Reference / String (Optional) | CMS | Reference to `Client` entity or string. |
| `clientDisplayName` | `string?` | Single-line Text (Optional) | CMS | Formatted display override. |
| `description` | `string?` | Multi-line Text / Markdown | CMS | Curated project summary and pitch. |
| `scope` | `string[]?` | Array of Strings / Tags | CMS | Deliverables and service disciplines. |
| `year` | `string?` | String / Number (Optional) | CMS | 4-digit release year (e.g. `"2024"`). |
| `media` | `CanonicalMediaItem[]` | Asset Array (Required, min 1) | CMS | Visual assets with alt, role, dimensions, caption. |
| `featured` | `boolean?` | Boolean Switch (Default: `false`) | CMS | Homepage visibility toggle. |
| `published` | `boolean?` | Boolean Switch (Default: `true`) | CMS | Archive & public visibility toggle. |
| `order` | `number?` | Number / Sort Weight | CMS | Editorial sequence priority. |
| `framingConfig` | `FramingConfig?` | Field Group (Optional) | CMS / Frontend | Optional editorial layout override. |
| `provenance` | `SourceProvenance?` | Field Group (Optional, Read-Only)| CMS | Historical PDF audit traceability. |
| `image` | `string` | *(Omit from CMS)* | Frontend / Adapter | Derived from primary media item. |
| `images` | `CanonicalMediaItem[]?` | *(Omit from CMS)* | Frontend / Adapter | Derived from `media` array. |
| `number` | `string?` | *(Omit from CMS)* | Frontend / Adapter | Calculated dynamically at render time. |
| `categorySlug` | `string?` | *(Omit from CMS)* | Frontend / Adapter | Derived directly from `category`. |

---

## 3. Media Architecture Contract

```text
Project Document
  └── media: Array<MediaItem>
        ├── asset: ImageAsset (File/CDN reference)
        │     ├── url (string)
        │     ├── width (number - auto-extracted)
        │     ├── height (number - auto-extracted)
        │     └── mimeType (string)
        ├── alt: string (Required accessible description)
        ├── role: "primary" | "detail" | "supporting" | "composite" (Required)
        ├── caption: string (Optional)
        └── orientation: "portrait" | "landscape" | "square" | "panoramic" (Derived / Hint)
```

1. **Intrinsic Dimension Extraction:** CMS must automatically extract asset `width` and `height` to allow zero-CLS aspect ratio container rendering.
2. **Uncropped Assets:** CMS must serve uncropped source masters; containment is handled via Next.js `object-contain`.
3. **Role-Driven UI:** Primary media automatically powers Archive Cards, OpenGraph previews, and single-image fallbacks.
