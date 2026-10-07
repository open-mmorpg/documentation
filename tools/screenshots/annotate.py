"""Crop a raw capture, draw highlight boxes on it, and save it into the docs.

    python annotate.py RAW.png guide/images/page/name.png --crop 0 0 840 1228 --box 16 93 826 122

Coordinates are in the raw image's pixels. Boxes are drawn after cropping, so give them in
the cropped image's coordinates. A destination ending in .jpg is saved as JPEG (use it for
gameplay screenshots); anything else is saved as PNG (use it for editor screenshots).
"""
import argparse
import os

from PIL import Image, ImageDraw

DOCS = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'content', 'docs')
HIGHLIGHT = (255, 77, 79)  # #ff4d4f


def annotate(src, dst, crop=None, boxes=(), width=None):
    im = Image.open(src).convert('RGB')
    if crop:
        im = im.crop(crop)
    draw = ImageDraw.Draw(im)
    for box in boxes:
        draw.rounded_rectangle(box, radius=6, outline=HIGHLIGHT, width=3)
    if width and im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    out = os.path.join(DOCS, dst)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    if out.endswith('.jpg'):
        im.save(out, quality=85, optimize=True, progressive=True)
    else:
        im.save(out, optimize=True)
    print(dst, im.size, os.path.getsize(out) // 1024, 'KB')


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('src')
    p.add_argument('dst', help='path under src/content/docs')
    p.add_argument('--crop', nargs=4, type=int, metavar=('LEFT', 'TOP', 'RIGHT', 'BOTTOM'))
    p.add_argument('--box', nargs=4, type=int, action='append', default=[], metavar=('X0', 'Y0', 'X1', 'Y1'))
    p.add_argument('--width', type=int, help='scale down to this width, keeping the aspect ratio')
    a = p.parse_args()
    annotate(a.src, a.dst, tuple(a.crop) if a.crop else None, [tuple(b) for b in a.box], a.width)
