import fitz  # PyMuPDF
import os

pdf_path = "PF DEPROS 2026_B.pdf"
output_dir = "public/images/extracted"
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages: {len(doc)}")

# Render each page as high-res PNG
for page_num in range(len(doc)):
    page = doc[page_num]
    zoom = 2.0  # High resolution (approx 2880px wide)
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    out_path = os.path.join(output_dir, f"page_{page_num + 1:02d}.png")
    pix.save(out_path)
    print(f"Saved {out_path}")

print("Extraction complete!")
