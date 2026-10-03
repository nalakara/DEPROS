import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { CANONICAL_PORTFOLIO_ENTRIES } from "../../data";
import { fetchSupabaseProjectBySlug, fetchSupabaseProjects } from "../fetchers";
import { computeFramingRows } from "../../framing";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const k = trimmed.substring(0, eqIdx).trim();
      let v = trimmed.substring(eqIdx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.substring(1, v.length - 1);
      }
      process.env[k] = v;
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials in environment.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function seedJanusPilot() {
  console.log("\n========================================================");
  console.log(" CMS-13: SEED JANUS BIFROUS PILOT INTO SUPABASE");
  console.log("========================================================\n");

  // 1. Seed Client: Locale Brewery
  console.log("► [1/4] Upserting client: Locale Brewery");
  const clientPayload = {
    slug: "locale-brewery",
    name: "Locale Brewery",
    scope: "Brand Development & Packaging",
    industry: "Brewery / Hospitality",
    location: "Bali, Indonesia",
  };

  const { data: clientRow, error: clientErr } = await supabase
    .from("clients")
    .upsert(clientPayload, { onConflict: "slug" })
    .select()
    .single();

  if (clientErr) {
    throw new Error(`Failed to upsert client: ${clientErr.message}`);
  }
  console.log(`  ✓ Client seeded: ${clientRow.name} (${clientRow.id})`);

  // 2. Upload media assets to Supabase Storage: portfolio-media
  console.log("\n► [2/4] Uploading media assets to 'portfolio-media' storage bucket");
  const mediaFiles = [
    {
      filename: "bottle-left.png",
      localPath: path.resolve(process.cwd(), "public/images/projects/janus-bifrous/bottle-left.png"),
      storagePath: "projects/janus-bifrous/bottle-left.png",
      alt: "JANUS BIFROUS - Bottle Front View on Warm Beige",
      role: "primary",
      width: 714,
      height: 795,
      aspect_ratio: Number((714 / 795).toFixed(3)),
      orientation: "portrait",
      caption: null,
      display_order: 0,
    },
    {
      filename: "circle-detail.png",
      localPath: path.resolve(process.cwd(), "public/images/projects/janus-bifrous/circle-detail.png"),
      storagePath: "projects/janus-bifrous/circle-detail.png",
      alt: "JANUS BIFROUS - Brand Identity Emblem & Geometric Detail",
      role: "detail",
      width: 595,
      height: 795,
      aspect_ratio: Number((595 / 795).toFixed(3)),
      orientation: "portrait",
      caption: "Bespoke heraldic badge and geometric embossing.",
      display_order: 1,
    },
    {
      filename: "bottle-right.png",
      localPath: path.resolve(process.cwd(), "public/images/projects/janus-bifrous/bottle-right.png"),
      storagePath: "projects/janus-bifrous/bottle-right.png",
      alt: "JANUS BIFROUS - Bottle Angled View on Obsidian Black",
      role: "supporting",
      width: 595,
      height: 795,
      aspect_ratio: Number((595 / 795).toFixed(3)),
      orientation: "portrait",
      caption: null,
      display_order: 2,
    },
  ];

  const uploadedMediaItems = [];

  for (const item of mediaFiles) {
    const fileBuffer = fs.readFileSync(item.localPath);
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from("portfolio-media")
      .upload(item.storagePath, fileBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadErr) {
      console.warn(`  ⚠ Upload note for ${item.filename}: ${uploadErr.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(item.storagePath);

    console.log(`  ✓ Asset ready: ${item.filename} -> ${publicUrlData.publicUrl}`);
    uploadedMediaItems.push({
      ...item,
      src: publicUrlData.publicUrl,
    });
  }

  // 3. Seed Project: janus-bifrous
  console.log("\n► [3/4] Upserting project: janus-bifrous");
  const canonicalJanus = CANONICAL_PORTFOLIO_ENTRIES.find((p) => p.slug === "janus-bifrous")!;

  const projectPayload = {
    slug: "janus-bifrous",
    title: canonicalJanus.title,
    subtitle: canonicalJanus.subtitle,
    category: canonicalJanus.category,
    presentation_type: canonicalJanus.presentationType,
    content_subtype: canonicalJanus.contentSubtype || null,
    client_id: clientRow.id,
    client_display_name: canonicalJanus.clientDisplayName || null,
    description: canonicalJanus.description,
    scope: canonicalJanus.scope || [],
    year: canonicalJanus.year,
    featured: canonicalJanus.featured ?? true,
    status: "published",
    display_order: canonicalJanus.order ?? 1,
    framing_config: canonicalJanus.framingConfig || {
      layoutMode: "auto",
      gap: "md",
      mobileStack: true,
    },
    provenance: canonicalJanus.provenance || {
      sourceDocument: "PF DEPROS 2026_B.pdf",
      sourcePage: 5,
      sourceCategory: "01 / DEP ROS PRODUCT DESIGN",
      sourceTitle: "JANUS BIFROUS",
      sourceSubtitle: "Artisan Beer",
      sourceClient: "Locale Brewery",
    },
  };

  const { data: projectRow, error: projectErr } = await supabase
    .from("projects")
    .upsert(projectPayload, { onConflict: "slug" })
    .select()
    .single();

  if (projectErr) {
    throw new Error(`Failed to upsert project: ${projectErr.message}`);
  }
  console.log(`  ✓ Project seeded: ${projectRow.title} (${projectRow.id})`);

  // Delete existing media for project and insert fresh media
  await supabase.from("project_media").delete().eq("project_id", projectRow.id);

  const mediaRowsToInsert = uploadedMediaItems.map((item) => ({
    project_id: projectRow.id,
    src: item.src,
    alt: item.alt,
    role: item.role,
    width: item.width,
    height: item.height,
    aspect_ratio: item.aspect_ratio,
    orientation: item.orientation,
    caption: item.caption,
    display_order: item.display_order,
  }));

  const { error: mediaInsertErr } = await supabase
    .from("project_media")
    .insert(mediaRowsToInsert);

  if (mediaInsertErr) {
    throw new Error(`Failed to insert project media: ${mediaInsertErr.message}`);
  }
  console.log(`  ✓ Inserted ${mediaRowsToInsert.length} media records`);

  // 4. Verification & Parity Test against Live Supabase Cloud
  console.log("\n► [4/4] Live Query & Semantic Parity Verification");
  const liveProject = await fetchSupabaseProjectBySlug(supabase, "janus-bifrous");

  if (!liveProject) {
    throw new Error("Live verification failed: fetchSupabaseProjectBySlug returned null!");
  }

  let passed = 0;
  function verify(cond: boolean, name: string) {
    if (cond) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name}`);
    }
  }

  verify(liveProject.id === canonicalJanus.id, "Canonical ID matches");
  verify(liveProject.slug === canonicalJanus.slug, "Canonical slug matches");
  verify(liveProject.title === canonicalJanus.title, "Title matches ('JANUS BIFROUS')");
  verify(liveProject.subtitle === canonicalJanus.subtitle, "Subtitle matches ('Artisan Beer')");
  verify(liveProject.category === canonicalJanus.category, "Category matches ('product-design')");
  verify(liveProject.presentationType === canonicalJanus.presentationType, "Presentation type matches ('standalone')");
  verify(liveProject.client === "Locale Brewery", "Client attribution resolved ('Locale Brewery')");
  verify(liveProject.year === "2024", "Year matches ('2024')");
  verify(liveProject.featured === true, "Featured matches (true)");
  verify(liveProject.published === true, "Published matches (true)");
  verify(liveProject.media.length === 3, "Media count matches (3 assets)");
  verify(liveProject.media[0].role === "primary", "Media [0] primary role matches");
  verify(liveProject.media[0].width === 714, "Media [0] width matches (714)");
  verify(liveProject.media[0].height === 795, "Media [0] height matches (795)");
  verify(liveProject.media[0].orientation === "portrait", "Media [0] orientation matches ('portrait')");

  // Framing computation on live project
  const framing = computeFramingRows(liveProject.media, liveProject.framingConfig);
  verify(framing.length > 0, "Framing rows computed successfully from live Supabase data");

  console.log("\n========================================================");
  console.log(` PILOT SEED COMPLETE: ${passed} live assertions verified`);
  console.log("========================================================\n");
}

seedJanusPilot().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
