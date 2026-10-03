import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually
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

async function check() {
  console.log("Testing connection to Supabase project:", url);
  
  // Test clients table
  const { data: clients, error: clientsError } = await supabase.from("clients").select("id, name").limit(1);
  if (clientsError) {
    console.log("Clients table:", clientsError.message, `(code: ${clientsError.code})`);
  } else {
    console.log("✓ 'clients' table accessible. Count returned:", clients?.length ?? 0);
  }

  // Test projects table
  const { data: projects, error: projectsError } = await supabase.from("projects").select("id, slug").limit(1);
  if (projectsError) {
    console.log("Projects table:", projectsError.message, `(code: ${projectsError.code})`);
  } else {
    console.log("✓ 'projects' table accessible. Count returned:", projects?.length ?? 0);
  }

  // Test project_media table
  const { data: media, error: mediaError } = await supabase.from("project_media").select("id").limit(1);
  if (mediaError) {
    console.log("Project_media table:", mediaError.message, `(code: ${mediaError.code})`);
  } else {
    console.log("✓ 'project_media' table accessible. Count returned:", media?.length ?? 0);
  }

  // Test storage bucket
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.log("Storage buckets:", bucketsError.message);
  } else {
    const hasMediaBucket = buckets?.some((b) => b.id === "portfolio-media" || b.name === "portfolio-media");
    console.log("✓ Storage buckets accessible. 'portfolio-media' found:", hasMediaBucket);
  }
}

check().catch(console.error);
