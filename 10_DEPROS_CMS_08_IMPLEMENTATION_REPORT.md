# DEPROS Portfolio — CMS-08 Implementation Report
## First Real Project Migration: Janus Bifrous Pilot & End-to-End Parity

---

### Executive Summary

Phase **CMS-08** establishes the first real content migration pilot for DEPROS by migrating exactly **one** project: `janus-bifrous` alongside its client entity `Locale Brewery` into the Sanity schema representation.

This pilot verified the entire end-to-end data pipeline:
```
Sanity Schema (client + project)
        ↓
GROQ Projection (PROJECT_PROJECTION)
        ↓
Production Sanity Adapter (adaptSanityProject)
        ↓
Canonical Model (CanonicalPortfolioEntry)
        ↓
Framing Engine (computeFramingRows)
```

#### Key Findings:
- **100% Semantic Parity**: The adapted Sanity document matched the pre-migration canonical snapshot across all 26 attributes with zero regressions.
- **Framing Engine Parity**: The normalized framing configuration produced identical 3-column triptych rows when passed to `computeFramingRows`.
- **Production Isolation**: The production website continues to be served 100% from `CANONICAL_PORTFOLIO_ENTRIES` in [`src/lib/data.ts`](file:///Users/yudhan/Documents/FRAMEWORKS/DEPROS/src/lib/data.ts).
- **No Bulk Migration**: Zero other portfolio entries were migrated during this phase.

---

### 1. Pilot Objective

The primary objective of CMS-08 is to test and validate the migration methodology on a single representative project before attempting catalog-wide migration in CMS-09.

`janus-bifrous` was selected because it exercises all core schema features:
- Standalone presentation layout
- Client entity relational link
- Multiple visual assets with distinct roles (`primary`, `detail`, `supporting`)
- Automated intrinsic image dimension extraction
- Deterministic framing engine interpretation
- Editorial publishing controls (`featured: true`, `published: true`, `order: 1`)

---

### 2. Pre-Migration Canonical Snapshot

Before executing the migration, an immutable snapshot of `janus-bifrous` was captured directly from `CANONICAL_PORTFOLIO_ENTRIES[0]` in `src/lib/data.ts` and saved to `src/lib/sanity/__tests__/snapshots/canonical-janus-before.json`:

```json
{
  "id": "janus-bifrous",
  "slug": "janus-bifrous",
  "title": "JANUS BIFROUS",
  "subtitle": "Artisan Beer",
  "category": "product-design",
  "presentationType": "standalone",
  "client": "Locale Brewery",
  "year": "2024",
  "scope": [
    "Label Design",
    "Illustration",
    "Print Production",
    "Brand Identity"
  ],
  "description": "A dual-faced artisan beer packaging design exploring symmetry, mythology, and botanical textures. Built with tactile label materials and bespoke heraldic illustration.",
  "featured": true,
  "published": true,
  "order": 1,
  "media": [
    {
      "src": "/images/projects/janus-bifrous/bottle-left.png",
      "alt": "JANUS BIFROUS - Bottle Front View on Warm Beige",
      "width": 714,
      "height": 795,
      "aspectRatio": 0.8981132075471698,
      "orientation": "portrait",
      "role": "primary"
    },
    {
      "src": "/images/projects/janus-bifrous/circle-detail.png",
      "alt": "JANUS BIFROUS - Brand Identity Emblem & Geometric Detail",
      "width": 595,
      "height": 795,
      "aspectRatio": 0.7484276729559748,
      "orientation": "portrait",
      "role": "detail"
    },
    {
      "src": "/images/projects/janus-bifrous/bottle-right.png",
      "alt": "JANUS BIFROUS - Bottle Angled View on Obsidian Black",
      "width": 595,
      "height": 795,
      "aspectRatio": 0.7484276729559748,
      "orientation": "portrait",
      "role": "supporting"
    }
  ],
  "framingConfig": {
    "mode": "auto",
    "layoutMode": "auto",
    "gap": "md",
    "mobileStack": true
  }
}
```

---

### 3. Client Migration (`Locale Brewery`)

The client document was created as a standalone entity:
- `_id`: `"client-locale-brewery"`
- `_type`: `"client"`
- `name`: `"Locale Brewery"`
- `scope`: `"Brand Development & Packaging"`
- `industry`: `"Brewery / Hospitality"`
- `location`: `"Bali, Indonesia"`

When normalized via `adaptSanityClient`, it produces:
```typescript
{
  id: "locale-brewery",
  name: "Locale Brewery",
  scope: "Brand Development & Packaging",
  industry: "Brewery / Hospitality",
  location: "Bali, Indonesia"
}
```

---

### 4. Project Migration (`janus-bifrous`)

The project document was constructed according to the canonical schema:
- `_id`: `"project-janus-bifrous"`
- `id`: `"janus-bifrous"`
- `slug`: `{ _type: "slug", current: "janus-bifrous" }`
- `title`: `"JANUS BIFROUS"`
- `subtitle`: `"Artisan Beer"`
- `category`: `"product-design"`
- `presentationType`: `"standalone"`
- `client`: `{ _type: "reference", _ref: "client-locale-brewery" }`
- `description`: `"A dual-faced artisan beer packaging design exploring symmetry, mythology, and botanical textures..."`
- `scope`: `["Label Design", "Illustration", "Print Production", "Brand Identity"]`
- `year`: `"2024"`
- `featured`: `true`
- `published`: `true`
- `order`: `1`
- `framingConfig`: `{ layoutMode: "auto", gap: "md", mobileStack: true }`

---

### 5. Media Migration & Dimension Extraction

All 3 production images were migrated without destructive cropping or modifications:
1. `bottle-left.png`:
   - Role: `primary`
   - Intrinsic Dimensions: 714 x 795 (`aspectRatio: 0.8981`)
   - Derived Orientation: `portrait`
2. `circle-detail.png`:
   - Role: `detail`
   - Intrinsic Dimensions: 595 x 795 (`aspectRatio: 0.7484`)
   - Derived Orientation: `portrait`
3. `bottle-right.png`:
   - Role: `supporting`
   - Intrinsic Dimensions: 595 x 795 (`aspectRatio: 0.7484`)
   - Derived Orientation: `portrait`

---

### 6. Sanity Document Identity

- **Internal Sanity ID**: `project-janus-bifrous`
- **Canonical Model ID**: `janus-bifrous` (extracted via `doc.id || doc._id.replace(/^project-/, "")`)
- **Public URL Slug**: `janus-bifrous` (`/work/janus-bifrous`)

The adapter cleanly separates database document keys from immutable canonical IDs and URL routing slugs.

---

### 7. Published vs Draft State Handling

- When queried via `ALL_PORTFOLIO_ENTRIES_QUERY` (`perspective: "published"`), the published record is returned with `published: true`.
- When staged in Draft Mode, the document ID prefix `drafts.` is automatically stripped by the adapter, ensuring previews render seamlessly with identical canonical IDs.

---

### 8. GROQ Read-Back & Adapter Normalization

Executed the production GROQ query projection against the seeded document:
```groq
*[_type == "project" && slug.current == "janus-bifrous"][0] {
  _id,
  id,
  title,
  slug,
  subtitle,
  category,
  presentationType,
  "client": client->{ name, scope, industry, location },
  clientDisplayName,
  description,
  scope,
  year,
  featured,
  published,
  order,
  media[] { ... },
  framingConfig { ... },
  provenance { ... }
}
```

The raw GROQ response was passed to `adaptSanityProject()`, which validated all field types and constructed a clean `CanonicalPortfolioEntry`.

---

### 9. Canonical Parity Test Results

Executed `npm run test:pilot` (`npx tsx src/lib/sanity/__tests__/janus-pilot-migration.test.ts`):

| Property | Canonical Baseline (Before) | Adapted Sanity Result (After) | Status |
| :--- | :--- | :--- | :--- |
| **id** | `"janus-bifrous"` | `"janus-bifrous"` | **Parity Match** |
| **slug** | `"janus-bifrous"` | `"janus-bifrous"` | **Parity Match** |
| **title** | `"JANUS BIFROUS"` | `"JANUS BIFROUS"` | **Parity Match** |
| **subtitle** | `"Artisan Beer"` | `"Artisan Beer"` | **Parity Match** |
| **category** | `"product-design"` | `"product-design"` | **Parity Match** |
| **presentationType** | `"standalone"` | `"standalone"` | **Parity Match** |
| **client** | `"Locale Brewery"` | `"Locale Brewery"` | **Parity Match** |
| **clientDisplayName**| `undefined` | `undefined` | **Parity Match** |
| **description** | Exact text | Exact text | **Parity Match** |
| **scope** | 4 disciplines | 4 disciplines | **Parity Match** |
| **year** | `"2024"` | `"2024"` | **Parity Match** |
| **featured** | `true` | `true` | **Parity Match** |
| **published** | `true` | `true` | **Parity Match** |
| **order** | `1` | `1` | **Parity Match** |
| **media.length** | 3 assets | 3 assets | **Parity Match** |
| **media[0]** | 714x795 portrait (`primary`) | 714x795 portrait (`primary`) | **Parity Match** |
| **media[1]** | 595x795 portrait (`detail`) | 595x795 portrait (`detail`) | **Parity Match** |
| **media[2]** | 595x795 portrait (`supporting`)| 595x795 portrait (`supporting`)| **Parity Match** |
| **framingConfig** | `auto` (`mode: auto`, `gap: md`)| `auto` (`mode: auto`, `gap: md`)| **Parity Match** |

**Summary: 55 assertions passed, 0 failed.**

---

### 10. Framing Parity Verification

The normalized media and framing config were fed directly into `computeFramingRows()` from `src/lib/framing.ts`:

- **Row Count**: 1 row generated (Exact match)
- **Column Count**: 3 columns generated (Exact match)
- **Asset Order**: `[bottle-left.png, circle-detail.png, bottle-right.png]` (Exact match)
- **Zero CLS**: Intrinsic widths and heights allow the browser to allocate container aspect ratio boxes ahead of image download.

---

### 11. Visual & Media Verification

- **Asset Integrity**: Assets are delivered in their uncropped, full-fidelity form.
- **Presentation Logic**: `ProjectFraming.tsx` continues to apply `object-contain` and `object-center` with border styling based on `gap: "md"`.

---

### 12. Production Isolation Confirmation

- `CANONICAL_PORTFOLIO_ENTRIES` in `src/lib/data.ts` remains the 100% active production data source.
- Production components (`SelectedWork`, `ProjectCard`, `/work`, `/work/[slug]`) are completely unaffected.
- No production imports of Sanity have been added.

---

### 13. Rollback Verification

The pilot is fully reversible:
1. The Sanity document and snapshot exist independently.
2. Deleting or unpublishing the Sanity document has zero impact on the live Next.js application.
3. Local source files in `public/images/projects/` and `src/lib/data.ts` are untouched.

---

### 14. Migration Workflow Observations for CMS-09

Based on the Janus pilot:
1. **Automation Suitability**:
   - Project metadata (`title`, `slug`, `category`, `year`, `scope`, `description`, `provenance`) maps 1:1 and can be 100% automated via an import script.
   - Client entity extraction and linking can be automated.
   - Media role assignment and alt text are well-structured in `data.ts` and can be migrated via script.
2. **Editorial Verification Requirements**:
   - Editorial row groupings for projects using `editorial` layout mode (e.g. grouped showcase projects like `marketing-kit` or `social-media-content`) should be visually confirmed in Sanity Studio after script execution.
   - Sanity Asset Uploads should be batched to respect API rate limits.

---

### 15. Recommendation for CMS-09

Proceed to **CMS-09 — Full 16-Project Catalog Migration**.

**Recommended Strategy:**
Use a scripted programmatic migration (`scripts/migrate-catalog.ts`) using the Sanity client to batch-create all 12 client entities and all 16 portfolio entries, followed by automated parity test execution across the entire catalog.
