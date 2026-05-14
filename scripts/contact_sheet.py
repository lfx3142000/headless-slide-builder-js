#!/usr/bin/env python3
"""
contact_sheet.py  --  Build a contact-sheet PNG from a folder of slide images.

Usage:
    python3 scripts/contact_sheet.py <preview_dir> <output_path>

Arguments:
    preview_dir   Directory containing slide PNG images (slide-1.png, slide-2.png, ...)
    output_path   Path for the output contact sheet PNG
"""

import sys
import os
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Layout settings
COLS = 4
THUMB_W = 320
THUMB_H = 180
PADDING = 12
BG_COLOR = (30, 30, 30)
LABEL_HEIGHT = 22
LABEL_COLOR = (200, 200, 200)
LABEL_BG = (50, 50, 50)


def natural_sort_key(p):
    """Sort filenames with embedded numbers naturally (slide-1 before slide-10)."""
    return [int(c) if c.isdigit() else c.lower() for c in re.split(r'(\d+)', p.name)]


def build_contact_sheet(preview_dir: str, output_path: str):
    src = Path(preview_dir)
    out = Path(output_path)

    # Collect slide PNGs
    images = sorted(
        [f for f in src.iterdir() if f.suffix.lower() == '.png' and re.search(r'slide', f.name, re.I)],
        key=natural_sort_key
    )

    if not images:
        print(f'No slide PNG files found in {preview_dir}', file=sys.stderr)
        sys.exit(1)

    n = len(images)
    rows = (n + COLS - 1) // COLS

    cell_w = THUMB_W + PADDING * 2
    cell_h = THUMB_H + LABEL_HEIGHT + PADDING * 2
    sheet_w = cell_w * COLS + PADDING
    sheet_h = cell_h * rows + PADDING

    sheet = Image.new('RGB', (sheet_w, sheet_h), BG_COLOR)
    draw = ImageDraw.Draw(sheet)

    # Try to load a small font; fall back to default if unavailable
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    except Exception:
        font = ImageFont.load_default()

    for idx, img_path in enumerate(images):
        col = idx % COLS
        row = idx // COLS

        x = PADDING + col * cell_w
        y = PADDING + row * cell_h

        # Load and resize slide image
        try:
            slide_img = Image.open(img_path).convert('RGB')
            slide_img.thumbnail((THUMB_W, THUMB_H), Image.LANCZOS)
            # Centre thumbnail in cell
            tx = x + (THUMB_W - slide_img.width) // 2
            ty = y + (THUMB_H - slide_img.height) // 2
            sheet.paste(slide_img, (tx, ty))
        except Exception as e:
            print(f'Warning: could not load {img_path}: {e}', file=sys.stderr)

        # Label bar
        label_y = y + THUMB_H + PADDING // 2
        draw.rectangle([x, label_y, x + THUMB_W, label_y + LABEL_HEIGHT], fill=LABEL_BG)
        label = f'Slide {idx + 1}'
        draw.text((x + 6, label_y + 4), label, fill=LABEL_COLOR, font=font)

    # Save output
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(str(out), 'PNG', optimize=True)
    print(f'Contact sheet saved to {out}  ({n} slides, {COLS} columns)')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: python3 contact_sheet.py <preview_dir> <output_path>', file=sys.stderr)
        sys.exit(1)
    build_contact_sheet(sys.argv[1], sys.argv[2])
