import pymupdf
import os

output_dir = "public/images/projects"
os.makedirs(output_dir, exist_ok=True)

pdf_path = "PF DEPROS 2026_B.pdf"
doc = pymupdf.open(pdf_path)

# (page_1_indexed, output_filename, (left_ratio, top_ratio, right_ratio, bottom_ratio))
crops = [
    (5, "janus-bifrous-hero.png", (0.0, 0.17, 1.0, 1.0)),
    (6, "coco-flamingo-hero.png", (0.0, 0.17, 1.0, 1.0)),
    (7, "kraken-rum-hero.png", (0.0, 0.17, 1.0, 1.0)),
    (8, "blonde-ale-hero.png", (0.0, 0.17, 1.0, 1.0)),
    (9, "locale-fruit-wine-hero.png", (0.0, 0.17, 1.0, 1.0)),
    (10, "mini-liqueur-party-hero.png", (0.0, 0.17, 1.0, 1.0)),
    (11, "berassa-snack-hero.png", (0.0, 0.17, 1.0, 1.0)),
    (12, "arin-arak-hero.png", (0.0, 0.17, 1.0, 1.0)),
    (13, "mitra-kopling-hero.png", (0.0, 0.16, 1.0, 1.0)),
    (14, "logos-collection-hero.png", (0.0, 0.12, 1.0, 1.0)),
    (15, "whysuper-corporate-hero.png", (0.0, 0.16, 1.0, 1.0)),
    (16, "e-book-marketing-hero.png", (0.0, 0.16, 1.0, 1.0)),
    (17, "sales-tools-hero.png", (0.0, 0.16, 1.0, 1.0)),
    (18, "bounce-bali-hero.png", (0.0, 0.14, 1.0, 1.0)),
    (19, "locale-social-hero.png", (0.0, 0.22, 1.0, 1.0)),
    (20, "kopi-tungku-hero.png", (0.0, 0.12, 1.0, 1.0)),
]

zoom = 2.0
mat = pymupdf.Matrix(zoom, zoom)

for page_idx, fname, (l, t, r, b) in crops:
    page = doc[page_idx - 1]
    rect = page.rect
    w, h = rect.width, rect.height
    clip_rect = pymupdf.Rect(l * w, t * h, r * w, b * h)
    pix = page.get_pixmap(matrix=mat, clip=clip_rect, alpha=False)
    out_path = os.path.join(output_dir, fname)
    pix.save(out_path)
    print(f"Saved {out_path} ({pix.width}x{pix.height})")

print("PyMuPDF Cropping complete!")
