"""Generate TunisieTV placeholder brand assets (original artwork).

Visual language follows docs/design-system.md: dark #131316 background,
brand red #E70013 rounded "TV" tile, Sora ExtraBold wordmark.

Usage:  python scripts/generate-brand-assets.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "brand"
FONT = ROOT / "node_modules/@expo-google-fonts/sora/800ExtraBold/Sora_800ExtraBold.ttf"

BG = (19, 19, 22, 255)  # #131316
RED = (231, 0, 19, 255)  # #E70013
WHITE = (255, 255, 255, 255)
TEXT = (229, 225, 230, 255)  # #E5E1E6


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT), size)


def tv_tile(size: int, glow: bool = False) -> Image.Image:
    """Red rounded square with a white 'TV' monogram."""
    pad = size // 6 if glow else 0
    img = Image.new("RGBA", (size + 2 * pad, size + 2 * pad), (0, 0, 0, 0))
    if glow:
        halo = Image.new("RGBA", img.size, (0, 0, 0, 0))
        ImageDraw.Draw(halo).rounded_rectangle(
            (pad, pad, pad + size, pad + size), radius=size // 5, fill=(231, 0, 19, 150)
        )
        img = Image.alpha_composite(img, halo.filter(ImageFilter.GaussianBlur(size // 10)))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((pad, pad, pad + size, pad + size), radius=size // 5, fill=RED)
    f = font(int(size * 0.46))
    d.text((pad + size / 2, pad + size / 2), "TV", font=f, fill=WHITE, anchor="mm")
    return img


def wordmark(height: int) -> Image.Image:
    """'Tunisie' in light text + 'TV' in red, like the Stitch header."""
    f = font(height)
    a, b = "Tunisie", "TV"
    wa = int(f.getlength(a))
    wb = int(f.getlength(b))
    img = Image.new("RGBA", (wa + wb + 4, int(height * 1.35)), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.text((0, img.height / 2), a, font=f, fill=TEXT, anchor="lm")
    d.text((wa + 4, img.height / 2), b, font=f, fill=RED, anchor="lm")
    return img


def paste_center(base: Image.Image, overlay: Image.Image, dy: int = 0) -> None:
    x = (base.width - overlay.width) // 2
    y = (base.height - overlay.height) // 2 + dy
    base.alpha_composite(overlay, (x, y))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    # App icon 1024 (full bleed dark, tile centered)
    icon = Image.new("RGBA", (1024, 1024), BG)
    paste_center(icon, tv_tile(620, glow=True))
    icon.save(OUT / "icon.png")

    # Adaptive icon foreground (transparent, tile inside the 66% safe zone)
    fg = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    paste_center(fg, tv_tile(480))
    fg.save(OUT / "adaptive-foreground.png")

    # Monochrome adaptive layer (white silhouette)
    mono = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    md = ImageDraw.Draw(mono)
    md.rounded_rectangle((272, 272, 752, 752), radius=96, fill=WHITE)
    md.text((512, 512), "TV", font=font(220), fill=(0, 0, 0, 0), anchor="mm")
    mono.save(OUT / "adaptive-monochrome.png")

    # Splash mark (tile only; background color set in app config)
    splash = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    paste_center(splash, tv_tile(300, glow=True))
    splash.save(OUT / "splash-icon.png")

    # Android TV launcher banner 320x180 @xhdpi = 640x360 px (16:9)
    banner = Image.new("RGBA", (640, 360), BG)
    tile = tv_tile(150)
    mark = wordmark(74)
    gap = 28
    total = tile.width + gap + mark.width
    x0 = (banner.width - total) // 2
    banner.alpha_composite(tile, (x0, (banner.height - tile.height) // 2))
    banner.alpha_composite(mark, (x0 + tile.width + gap, (banner.height - mark.height) // 2))
    ImageDraw.Draw(banner).rectangle((0, 352, 640, 360), fill=RED)
    banner.save(OUT / "tv-banner.png")

    # Android TV icon (square)
    tv_icon = Image.new("RGBA", (760, 760), BG)
    paste_center(tv_icon, tv_tile(460, glow=True))
    tv_icon.save(OUT / "tv-icon.png")

    print("wrote", sorted(p.name for p in OUT.iterdir()))


if __name__ == "__main__":
    main()
