import fs from "fs";
import path from "path";
import { buildMigrationPayload, MigrationPayload } from "./extractPayload";
import { validateSanityProject, validateSanityClient } from "../validation";
import { adaptSanityProjects } from "../adapter";
import { computeFramingRows } from "../../framing";
import { CANONICAL_PORTFOLIO_ENTRIES } from "../../data";

export interface DryRunValidationResult {
  status: "PASS" | "BLOCKED";
  projectCount: number;
  clientCount: number;
  mediaCount: number;
  issues: string[];
  summary: {
    uniqueProjectIds: number;
    uniqueSlugs: number;
    uniqueClientIds: number;
    standaloneProjects: number;
    groupedProjects: number;
    resolvedClientReferences: number;
    verifiedMediaOnDisk: number;
  };
}

export function executeDryRunValidation(): DryRunValidationResult {
  const payload: MigrationPayload = buildMigrationPayload();
  const issues: string[] = [];

  // 1. Project Count Validation
  if (payload.projects.length !== 16) {
    issues.push(`Expected exactly 16 portfolio projects, but found ${payload.projects.length}`);
  }

  // 2. Uniqueness Checks
  const projectIds = new Set<string>();
  const slugs = new Set<string>();
  payload.projects.forEach((p) => {
    if (projectIds.has(p.id!)) {
      issues.push(`Duplicate project ID detected: "${p.id}"`);
    }
    projectIds.add(p.id!);

    if (slugs.has(p.slug.current)) {
      issues.push(`Duplicate slug detected: "${p.slug.current}"`);
    }
    slugs.add(p.slug.current);
  });

  const clientIds = new Set<string>();
  payload.clients.forEach((c) => {
    if (clientIds.has(c._id)) {
      issues.push(`Duplicate client ID detected: "${c._id}"`);
    }
    clientIds.add(c._id);
  });

  // 3. Schema & Adapter Invariant Validation
  let resolvedClientRefs = 0;
  let standaloneCount = 0;
  let groupedCount = 0;

  payload.clients.forEach((c) => {
    try {
      validateSanityClient(c);
    } catch (err) {
      issues.push(`Client validation failed for "${c._id}": ${String(err)}`);
    }
  });

  payload.projects.forEach((p) => {
    try {
      validateSanityProject(p);
    } catch (err) {
      issues.push(`Project validation failed for "${p._id}": ${String(err)}`);
    }

    if (p.presentationType === "standalone") standaloneCount++;
    if (p.presentationType === "grouped") groupedCount++;

    if (p.client) {
      if (typeof p.client === "object" && "_id" in p.client) {
        resolvedClientRefs++;
      } else {
        issues.push(`Orphan or unresolvable client reference in project "${p._id}"`);
      }
    }
  });

  // 4. Media Asset Verification on Disk
  let verifiedMediaOnDisk = 0;
  payload.projects.forEach((p) => {
    p.media.forEach((m, idx) => {
      const relativeSrc = m.asset.url.replace(/^\//, "");
      const diskPath = path.join(process.cwd(), "public", relativeSrc);
      if (fs.existsSync(diskPath)) {
        verifiedMediaOnDisk++;
      } else {
        issues.push(`Media file missing on disk for project "${p._id}" [${idx}]: ${diskPath}`);
      }
    });
  });

  // 5. Full Adapter Normalization Test
  try {
    const adapted = adaptSanityProjects(payload.projects);
    if (adapted.length !== 16) {
      issues.push(`Adapter returned ${adapted.length} projects, expected 16`);
    }

    // Framing verification
    adapted.forEach((p, idx) => {
      const canonical = CANONICAL_PORTFOLIO_ENTRIES[idx];
      const rowsCanonical = computeFramingRows(canonical.media, canonical.framingConfig);
      const rowsAdapted = computeFramingRows(p.media, p.framingConfig);

      if (rowsCanonical.length !== rowsAdapted.length) {
        issues.push(`Framing row count mismatch for "${p.id}": canonical=${rowsCanonical.length}, adapted=${rowsAdapted.length}`);
      }
    });
  } catch (err) {
    issues.push(`Adapter normalization failed during dry run: ${String(err)}`);
  }

  const status = issues.length === 0 ? "PASS" : "BLOCKED";

  return {
    status,
    projectCount: payload.projects.length,
    clientCount: payload.clients.length,
    mediaCount: payload.totalMediaAssets,
    issues,
    summary: {
      uniqueProjectIds: projectIds.size,
      uniqueSlugs: slugs.size,
      uniqueClientIds: clientIds.size,
      standaloneProjects: standaloneCount,
      groupedProjects: groupedCount,
      resolvedClientReferences: resolvedClientRefs,
      verifiedMediaOnDisk,
    },
  };
}

if (require.main === module) {
  console.log("\n====================================================================");
  console.log(" CMS-09A: FULL CATALOG MIGRATION DRY-RUN & VALIDATION HARNESS");
  console.log("====================================================================\n");

  const result = executeDryRunValidation();

  console.log(`► Status: [${result.status}]`);
  console.log(`► Projects: ${result.projectCount} (${result.summary.standaloneProjects} standalone, ${result.summary.groupedProjects} grouped)`);
  console.log(`► Unique Slugs: ${result.summary.uniqueSlugs}`);
  console.log(`► Unique Clients: ${result.clientCount}`);
  console.log(`► Resolved Client References: ${result.summary.resolvedClientReferences}`);
  console.log(`► Total Media Assets: ${result.mediaCount} (${result.summary.verifiedMediaOnDisk} verified on disk)`);

  if (result.issues.length > 0) {
    console.error("\nIssues Encountered:");
    result.issues.forEach((issue, idx) => console.error(`  ${idx + 1}. ${issue}`));
    process.exit(1);
  } else {
    console.log("\n✓ All dry-run validation checks passed cleanly with ZERO issues.\n");
  }
}
