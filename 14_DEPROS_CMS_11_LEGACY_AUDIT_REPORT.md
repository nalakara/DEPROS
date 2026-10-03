# 14_DEPROS_CMS_11_LEGACY_AUDIT_REPORT.md
# CMS-11 — Post-Cutover Audit & Legacy Classification Report

---

## Executive Summary

**Phase:** CMS-11 — Post-Cutover Audit, Legacy Classification & Safe Cleanup  
**Scope:** Complete repository audit of runtime, rollback, test, migration, and historical artifacts following CMS-10 production cutover.  
**Audit Finding:** High architectural discipline across the codebase. Only one isolated Proof-of-Concept directory (`src/lib/cms-poc/`) from CMS-03 is classified as **SAFE TO REMOVE**. All other legacy artifacts (`src/lib/data.ts`, `public/images/projects/`, `src/lib/sanity/migration/`, and all 4 test suites) provide active operational value for **Rollback**, **Category Metadata**, **Disaster Recovery**, or **Regression Testing** and must be **INTENTIONALLY RETAINED**.

---

## 1. Runtime & Dependency Audit Findings (CMS-11A)

### 1.1 Direct Application Import Analysis
- **`src/app/page.tsx`**: Queries `getPortfolioEntries()` and `getClientItems()` from `src/lib/dataSource.ts`. Zero direct imports of `CANONICAL_PORTFOLIO_ENTRIES`.
- **`src/app/work/page.tsx`**: Queries `getPortfolioEntries()` from `src/lib/dataSource.ts`. Uses `CATEGORY_DISPLAY_NAMES` from `src/lib/data.ts` for human-readable labels.
- **`src/app/work/[slug]/page.tsx`**: Queries `getPortfolioEntries()` and `getPortfolioEntryBySlug()` from `src/lib/dataSource.ts`. Uses `CATEGORY_DISPLAY_NAMES` from `src/lib/data.ts`.
- **`src/components/studio/ClientIndex.tsx`**: Receives dynamic `clients?: ClientItem[]` prop with fallback to `NOTABLE_CLIENTS`.
- **`src/components/portfolio/` (`ArchiveCard`, `ArchiveFilter`, `ProjectCard`)**: Use `CATEGORY_DISPLAY_NAMES` for UI label display.

### 1.2 Rollback & Fallback Path Analysis
- **`src/lib/dataSource.ts`**: When `ENABLE_SANITY_CMS="false"` (or in the event of an emergency fallback), `dataSource.ts` directly reads `CANONICAL_PORTFOLIO_ENTRIES` and `NOTABLE_CLIENTS` from `src/lib/data.ts`.
- **Conclusion:** `src/lib/data.ts` is an active **ROLLBACK** dependency and cannot be deleted without eliminating the emergency fallback capability.

### 1.3 Media Storage Analysis
- **Production Mode (`ENABLE_SANITY_CMS="true"`):** Normalizes media through `src/lib/sanity/adapter.ts`.
- **Rollback Mode (`ENABLE_SANITY_CMS="false"`):** Resolves local static assets from `/images/projects/...` under `public/images/projects/`.
- **Test Suites:** Regression tests verify image dimensions and aspect ratios against local assets.
- **Conclusion:** `public/images/projects/` is an active **ROLLBACK / TEST / DISASTER RECOVERY** asset directory.

### 1.4 CMS Proof of Concept (`src/lib/cms-poc/`)
- Isolated implementation directory from CMS-03 evaluating Sanity vs Payload.
- Search across `src/` and `package.json` confirms **0 active imports** and **0 references**.
- **Conclusion:** `src/lib/cms-poc/` is **SAFE TO REMOVE**.

---

## 2. Comprehensive Legacy Classification Table (CMS-11B)

| File / Directory | Classification | Runtime Required | Rollback Required | Test Required | Migration Value | Recommended Action |
|---|---|---|---|---|---|---|
| `src/lib/dataSource.ts` | **ACTIVE RUNTIME** | **YES** | **YES** | **YES** | NO | **RETAIN** (Primary Data Boundary) |
| `src/lib/types.ts` | **ACTIVE RUNTIME** | **YES** | **YES** | **YES** | **YES** | **RETAIN** (Canonical Domain Types) |
| `src/lib/framing.ts` | **ACTIVE RUNTIME** | **YES** | **YES** | **YES** | NO | **RETAIN** (Visual Framing Engine) |
| `src/lib/sanity/client.ts` | **ACTIVE RUNTIME** | **YES** | NO | **YES** | NO | **RETAIN** (Sanity Client Factory) |
| `src/lib/sanity/queries.ts` | **ACTIVE RUNTIME** | **YES** | NO | **YES** | NO | **RETAIN** (GROQ Queries) |
| `src/lib/sanity/fetchers.ts` | **ACTIVE RUNTIME** | **YES** | NO | **YES** | NO | **RETAIN** (Sanity Fetcher Layer) |
| `src/lib/sanity/adapter.ts` | **ACTIVE RUNTIME** | **YES** | NO | **YES** | **YES** | **RETAIN** (Domain Normalization Layer) |
| `src/lib/sanity/types.ts` | **ACTIVE RUNTIME** | **YES** | NO | **YES** | **YES** | **RETAIN** (Sanity Schema DTO Types) |
| `src/lib/data.ts` | **ROLLBACK / METADATA** | **YES (Labels)**| **YES** | **YES** | **YES** | **RETAIN** (Fallback & Category Dictionary) |
| `public/images/projects/` | **ROLLBACK / TEST ASSET** | NO (in Sanity) | **YES** | **YES** | **YES** | **RETAIN** (Fallback Assets & Test Baseline) |
| `src/lib/sanity/migration/` | **MIGRATION / RECOVERY** | NO | NO | **YES** | **YES** | **RETAIN** (Disaster Recovery & Re-sync Tools) |
| `src/lib/cms-poc/` | **SAFE TO REMOVE** | NO | NO | NO | NO | **SAFE TO REMOVE** (CMS-03 POC Residue) |
| `src/lib/sanity/__tests__/` | **TEST INFRASTRUCTURE** | NO | NO | **YES** | NO | **RETAIN** (Permanent Regression Test Suites) |
| `01_...` to `13_...` Reports | **DOCUMENTATION** | NO | NO | NO | NO | **RETAIN** (Architectural Audit Trail) |

---

## 3. Aggregate Summary

- **Active Runtime Assets:** `dataSource.ts`, `types.ts`, `framing.ts`, `sanity/` core layer, `data.ts` (`CATEGORY_DISPLAY_NAMES`).
- **Rollback Assets:** `src/lib/data.ts` (`CANONICAL_PORTFOLIO_ENTRIES`, `NOTABLE_CLIENTS`), `public/images/projects/`.
- **Test Infrastructure:** All 4 test suites (`test:adapter`, `test:pilot`, `test:catalog`, `test:cms10`).
- **Migration & Disaster Recovery:** `src/lib/sanity/migration/` (`extractPayload.ts`, `validateDryRun.ts`, `migrateCatalog.ts`).
- **Documentation:** Reports `01_...` through `13_...`.
- **Safe to Remove:** `src/lib/cms-poc/`.
- **Uncertain Items:** **NONE (0 items)**.

---

## 4. Hard Gate Checkpoint Decision

**Gate Status:** **APPROVED FOR CMS-11C SAFE CLEANUP**
- Only `src/lib/cms-poc/` is scheduled for removal.
- All rollback mechanisms, canonical types, and regression test suites are preserved.
