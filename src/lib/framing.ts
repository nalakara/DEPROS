import { ProjectImage, FramingConfig, ImageOrientation } from "./types";

export interface FramingRow {
  images: (ProjectImage & { index: number })[];
  columns: number;
}

/**
 * Detects image orientation from width/height dimensions or falls back to provided hint.
 */
export function detectOrientation(
  width?: number,
  height?: number,
  fallback?: ImageOrientation
): ImageOrientation {
  if (fallback) return fallback;
  if (!width || !height) return "landscape";
  const ratio = width / height;
  if (ratio > 2.0) return "panoramic";
  if (ratio >= 1.15) return "landscape";
  if (ratio <= 0.88) return "portrait";
  return "square";
}

/**
 * Computes deterministic framing rows for a given project image collection.
 * Respects AUTO (aspect ratio + count aware) and EDITORIAL (explicit designer override).
 */
export function computeFramingRows(
  images: ProjectImage[],
  config?: FramingConfig
): FramingRow[] {
  if (!images || images.length === 0) return [];

  const indexedImages = images.map((img, idx) => ({ ...img, index: idx }));
  const mode = config?.layoutMode || "auto";

  // 1. EDITORIAL MODE: Explicit designer configuration
  if (mode === "editorial" && config?.editorialRows && config.editorialRows.length > 0) {
    const rows: FramingRow[] = [];
    for (const group of config.editorialRows) {
      const rowImages = group
        .map((idx) => indexedImages[idx])
        .filter((img): img is typeof indexedImages[0] => Boolean(img));
      if (rowImages.length > 0) {
        rows.push({
          images: rowImages,
          columns: rowImages.length,
        });
      }
    }
    if (rows.length > 0) {
      return rows;
    }
  }

  // 2. AUTO MODE: Deterministic & Orientation-Aware Layout
  const count = indexedImages.length;

  // Single Image: Full width showcase
  if (count === 1) {
    return [{ images: [indexedImages[0]], columns: 1 }];
  }

  // 2 Images: 2-column diptych
  if (count === 2) {
    return [{ images: indexedImages, columns: 2 }];
  }

  // 3 Images: Triptych or Mixed Split
  if (count === 3) {
    const orientations = indexedImages.map((img) =>
      detectOrientation(img.width, img.height, img.orientation)
    );
    const firstIsLandscape = orientations[0] === "landscape" || orientations[0] === "panoramic";
    const othersPortrait = orientations[1] === "portrait" && orientations[2] === "portrait";

    if (firstIsLandscape && othersPortrait) {
      return [
        { images: [indexedImages[0]], columns: 1 },
        { images: [indexedImages[1], indexedImages[2]], columns: 2 },
      ];
    }

    return [{ images: indexedImages, columns: 3 }];
  }

  // 4 Images: 2x2 balanced grid
  if (count === 4) {
    return [
      { images: indexedImages.slice(0, 2), columns: 2 },
      { images: indexedImages.slice(2, 4), columns: 2 },
    ];
  }

  // 5 Images: 3-column + 2-column rhythm
  if (count === 5) {
    return [
      { images: indexedImages.slice(0, 3), columns: 3 },
      { images: indexedImages.slice(3, 5), columns: 2 },
    ];
  }

  // 6+ Images: Deterministic chunking (3s and 2s)
  const rows: FramingRow[] = [];
  let i = 0;
  while (i < count) {
    const remaining = count - i;
    if (remaining === 4) {
      rows.push({ images: indexedImages.slice(i, i + 2), columns: 2 });
      rows.push({ images: indexedImages.slice(i + 2, i + 4), columns: 2 });
      i += 4;
    } else if (remaining >= 3) {
      rows.push({ images: indexedImages.slice(i, i + 3), columns: 3 });
      i += 3;
    } else {
      rows.push({ images: indexedImages.slice(i, i + remaining), columns: remaining });
      i += remaining;
    }
  }

  return rows;
}
