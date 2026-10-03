# 16_DEPROS_CMS_12_SUPABASE_EVALUATION_AND_ARCHITECTURE_PIVOT.md
# CMS-12 — DEPROS Supabase Content Console Evaluation & Architecture Pivot
## Strategic Evaluation, Architectural Comparison & Migration Blueprint

---

## 1. Executive Decision

**Recommendation:** **PIVOT TO NATIVE SUPABASE CONTENT CONSOLE (REPLACE SANITY.IO)**

**Summary Decision:**  
Sanity.io successfully served as the evaluation target to prove canonical normalization and editorial separation in CMS-01 through CMS-11. However, evaluating the actual non-developer user requirement (the portfolio owner managing projects, media uploads, and publishing without developer intervention) against the operational reality reveals that **Sanity introduces unnecessary third-party SaaS friction, external vendor lock-in, recurring pricing/quota risks, proprietary GROQ abstractions, and a heavy 1.5MB+ embedded Studio bundle with styled-components dependencies**.

In contrast, a **DEPROS-native Content Console backed by Supabase (PostgreSQL + Supabase Storage + Supabase Auth + Next.js Server Actions)** provides:
1. **Zero Vendor Overhead:** Direct relational data model (`projects`, `clients`, `project_media`) matching DEPROS canonical domain structures with zero GROQ translation layer.
2. **Unified Owner Experience:** A bespoke, elegant DEPROS-branded admin UI (`/studio` or `/admin`) built directly in Tailwind CSS matching DEPROS design aesthetics without third-party Studio chrome.
3. **Internal Architecture Consistency:** Directly leverages the proven, battle-tested architectural pattern from Nalakara Web (Supabase Auth, RLS, Storage, Server Actions, on-demand revalidation, and static fallback).
4. **Permanent Offline & Self-Hosted Freedom:** No external SaaS dependency or dataset billing tiers; complete data sovereignty and standard SQL backups.
5. **Preservation of Canonical Contract:** The existing application boundary (`src/lib/types.ts`, `src/lib/framing.ts`, `src/lib/dataSource.ts`, and `ProjectFraming.tsx`) remains 100% untouched. Only the underlying data fetcher/adapter transitions from Sanity GROQ to Supabase SQL.

---

## 2. Actual DEPROS Requirement Analysis

To ensure architectural discipline, we separate the system into three distinct requirement tiers:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. PORTFOLIO RENDERING REQUIREMENT (Frontend / Visitor Facing)           │
│    - High-aesthetic editorial showcase with razor-sharp framing         │
│    - Deterministic grid rows via computeFramingRows()                   │
│    - Fast static delivery (SSG / ISR), sub-second page loads            │
│    - Zero layout drift, zero visual compromise                          │
├─────────────────────────────────────────────────────────────────────────┤
│ 2. CONTENT MANAGEMENT REQUIREMENT (Data / Editorial Authority)          │
│    - 16 presentation units (14 standalone + 2 grouped roster entries)   │
│    - 20 unique client entities with attribution and metadata            │
│    - 26+ lossless media assets with intrinsic dimensions & roles        │
│    - Published vs. Draft lifecycle with instant revalidation            │
├─────────────────────────────────────────────────────────────────────────┤
│ 3. NON-DEVELOPER EDITING REQUIREMENT (Owner / Studio Operator Facing)   │
│    - Intuitive, password-protected browser UI at /studio                │
│    - Drag-and-drop artwork upload with auto-calculated dimensions       │
│    - Simple drag/reorder of media assets                                │
│    - One-click "Save Draft", "Preview", and "Publish"                   │
│    - No knowledge of TypeScript, Git, GROQ, or Vercel deployments       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. What CMS-01–CMS-11 Already Solved (Permanent Assets)

The work completed in CMS-01 through CMS-11 established vital architectural boundaries that remain authoritative and must be preserved:

1. **Canonical Domain Model (`src/lib/types.ts`):** `CanonicalPortfolioEntry`, `ClientItem`, `CanonicalMediaItem`, and `FramingConfig` represent the immutable domain standard.
2. **Visual Framing Engine (`src/lib/framing.ts`):** `computeFramingRows()` and `detectOrientation()` compute deterministic responsive rows without visual compromise.
3. **Data-Source Boundary (`src/lib/dataSource.ts`):** Established a single runtime boundary (`getPortfolioEntries()`, `getPortfolioEntryBySlug()`, `getClientItems()`) isolating the frontend from vendor specifics.
4. **Parity & Regression Verification Suite:** 586 automated assertions verifying semantic, media, framing, homepage, and archive filtering integrity.
5. **Local Canonical Dataset (`src/lib/data.ts`):** Complete catalog dataset available for immediate offline fallback and database seeding.

---

## 4. What Sanity Currently Provides vs. Operating Reality

| Sanity Responsibility | Implementation in CMS-05–CMS-10 | Operating Reality / Friction Points |
|---|---|---|
| **Content Persistence** | Sanity Content Lake (JSON Document Graph) | Proprietary document store; mutations require Sanity mutation API / GROQ syntax. |
| **Editorial UI** | Embedded Sanity Studio (`/studio`) | Heavy bundle (1.46MB JS), styled-components peer dependency conflicts with React 19, generic third-party UI. |
| **Authentication** | Sanity Management OAuth | Non-developer owner must authenticate through Sanity's external login portal rather than DEPROS site directly. |
| **Media Storage** | Sanity CDN (`cdn.sanity.io`) | Third-party asset hosting; external URL references requiring custom loader or domain whitelist. |
| **Media Metadata** | Sanity Image Asset Pipeline | Auto-extracts dimensions, but requires GROQ asset dereferencing (`asset->metadata.dimensions`). |
| **Draft & Publish** | Sanity Document Drafts (`drafts.<id>`) | Requires separate `previewDrafts` perspective and server read token. |
| **Revalidation** | External Webhook (`/api/revalidate`) | Requires public HMAC webhook setup, signature verification, and external webhook configuration in Sanity dashboard. |

---

## 5. Sanity vs. Supabase Comparison Matrix

| Capability | Current Sanity Implementation | Proposed Supabase Implementation | DEPROS Need | Recommendation |
|---|---|---|---|---|
| **Data Model & Querying** | Document Lake queried via GROQ | Relational PostgreSQL with SQL / PostgREST SDK | Strict relational integrity (`projects` → `clients`, `project_media`) | **Supabase** (Clean relational schema) |
| **Editorial Interface** | Generic Sanity Studio (`sanity.config.ts`) | Bespoke DEPROS Content Console (`/studio`) in Tailwind | Tailored, lightweight UI specifically for DEPROS portfolio owner | **Supabase** (Tailored UI, 0 bundle bloat) |
| **Authentication** | Sanity OAuth (Google / GitHub / Sanity) | Supabase Auth (Email + Password / Magic Link) | Simple, single-owner login directly on the DEPROS site | **Supabase** (Native site auth) |
| **Media & Artwork Storage** | Sanity Asset Lake + CDN | Supabase Storage (`portfolio-media` public bucket) | Lossless asset storage with direct URL access | **Supabase** (Direct S3-compatible storage) |
| **Metadata Extraction** | Automatic backend asset processing | Client-side `Image()` dimension check on upload | Intrinsic `width`, `height`, `aspectRatio`, `orientation` | **Supabase** (Fast client extraction) |
| **Draft / Publish State** | Dual document IDs (`drafts.xyz` vs `xyz`) | Simple `status` enum (`draft`, `published`, `archived`) | Straightforward editorial flag | **Supabase** (Standard column filter) |
| **Live Preview** | Next.js Draft Mode + `previewDrafts` token | Next.js Draft Mode + secure token query | View unpublished drafts before making live | **Supabase** (Direct SQL query) |
| **Cache Revalidation** | External inbound HMAC webhook | Next.js Server Action with direct `revalidatePath()` | Instant cache invalidation upon saving/publishing | **Supabase** (Deterministic Server Actions) |
| **Dependencies & Bundle** | `sanity`, `next-sanity`, `styled-components` (+1.5MB) | `@supabase/supabase-js`, `@supabase/ssr` (<50KB) | Fast build, clean React 19 compatibility | **Supabase** (Massive bundle reduction) |
| **Operational Independence** | Third-party SaaS reliance & dataset limits | Standard PostgreSQL (self-hostable or Supabase Cloud) | Long-term autonomy & data ownership | **Supabase** (Complete sovereignty) |

---

## 6. Nalakara Architectural Pattern Reuse

The existing Nalakara Web architecture provides a proven, field-tested reference.

### What to REUSE from Nalakara:
1. **Database Client Separation:** Clean separation of Public Client (browser/anon read), Server Client (authenticated Server Components), and Admin Client (privileged Server Actions).
2. **Row Level Security (RLS):**
   - Public: `SELECT` allowed only where `status = 'published'`.
   - Authenticated Admin: Full `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
3. **Server Actions for Content Mutations:** Clean Next.js Server Actions handling form submission, media upload, database upsert, and cache invalidation in a single transactional step.
4. **On-Demand Revalidation Pattern:** Immediate invocation of `revalidatePath('/', 'page')`, `revalidatePath('/work', 'page')`, and `revalidateTag('portfolio')` inside mutation Server Actions.
5. **Static Fallback Resilience:** Graceful fallback to local canonical fixtures if the database is unreachable during offline development.

### What NOT to Copy (Avoid Over-Engineering):
1. **No Complex Multi-Role RBAC:** DEPROS is a single-owner studio; a simple authenticated admin role is sufficient.
2. **No E-Commerce / Transactional Systems:** DEPROS is an editorial portfolio, not a transactional shop.
3. **No Dynamic Form Builders:** Specific, tailored forms for Projects and Clients are superior to generic JSON form schemas.
4. **No Complex Taxonomies:** The 7 fixed semantic categories (`product-design`, `brand-identity`, etc.) are stable and do not need dynamic taxonomy management tables.

---

## 7. Proposed DEPROS Architecture

```
                                PROPOSED DEPROS ARCHITECTURE
                                
  [ Portfolio Owner / Wife ]                        [ Public Website Visitors ]
             │                                                  │
             ▼                                                  ▼
     ┌───────────────┐                                  ┌───────────────┐
     │ /studio Login │                                  │  /, /work,    │
     │ (Supabase Auth│                                  │  /work/[slug] │
     └───────┬───────┘                                  └───────┬───────┘
             │                                                  │
             ▼                                                  ▼
     ┌───────────────┐                                  ┌───────────────┐
     │ DEPROS Content│                                  │ dataSource.ts │
     │    Console    │                                  └───────┬───────┘
     └───────┬───────┘                                          │
             │                                                  ▼
             ▼ (Server Actions)                         ┌───────────────┐
     ┌───────────────┐                                  │SupabaseAdapter│
     │  Supabase DB  │◄─────────────────────────────────┤   (SQL/REST)  │
     │  & S3 Storage │  (Public Read via RLS:           └───────────────┘
     └───────────────┘   status = 'published')                  │
             │                                                  ▼
             │ (Direct on publish)                      ┌───────────────┐
             └─────────────────────────────────────────►│ revalidatePath│
                                                        └───────────────┘
```

---

## 8. Minimum Supabase Relational Data Model

The relational schema directly mirrors `CanonicalPortfolioEntry` and `ClientItem`:

### 8.1 Table: `clients`
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  scope TEXT,
  industry TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 8.2 Table: `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'product-design', 'brand-identity', 'logos', 
    'corporate-identity', 'marketing-kit', 'graphic-visual', 'social-media-content'
  )),
  presentation_type TEXT NOT NULL DEFAULT 'standalone' CHECK (presentation_type IN ('standalone', 'grouped')),
  content_subtype TEXT CHECK (content_subtype IN ('marketing-kit', 'sales-tools')),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_display_name TEXT,
  description TEXT,
  scope TEXT[] DEFAULT '{}',
  year TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INTEGER DEFAULT 99,
  framing_config JSONB DEFAULT '{"layoutMode": "auto", "gap": "hairline", "mobileStack": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 8.3 Table: `project_media`
```sql
CREATE TABLE project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary', 'detail', 'supporting', 'composite')),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  aspect_ratio NUMERIC(5, 3) NOT NULL,
  orientation TEXT NOT NULL CHECK (orientation IN ('portrait', 'landscape', 'square', 'panoramic')),
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_project_media_project_id ON project_media(project_id, display_order);
```

---

## 9. Media & Artwork Architecture

### 9.1 Storage Bucket Configuration
- **Bucket Name:** `portfolio-media` (Public read access).
- **Directory Structure:** `projects/<project-slug>/<filename>`.
- **Integrity Guarantee:** Assets are stored uncropped in original fidelity.

### 9.2 Client-Side Dimension & Orientation Calculation
When an image is dropped into the Content Console uploader:
```typescript
export async function extractImageMetadata(file: File): Promise<{
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'portrait' | 'landscape' | 'square' | 'panoramic';
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const ratio = width / height;
      let orientation: 'portrait' | 'landscape' | 'square' | 'panoramic' = 'landscape';
      if (ratio > 2.0) orientation = 'panoramic';
      else if (ratio >= 1.15) orientation = 'landscape';
      else if (ratio <= 0.88) orientation = 'portrait';
      else orientation = 'square';

      resolve({
        width,
        height,
        aspectRatio: Number((width / height).toFixed(3)),
        orientation,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
```
*Benefits:* Fast, zero server CPU overhead, guaranteed dimension accuracy before upload.

---

## 10. Content Console UI Scope (`/studio`)

A lightweight, high-elegance studio application built with Next.js and Tailwind CSS:

1. **Authentication Screen (`/studio/login`):** Clean DEPROS logo, email & password input, Supabase Auth session creation.
2. **Project Dashboard (`/studio`):**
   - Table of 16 projects showing Title, Category, Client, Status (`Draft` / `Published`), and Order.
   - Quick action to Reorder or Toggle Featured.
   - Button: `+ New Project`.
3. **Project Editor (`/studio/projects/[id]`):**
   - **Main Details:** Title, Subtitle, Category dropdown, Client selector (with inline `+ Add Client`), Year, Description.
   - **Scope Tags:** Visual tag manager for deliverables (e.g. `Bottle Design`, `3D Rendering`).
   - **Media Gallery Manager:**
     - Drag-and-drop file upload zone.
     - Grid of uploaded images with thumbnail preview.
     - Role dropdown (`Primary / Cover`, `Supporting`, `Detail`, `Composite`).
     - Alt text input and Caption input per asset.
     - Drag handle to reorder images.
   - **Framing Settings:** Simple toggle between `Auto Layout` and `Custom Gap`.
   - **Action Footer:** `Save Draft`, `Preview Live`, `Publish to Portfolio`, `Delete`.
4. **Client Manager (`/studio/clients`):** Simple list and creation modal for client entities.

---

## 11. Draft, Publish & Live Preview Lifecycle

1. **Draft State:** Saved with `status = 'draft'`. Accessible only in `/studio` or via Next.js Draft Mode token.
2. **Live Preview:** Clicking "Preview" opens `/api/draft-mode/enable?slug=<slug>&secret=<secret>`, enabling Draft Mode cookies and rendering the un-published draft live on the actual `/work/[slug]` route.
3. **Publishing:** Setting `status = 'published'` commits the state in PostgreSQL and immediately executes:
   ```typescript
   revalidatePath('/');
   revalidatePath('/work');
   revalidatePath(`/work/${slug}`);
   revalidateTag('portfolio');
   ```

---

## 12. Security Architecture

1. **Supabase Auth:** Single admin account for the studio owner.
2. **Row Level Security (RLS) Policies:**
   - `clients`: Public can `SELECT` all. Only Authenticated can `INSERT`, `UPDATE`, `DELETE`.
   - `projects`: Public can `SELECT` where `status = 'published'`. Only Authenticated can `INSERT`, `UPDATE`, `DELETE`.
   - `project_media`: Public can `SELECT` where parent project `status = 'published'`. Authenticated can write.
3. **Storage Security:** `portfolio-media` bucket allows public `GET`. Only authenticated users can `POST` or `DELETE`.
4. **Zero Client-Side Service Secrets:** Server Actions run with authenticated user cookies or server context. No `service_role` keys are ever shipped to browser JavaScript.

---

## 13. Controlled Migration Strategy (Avoiding CMS Redundancy)

Instead of repeating 10 phases, the migration to Supabase executes in **3 focused steps**:

```
                              MIGRATION ROADMAP
                              
    Step 1: Vertical Slice POC (CMS-13)
            - Initialize Supabase schema & storage bucket
            - Implement Supabase adapter for Janus Bifrous
            - Verify 100% semantic & framing parity on 1 reference project
            
    Step 2: Full Catalog Ingestion & Studio UI (CMS-14)
            - Run deterministic seed script from src/lib/data.ts
            - Upload 26 assets to Supabase Storage
            - Deploy lightweight DEPROS Content Console at /studio
            - Execute full 586-test parity suite against Supabase adapter
            
    Step 3: Production Cutover & Sanity Decommission (CMS-15)
            - Switch dataSource.ts to Supabase
            - Uninstall Sanity packages (sanity, next-sanity, styled-components)
            - Delete legacy Sanity directory (src/lib/sanity/)
            - Final production verification
```

---

## 14. Vertical Slice Definition (`janus-bifrous`)

The initial POC will migrate exactly **1 project** (`janus-bifrous`):
- **Client:** `Locale Brewery` (`client-locale-brewery`)
- **Project:** `JANUS BIFROUS` (`project-janus-bifrous`)
- **Media:** 3 assets (`bottle-left.png`, `circle-detail.png`, `bottle-right.png`)
- **Verification Gate:**
  1. Supabase adapter output passes deep semantic parity against `canonical-janus-before.json`.
  2. `computeFramingRows()` produces identical 1-row, 3-column layout.
  3. Homepage Selected Work renders Janus identically.

---

## 15. Acceptance Criteria

- [ ] Non-developer studio owner can log in at `/studio` with email & password.
- [ ] Studio owner can create a new project, upload artwork, reorder media, and set roles.
- [ ] Image dimensions, aspect ratios, and orientations are automatically extracted upon upload.
- [ ] Draft projects are completely invisible on public `/`, `/work`, and `/work/[slug]` routes.
- [ ] Draft projects can be previewed in real-time on `/work/[slug]` via Draft Mode.
- [ ] Publishing a project triggers instant cache invalidation via Next.js `revalidatePath`.
- [ ] All 16 presentation units and 20 clients render with 100% semantic and visual framing parity.
- [ ] Zero Sanity vendor packages or dependencies remain in `package.json`.
- [ ] Bundle size is reduced by >1.5MB.
- [ ] Production build succeeds with 0 TypeScript errors.

---

## 16. Risk Assessment & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| **Dimension Calculation Drift** | Layout distortion | Low | Auto-extract natural dimensions via browser `Image` API prior to upload; validate against strict integer constraints in SQL. |
| **Storage Upload Failure** | Missing artwork | Low | Direct Supabase Storage client upload with rollback/retry error handling in Content Console UI. |
| **Unauthenticated Data Modification** | Data tampering | Very Low | Strict PostgreSQL RLS policies enforcing authenticated session checks for all mutations. |
| **Cache Staleness** | Delayed updates | Low | Direct `revalidatePath` and `revalidateTag` in Next.js Server Actions on publication. |
| **Migration Interruption** | Partial catalog | Low | Deterministic seed script from `src/lib/data.ts` using upsert (`ON CONFLICT (slug) DO UPDATE`). |

---

## 17. Architecture Decision Record (ADR)

### ADR-002: Pivot from Sanity.io to Native Supabase Content Console

- **Status:** **APPROVED & RECOMMENDED**
- **Context:** DEPROS requires a straightforward, browser-based content management console for the non-developer studio owner. Sanity.io introduced third-party vendor lock-in, recurring quota risks, heavy 1.5MB bundle bloat, React 19 styled-components conflicts, and external login hurdles.
- **Decision:** Replace Sanity.io with a native DEPROS Content Console powered by Supabase (PostgreSQL, Storage, Auth, RLS) and Next.js Server Actions. Maintain the canonical domain boundary (`src/lib/types.ts`, `src/lib/framing.ts`, `src/lib/dataSource.ts`).
- **Consequences:**
  - *Positive:* 100% data sovereignty, zero SaaS billing risks, native DEPROS-branded Studio UI, -1.5MB bundle size, cleaner React 19 stack, faster build times.
  - *Negative:* DEPROS maintains its own lightweight console UI (~3 pages/components) rather than relying on an off-the-shelf studio.
- **Rollback:** Local canonical fallback (`src/lib/data.ts`) remains active in `src/lib/dataSource.ts` until full Supabase cutover is verified.

---

## 18. Sanity Footprint Audit & Decommissioning Map

| Artifact | Classification | Supabase Replacement | Timing | Reason |
|---|---|---|---|---|
| `package.json` (`sanity`, `next-sanity`, `styled-components`) | **MUST REMOVE** | `@supabase/supabase-js`, `@supabase/ssr` | Post-Cutover (CMS-15) | Removes 1.5MB+ bloat & styling conflicts |
| `sanity.config.ts` | **MUST REMOVE** | None (Native Next.js pages) | Post-Cutover (CMS-15) | Obsolete Studio config |
| `src/sanity/env.ts` | **MUST REPLACE** | `src/lib/supabase/env.ts` | Vertical Slice (CMS-13) | Replaced by Supabase URL/keys |
| `src/sanity/schemaTypes/` | **MUST REPLACE** | PostgreSQL SQL Migrations | Vertical Slice (CMS-13) | Replaced by relational SQL tables |
| `src/app/studio/[[...tool]]/` | **MUST REPLACE** | `src/app/studio/` (DEPROS Console) | Console Phase (CMS-14) | Replaced by native studio UI |
| `src/lib/sanity/client.ts` | **MUST REPLACE** | `src/lib/supabase/server.ts` | Vertical Slice (CMS-13) | Replaced by Supabase client |
| `src/lib/sanity/queries.ts` | **MUST REPLACE** | SQL queries / Supabase fetchers | Vertical Slice (CMS-13) | Replaced by PostgREST query functions |
| `src/lib/sanity/fetchers.ts` | **MUST REPLACE** | `src/lib/supabase/fetchers.ts` | Vertical Slice (CMS-13) | Replaced by Supabase fetchers |
| `src/lib/sanity/adapter.ts` | **MUST REPLACE** | `src/lib/supabase/adapter.ts` | Vertical Slice (CMS-13) | Replaced by Supabase row adapter |
| `src/lib/sanity/types.ts` | **MUST REPLACE** | `src/lib/supabase/types.ts` | Vertical Slice (CMS-13) | Replaced by Supabase DB types |
| `src/lib/sanity/migration/` | **MUST REPLACE** | `src/lib/supabase/seed.ts` | Ingestion (CMS-14) | Replaced by Supabase seeder |
| `src/app/api/revalidate/` | **MAY RETAIN / REVISE** | Direct Server Action revalidation | Ingestion (CMS-14) | Simplified to native Server Actions |
| `src/app/api/draft-mode/` | **MAY RETAIN** | Next.js Draft Mode Handler | Ingestion (CMS-14) | Standard Next.js preview endpoint |
| Reports `01_` through `15_` | **HISTORICAL — RETAIN** | None | Permanent | Complete architectural record |

---

## 19. Next Phase Definition

### Next Phase: **CMS-13 — Supabase Vertical Slice & Reference Parity POC**

**Scope of CMS-13:**
1. Provision Supabase relational schema (`clients`, `projects`, `project_media`) and `portfolio-media` storage bucket.
2. Implement `src/lib/supabase/adapter.ts` and `src/lib/supabase/fetchers.ts`.
3. Seed `janus-bifrous` reference project and verify 100% semantic and framing parity.
4. Keep all production frontend routes intact on existing baseline.

---

## 20. Conclusion

The architectural evaluation confirms that pivoting from Sanity to a **native Supabase Content Console** is the optimal path for DEPROS. It satisfies the non-developer studio owner requirements with superior simplicity, performance, and long-term autonomy while completely honoring the canonical design and framing contracts established in CMS-01 through CMS-11.
