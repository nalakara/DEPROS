import pymupdf
import os

pdf_path = "PF DEPROS 2026_B.pdf"
doc = pymupdf.open(pdf_path)

base_dir = "public/images/projects"

# Detailed project asset crops from each page
# Note: Page indexes are 0-based in pymupdf
project_assets = {
    "janus-bifrous": [
        # (page_idx, output_subpath, (l, t, r, b))
        (4, "hero.png", (0.02, 0.28, 0.98, 0.98)),
        (4, "bottle-left.png", (0.02, 0.28, 0.38, 0.98)),
        (4, "circle-detail.png", (0.38, 0.28, 0.68, 0.98)),
        (4, "bottle-right.png", (0.68, 0.28, 0.98, 0.98)),
    ],
    "coco-flamingo": [
        (5, "hero.png", (0.02, 0.20, 0.98, 0.98)),
        (5, "flamingo-art.png", (0.02, 0.20, 0.28, 0.98)),
        (5, "bottle-center.png", (0.28, 0.20, 0.65, 0.98)),
        (5, "beach-bottles.png", (0.65, 0.20, 0.98, 0.98)),
    ],
    "kraken-rum": [
        (6, "hero.png", (0.02, 0.20, 0.98, 0.98)),
        (6, "bottle-left.png", (0.02, 0.20, 0.33, 0.98)),
        (6, "bottle-center.png", (0.33, 0.20, 0.67, 0.98)),
        (6, "lifestyle-right.png", (0.67, 0.20, 0.98, 0.98)),
    ],
    "mitra-kopling": [
        (12, "hero.png", (0.02, 0.16, 0.98, 0.98)),
        (12, "brand-guide.png", (0.02, 0.16, 0.31, 0.98)),
        (12, "apparel.png", (0.31, 0.16, 0.56, 0.98)),
        (12, "merchandise.png", (0.56, 0.16, 0.98, 0.98)),
    ],
    "whysuper-millimeter": [
        (14, "hero.png", (0.02, 0.16, 0.98, 0.98)),
        (14, "stationery-left.png", (0.02, 0.16, 0.38, 0.98)),
        (14, "cards-center.png", (0.38, 0.16, 0.77, 0.98)),
        (14, "guidelines-right.png", (0.77, 0.16, 0.98, 0.98)),
    ],
    "blonde-ale": [
        (7, "hero.png", (0.02, 0.24, 0.98, 0.98)),
    ],
    "arin-arak": [
        (11, "hero.png", (0.02, 0.23, 0.98, 0.98)),
    ],
}

zoom = 2.5  # High-DPI sharpness
mat = pymupdf.Matrix(zoom, zoom)

for proj_slug, assets in project_assets.items():
    proj_dir = os.path.join(base_dir, proj_slug)
    os.makedirs(proj_dir, exist_ok=True)
    for page_idx, filename, (l, t, r, b) in assets:
        page = doc[page_idx]
        w, h = page.rect.width, page.rect.height
        clip_rect = pymupdf.Rect(l * w, t * h, r * w, b * h)
        pix = page.get_pixmap(matrix=mat, clip=clip_rect, alpha=False)
        out_path = os.path.join(proj_dir, filename)
        pix.save(out_path)
        print(f"Saved {out_path} ({pix.width}x{pix.height})")

print("Detailed project assets extracted successfully!")
