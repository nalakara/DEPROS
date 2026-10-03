import { getSupabaseBrowserClient } from "./client";
import { MediaOrientation } from "@/lib/types";

export interface ImageMetadata {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: MediaOrientation;
}

/**
 * Extracts intrinsic image dimensions and computes orientation in the browser.
 * Guarantees zero Cumulative Layout Shift (CLS) on the frontend.
 */
export function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      URL.revokeObjectURL(objectUrl);

      if (!width || !height) {
        reject(new Error(`Could not determine dimensions for image file: ${file.name}`));
        return;
      }

      const aspectRatio = Number((width / height).toFixed(3));
      let orientation: MediaOrientation = "landscape";

      if (aspectRatio > 2.0) {
        orientation = "panoramic";
      } else if (aspectRatio >= 1.05) {
        orientation = "landscape";
      } else if (aspectRatio <= 0.95) {
        orientation = "portrait";
      } else {
        orientation = "square";
      }

      resolve({
        width,
        height,
        aspectRatio,
        orientation,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image file for dimension check: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

/**
 * Sanitizes file names for safe Supabase Storage URLs.
 */
function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "_")
    .replace(/_+/g, "_");
}

/**
 * Uploads a media asset directly to the 'portfolio-media' Supabase storage bucket.
 * Returns the public CDN URL.
 */
export async function uploadProjectMedia(
  file: File,
  projectSlug: string
): Promise<{ src: string; metadata: ImageMetadata }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase client is not available.");
  }

  const metadata = await extractImageMetadata(file);
  const cleanName = sanitizeFileName(file.name);
  const timestamp = Date.now();
  const filePath = `projects/${projectSlug || "general"}/${timestamp}_${cleanName}`;

  const { error } = await supabase.storage
    .from("portfolio-media")
    .upload(filePath, file, {
      contentType: file.type || "image/png",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload media to storage: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("portfolio-media")
    .getPublicUrl(filePath);

  return {
    src: publicUrlData.publicUrl,
    metadata,
  };
}
