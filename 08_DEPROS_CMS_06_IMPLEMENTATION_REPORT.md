# DEPROS Portfolio — CMS-06 Implementation Report
## Sanity Data Adapter & Query Layer

---

### Executive Summary

Phase **CMS-06** implements the production-grade data querying, schema validation, and canonical adapter boundary for Sanity.io.

This layer serves as the **exclusive gateway** between the Sanity Content Lake and the DEPROS presentation layer. It ensures that:
1. All Sanity-specific SDK calls, reference pointers, and raw GROQ projection shapes remain strictly encapsulated within `src/lib/sanity/`.
2. All exported fetchers and adapters return only canonical DEPROS types (`CanonicalPortfolioEntry`, `CanonicalMediaItem`, `ClientItem`).
3. Strict schema validation guards against malformed or incomplete CMS documents (missing dimensions, invalid categories, invalid media roles) before records can reach frontend consumers.
4. Intrinsic image dimensions (`width`, `height`, `aspectRatio`) and calculated orientations are preserved to ensure zero Cumulative Layout Shift (CLS).
5. Strict **production isolation** is maintained: `CANONICAL_PORTFOLIO_ENTRIES` in `src/lib/data.ts` remains the 100% active data source for all production routes (`/`, `/work`, `/work/[slug]`).

---

### 1. Files Inspected

- `03_DEPROS_CMS_ARCHITECTURE_CONTRACT.md` (Authoritative CMS boundary contract)
- `04_DEPROS_CMS_VENDOR_AND_ARCHITECTURE_EVALUATION.md` (Vendor evaluation report)
- `05_DEPROS_CMS_POC_REPORT.md` (Sanity vs Payload POC findings)
- `06_DEPROS_FINAL_CMS_SELECTION_AND_IMPLEMENTATION_PLAN.md` (Migration plan)
- `src/lib/types.ts` (Canonical TypeScript models and enums)
- `src/lib/data.ts` (Canonical portfolio records, framing configurations, and client records)
- `src/lib/framing.ts` (Deterministic framing algorithm)
- `src/components/portfolio/ProjectFraming.tsx` (Framing presentation component)
- `src/lib/cms-poc/sanity/` (POC harness files used as architecture reference)
- `src/sanity/` (CMS-05 Studio schemas and environment configuration)

---

### 2. Files Created

- `src/lib/sanity/types.ts`: Vendor-specific TypeScript contracts for raw GROQ projections.
- `src/lib/sanity/client.ts`: Dedicated server-side read client using `next-sanity`.
- `src/lib/sanity/queries.ts`: Explicit GROQ queries projecting only required canonical fields.
- `src/lib/sanity/validation.ts`: Custom `SanityValidationError` and runtime schema guard assertions.
- `src/lib/sanity/adapter.ts`: Canonical normalization engine converting raw Sanity data into `CanonicalPortfolioEntry[]`.
- `src/lib/sanity/fetchers.ts`: Clean asynchronous data fetching layer with error handling.
- `src/lib/sanity/index.ts`: Unified public entrypoint for the Sanity data layer.
- `src/lib/sanity/__tests__/fixtures.ts`: Realistic test fixtures for Janus Bifrous and mock documents.
- `src/lib/sanity/__tests__/run-tests.ts`: Automated test harness verifying validation rules, error handling, and Janus semantic parity.
- `08_DEPROS_CMS_06_IMPLEMENTATION_REPORT.md`: This comprehensive implementation deliverable.

---

### 3. Files Modified

- `package.json`: Added `"test:adapter": "npx tsx src/lib/sanity/__tests__/run-tests.ts"` script.

---

### 4. Dependencies Added

**Zero new dependencies added.**
The implementation leveraged existing dependencies installed in CMS-05 (`next-sanity@^9.12.3`, `sanity@^3.99.0`) and existing dev tooling (`tsx`).

---

### 5. Sanity Client Architecture

The read client (`src/lib/sanity/client.ts`) is designed strictly for **server-side data fetching**:
```typescript
export const sanityClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});
```

#### Key Design Decisions:
- **Server-Side Execution**: All data fetching happens in Server Components, Route Handlers, or build-time SSG routines. The client is never exposed to browser bundles.
- **Published Perspective**: Enforces `perspective: "published"` to guarantee that draft documents never enter the production pipeline during standard builds.
- **CDN Strategy**: `useCdn: false` during development for immediate feedback on editorial changes; `useCdn: true` in production.

---

### 6. GROQ Query Architecture

Located in `src/lib/sanity/queries.ts`, the queries use an explicit projection (`PROJECT_PROJECTION`) to retrieve only the fields needed to construct canonical models:

```groq
export const ALL_PORTFOLIO_ENTRIES_QUERY = `
  *[_type == "project" && defined(slug.current) && published != false && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    id,
    title,
    slug,
    subtitle,
    category,
    presentationType,
    contentSubtype,
    "client": client->{
      _id,
      _type,
      name,
      scope,
      industry,
      location
    },
    clientDisplayName,
    description,
    scope,
    year,
    featured,
    published,
    order,
    media[] {
      _key,
      alt,
      role,
      caption,
      asset-> {
        _id,
        url,
        mimeType,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          },
          lqip
        }
      }
    },
    framingConfig {
      layoutMode,
      editorialRows,
      gap,
      mobileStack
    },
    provenance {
      sourceDocument,
      sourcePage,
      sourceCategory,
      sourceTitle,
      sourceSubtitle,
      sourceClient
    }
  }
`;
```

---

### 7. Adapter Architecture

The adapter (`src/lib/sanity/adapter.ts`) performs deterministic transformation from vendor documents to canonical types:

```
Sanity Content Lake
        │ (GROQ query)
        ▼
Raw SanityProjectDocument
        │
        ├─► validateSanityProject() (Runtime assertions)
        │
        ├─► normalizeSanityMedia() (Extracts dimensions & calculates orientation)
        │
        ├─► Client Reference Resolution (client vs clientDisplayName)
        │
        ├─► Framing Configuration Parser (Handles JSON string or number[][])
        │
        └─► Identity Normalizer (canonical id vs slug)
        │
        ▼
CanonicalPortfolioEntry
```

---

### 8. Canonical Normalization Rules

| Source Sanity Field | Target Canonical Field | Transformation Rule |
| :--- | :--- | :--- |
| `id` / `_id` | `entry.id` | Uses explicit `id` or strips `project-` / `drafts.` prefix from `_id`. |
| `slug.current` | `entry.slug` | Direct string extraction. |
| `title` | `entry.title` | Direct string extraction. |
| `category` | `entry.category` & `entry.categorySlug` | Validated against 7 canonical `SemanticCategoryId` keys. |
| `presentationType` | `entry.presentationType` | `"standalone"` or `"grouped"` (defaults to `"standalone"`). |
| `contentSubtype` | `entry.contentSubtype` | Optional: `"marketing-kit"` or `"sales-tools"`. |
| `client->name` | `entry.client` | Extracted from expanded reference document. |
| `clientDisplayName` | `entry.clientDisplayName` | Preserved as editorial display override if provided. |
| `media[]` | `entry.media` & `entry.images` | Array of normalized `CanonicalMediaItem`. |
| `media[0]` (primary) | `entry.image` | Cover image URL for card rendering. |
| `framingConfig` | `entry.framingConfig` | Parsed into `{ layoutMode, mode, editorialRows, gap, mobileStack }`. |
| `featured` | `entry.featured` | Coerced to Boolean (`Boolean(doc.featured)`). |
| `published` | `entry.published` | `true` if published and not a draft ID. |

---

### 9. Validation Rules

`src/lib/sanity/validation.ts` enforces strict invariants via `SanityValidationError`:

1. **Title**: Non-empty string required.
2. **Slug**: Non-empty `slug.current` required.
3. **Category**: Must match one of:
   - `product-design`
   - `brand-identity`
   - `logos`
   - `corporate-identity`
   - `marketing-kit`
   - `graphic-visual`
   - `social-media-content`
4. **Presentation Type**: Must be `"standalone"` or `"grouped"`.
5. **Content Subtype**: When present, must be `"marketing-kit"` or `"sales-tools"`.
6. **Media Assets**:
   - Must contain at least 1 media item (`min(1)`).
   - Each item must have a valid `asset.url`.
   - Each item must have valid positive `metadata.dimensions.width` and `metadata.dimensions.height`.
   - Each item must have a non-empty `alt` string.
   - Each item must have a valid `role` (`"primary" | "detail" | "supporting" | "composite"`).

---

### 10. Client Resolution Strategy

The CMS models Client as a standalone entity to enable future client re-use.
- If `client` is expanded by GROQ, `entry.client` is populated with `client.name`.
- If `clientDisplayName` is editorially set on the Project document, it acts as the presentation override (`entry.clientDisplayName`).
- Raw `_ref` pointers or `SanityClientDocument` internal fields never leak to presentation components.

---

### 11. Media & Dimension Strategy

- **Zero CLS Guarantee**: Intrinsic dimensions (`width`, `height`, `aspectRatio`) are read directly from `asset.metadata.dimensions`.
- **Orientation Derivation**:
  - `aspectRatio > 2.0` → `"panoramic"`
  - `aspectRatio >= 1.05` → `"landscape"`
  - `aspectRatio <= 0.95` → `"portrait"`
  - `0.95 < aspectRatio < 1.05` → `"square"`
- **Master Asset Integrity**: Images are stored uncropped; frontend CSS (`object-contain`, `object-center`) handles responsive rendering.

---

### 12. Identity Mapping

- **Canonical Identity (`id`)**: Immutable identifier (e.g. `"janus-bifrous"`).
- **Public Routing Identity (`slug`)**: URL slug (`/work/[slug]`).
- **CMS Internal Identity (`_id`)**: Sanity document ID (e.g. `"project-janus-bifrous"`).
- The adapter decouples URL routing from internal Sanity IDs, allowing editorial slug updates without breaking data relationships.

---

### 13. Published-Content Strategy

The adapter query layer filters out drafts via:
- GROQ filter: `published != false && !(_id in path("drafts.**"))`
- Perspective: `perspective: "published"`
- Adapter validation: `published: doc.published !== false && !doc._id.startsWith("drafts.")`

*Draft Mode and live preview queries are strictly deferred to CMS-07.*

---

### 14. Janus Parity Results

The automated test runner compared the output of `adaptSanityProject(mockJanusSanityDoc)` against `CANONICAL_PORTFOLIO_ENTRIES[0]`:

| Attribute | Canonical Janus (`data.ts`) | Adapted Sanity Janus | Parity Status |
| :--- | :--- | :--- | :--- |
| **id** | `"janus-bifrous"` | `"janus-bifrous"` | **Match** |
| **slug** | `"janus-bifrous"` | `"janus-bifrous"` | **Match** |
| **title** | `"JANUS BIFROUS"` | `"JANUS BIFROUS"` | **Match** |
| **subtitle** | `"Artisan Beer"` | `"Artisan Beer"` | **Match** |
| **category** | `"product-design"` | `"product-design"` | **Match** |
| **presentationType** | `"standalone"` | `"standalone"` | **Match** |
| **client** | `"Locale Brewery"` | `"Locale Brewery"` | **Match** |
| **clientDisplayName** | `undefined` | `undefined` | **Match** |
| **description** | Exact string | Exact string | **Match** |
| **scope** | 4 disciplines | 4 disciplines | **Match** |
| **year** | `"2024"` | `"2024"` | **Match** |
| **featured / published / order** | `true / true / 1` | `true / true / 1` | **Match** |
| **media count** | 3 assets | 3 assets | **Match** |
| **media[0] (primary)** | 714x795 portrait | 714x795 portrait | **Match** |
| **media[1] (detail)** | 595x795 portrait | 595x795 portrait | **Match** |
| **media[2] (supporting)** | 595x795 portrait | 595x795 portrait | **Match** |
| **framingConfig** | `auto / md / mobileStack` | `auto / md / mobileStack` | **Match** |

---

### 15. Adapter Test Results

Executed `npm run test:adapter` (`npx tsx src/lib/sanity/__tests__/run-tests.ts`):

```
========================================================
 CMS-06: SANITY DATA ADAPTER & QUERY LAYER TEST HARNESS
========================================================

► [Part 12] Janus Canonical Semantic Parity Test
  ✓ PASS: Identity matches ('janus-bifrous')
  ✓ PASS: Slug matches ('janus-bifrous')
  ✓ PASS: Title matches ('JANUS BIFROUS')
  ✓ PASS: Subtitle matches ('Artisan Beer')
  ✓ PASS: Category matches ('product-design')
  ✓ PASS: Presentation type matches ('standalone')
  ✓ PASS: Client attribution matches ('Locale Brewery')
  ✓ PASS: Client display name matches
  ✓ PASS: Description matches
  ✓ PASS: Scope array matches
  ✓ PASS: Year matches ('2024')
  ✓ PASS: Featured status matches (true)
  ✓ PASS: Published status matches (true)
  ✓ PASS: Order matches (1)
  ✓ PASS: Media count matches (3 assets)
  ✓ PASS: Media [0] URL matches (/images/projects/janus-bifrous/bottle-left.png)
  ✓ PASS: Media [0] Alt text matches
  ✓ PASS: Media [0] Role matches (primary)
  ✓ PASS: Media [0] Width matches (714)
  ✓ PASS: Media [0] Height matches (795)
  ✓ PASS: Media [0] Aspect ratio matches
  ✓ PASS: Media [0] Orientation matches (portrait)
  ✓ PASS: Media [1] URL matches (/images/projects/janus-bifrous/circle-detail.png)
  ✓ PASS: Media [1] Alt text matches
  ✓ PASS: Media [1] Role matches (detail)
  ✓ PASS: Media [1] Width matches (595)
  ✓ PASS: Media [1] Height matches (795)
  ✓ PASS: Media [1] Aspect ratio matches
  ✓ PASS: Media [1] Orientation matches (portrait)
  ✓ PASS: Media [2] URL matches (/images/projects/janus-bifrous/bottle-right.png)
  ✓ PASS: Media [2] Alt text matches
  ✓ PASS: Media [2] Role matches (supporting)
  ✓ PASS: Media [2] Width matches (595)
  ✓ PASS: Media [2] Height matches (795)
  ✓ PASS: Media [2] Aspect ratio matches
  ✓ PASS: Media [2] Orientation matches (portrait)
  ✓ PASS: Framing layoutMode matches ('auto')
  ✓ PASS: Framing gap matches ('md')
  ✓ PASS: Framing mobileStack matches (true)

► [Part 13] Adapter Unit & Error Handling Tests
  ✓ PASS: Test 1: Valid project normalization
  ✓ PASS: Test 2: Invalid category throws SanityValidationError on 'category'
  ✓ PASS: Test 3: Invalid media role throws SanityValidationError on 'media[0].role'
  ✓ PASS: Test 4: Missing dimensions throws SanityValidationError on 'media[0].asset.metadata.dimensions'
  ✓ PASS: Test 5: Missing slug throws SanityValidationError on 'slug.current'
  ✓ PASS: Test 6a: Client document normalizes to canonical ClientItem
  ✓ PASS: Test 6b: Explicit clientDisplayName override is preserved
  ✓ PASS: Test 7: Framing config parses stringified editorialRows '[[0], [1, 2]]' into number[][]
  ✓ PASS: Test 8: Draft doc is recognized as published: false

========================================================
 SUMMARY: 48 passed, 0 failed
========================================================
```

---

### 16. Build & Route Verification

Executed `npm run build`:
```
Route (app)                                 Size  First Load JS
┌ ○ /                                    1.23 kB         112 kB
├ ○ /_not-found                            124 B         103 kB
├ ƒ /studio/[[...tool]]                  1.52 MB        1.62 MB
├ ƒ /work                                1.24 kB         112 kB
└ ● /work/[slug]                         1.24 kB         112 kB
    ├ /work/janus-bifrous
    ├ /work/coco-flamingo
    ├ /work/kraken-rum
    └ [+13 more paths]
+ First Load JS shared by all             103 kB
```
- **TypeScript Check**: Passed cleanly with zero type errors.
- **Static Page Generation**: All 21 static pages generated cleanly.

---

### 17. Production Isolation Confirmation

- **Active Data Source**: Production components (`SelectedWork.tsx`, `ProjectCard.tsx`, `/work`, `/work/[slug]`) continue importing directly from `src/lib/data.ts` (`CANONICAL_PORTFOLIO_ENTRIES`).
- **Media Files**: Production media remains served from `public/images/projects/`.
- **Zero Frontend Leaks**: No component imports `src/lib/sanity/` yet.

---

### 18. Known Limitations

- **No Fallback System**: CMS-06 implements clean error throwing for malformed documents. Automatic runtime fallback from Sanity failure to static `data.ts` will be implemented in CMS-10.
- **Local Asset Hosting**: In this phase, mock asset URLs point to local paths; real Sanity image CDN URLs (`https://cdn.sanity.io/...`) will be introduced upon asset migration.

---

### 19. Deferred CMS-07 Concerns

The following features were intentionally excluded and are scheduled for **CMS-07**:
1. Draft Mode & Next.js Preview API route (`/api/draft-mode/enable`, `/api/draft-mode/disable`).
2. On-demand ISR / Cache Revalidation Webhook Handler (`/api/revalidate`).
3. Sanity Live Visual Editing / Content Source Maps.
4. HMAC webhook signature verification.

---

### 20. Recommended Next Phase

Proceed to **CMS-07 — Sanity Live Preview & Revalidation Infrastructure**.
In CMS-07, we will configure draft mode, live visual editing in the Studio, and on-demand cache revalidation webhooks before performing content migration in CMS-08.
