"""
Marginalia colour token generator.

Builds tonal ramps for the four brand colours by working in OKLCH, so every
step on a ramp is a perceptually even move in lightness rather than a naive
RGB lerp. Hue is held constant down each ramp; chroma follows an envelope that
peaks in the mid-tones and is clamped back into the sRGB gamut where needed.

Emits:
  tokens/color.css   CSS custom properties (primitives + semantic aliases)
  tokens/color.json  W3C DTCG design tokens
  docs/color-ramps.md  generated reference tables (folded into the design doc)

Run:  python3 scripts/generate_color_tokens.py
"""

from __future__ import annotations

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# --------------------------------------------------------------------------
# sRGB <-> OKLab/OKLCH
# --------------------------------------------------------------------------


def srgb_to_linear(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def linear_to_srgb(c: float) -> float:
    return c * 12.92 if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055


def hex_to_rgb(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))  # type: ignore[return-value]


def rgb_to_hex(rgb: tuple[float, float, float]) -> str:
    return "#" + "".join(f"{round(max(0.0, min(1.0, c)) * 255):02X}" for c in rgb)


def linear_srgb_to_oklab(r: float, g: float, b: float) -> tuple[float, float, float]:
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_, m_, s_ = (math.copysign(abs(v) ** (1 / 3), v) for v in (l, m, s))
    return (
        0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
    )


def oklab_to_linear_srgb(L: float, a: float, b: float) -> tuple[float, float, float]:
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = (v**3 for v in (l_, m_, s_))
    return (
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    )


def hex_to_oklch(h: str) -> tuple[float, float, float]:
    r, g, b = (srgb_to_linear(c) for c in hex_to_rgb(h))
    L, a, bb = linear_srgb_to_oklab(r, g, b)
    return L, math.hypot(a, bb), math.degrees(math.atan2(bb, a)) % 360


def oklch_in_gamut(L: float, C: float, H: float, eps: float = 1e-4) -> bool:
    a = C * math.cos(math.radians(H))
    b = C * math.sin(math.radians(H))
    return all(-eps <= v <= 1 + eps for v in oklab_to_linear_srgb(L, a, b))


def oklch_to_hex(L: float, C: float, H: float) -> str:
    """Convert, reducing chroma by bisection until the colour fits in sRGB."""
    if not oklch_in_gamut(L, C, H):
        lo, hi = 0.0, C
        for _ in range(40):
            mid = (lo + hi) / 2
            if oklch_in_gamut(L, mid, H):
                lo = mid
            else:
                hi = mid
        C = lo
    a = C * math.cos(math.radians(H))
    b = C * math.sin(math.radians(H))
    return rgb_to_hex(tuple(linear_to_srgb(v) for v in oklab_to_linear_srgb(L, a, b)))


# --------------------------------------------------------------------------
# WCAG contrast
# --------------------------------------------------------------------------


def relative_luminance(h: str) -> float:
    r, g, b = (srgb_to_linear(c) for c in hex_to_rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: str, b: str) -> float:
    la, lb = relative_luminance(a), relative_luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


# --------------------------------------------------------------------------
# Ramp construction
# --------------------------------------------------------------------------

STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

# Perceptual lightness target per step. Shared by every ramp so that any
# `-600` sits at the same visual weight as any other `-600`.
LIGHTNESS = {
    50: 0.9750,
    100: 0.9450,
    200: 0.8950,
    300: 0.8300,
    400: 0.7450,
    500: 0.6650,
    600: 0.5850,
    700: 0.5050,
    800: 0.4250,
    900: 0.3350,
    950: 0.2550,
}

# Chroma falls away from the base swatch in both directions: toward white it
# drops hard (pale tints go muddy fast if you keep the saturation), toward
# black it drops gently (dark shades need to stay recognisably the brand).
CHROMA_TOWARD_LIGHT = 0.08  # residual chroma at the lightest step
CHROMA_TOWARD_DARK = 0.62  # residual chroma at the darkest step
LIGHT_FALLOFF_EXP = 1.6  # >1 keeps saturation up through the mid-tints

LIGHT = "#FEFDF9"
DARK = "#181818"

L_MAX = LIGHTNESS[50]
L_MIN = LIGHTNESS[950]

# Where each brand colour sits on the scale. Chosen rather than derived: both
# are within a hair of two steps, and these placements leave a usable number
# of shades on each side for hover/pressed and for dark-theme depth.
ANCHORS = {"ultramarine": 700, "orange": 500}


def chroma_factor(L: float, L0: float) -> float:
    """Chroma multiplier for a step at lightness `L` on a ramp based at `L0`."""
    if L >= L0:
        span = max(L_MAX - L0, 1e-6)
        t = min((L - L0) / span, 1.0)
        return 1 - (t**LIGHT_FALLOFF_EXP) * (1 - CHROMA_TOWARD_LIGHT)
    span = max(L0 - L_MIN, 1e-6)
    t = min((L0 - L) / span, 1.0)
    return 1 - t * (1 - CHROMA_TOWARD_DARK)


def chromatic_ramp(base_hex: str, anchor: int) -> dict[int, str]:
    """Ramp for a saturated brand colour, pinned to the exact base swatch."""
    L0, C0, H0 = hex_to_oklch(base_hex)
    ramp = {}
    for step in STEPS:
        if step == anchor:
            ramp[step] = base_hex.upper()
            continue
        L = LIGHTNESS[step]
        ramp[step] = oklch_to_hex(L, C0 * chroma_factor(L, L0), H0)
    return ramp


def neutral_ramp() -> dict[int, str]:
    """
    One warm-grey axis spanning the two brand neutrals: #FEFDF9 is its lightest
    step and #181818 its darkest. Carrying the cream's hue the whole way down
    keeps the greys from reading cold against the paper. The mid greys get a
    small lift in chroma so the warmth survives 8-bit quantisation instead of
    dissolving into hue noise.
    """
    _, C_light, H_light = hex_to_oklch(LIGHT)
    ramp: dict[int, str] = {}
    for step in STEPS:
        if step == 50:
            ramp[step] = LIGHT
            continue
        if step == 950:
            ramp[step] = DARK
            continue
        L = LIGHTNESS[step]
        # Bell over the mid-tones, peaking at ~1.7x the cream's own chroma.
        t = (L_MAX - L) / (L_MAX - L_MIN)
        lift = 1 + 0.7 * math.sin(math.pi * min(max(t, 0.0), 1.0))
        ramp[step] = oklch_to_hex(L, C_light * lift, H_light)
    return ramp


BRANDS = {
    "ultramarine": "#3046C5",
    "orange": "#FF5A1F",
}


def build() -> dict[str, dict[int, str]]:
    ramps: dict[str, dict[int, str]] = {"neutral": neutral_ramp()}
    for name, base in BRANDS.items():
        ramps[name] = chromatic_ramp(base, ANCHORS[name])
    return ramps


# --------------------------------------------------------------------------
# Semantic layer
# --------------------------------------------------------------------------

# Transparent shades, for shading effects that must sit over an unknown
# background: shadows, scrims, hover washes, focus rings. A flat ramp step
# cannot do this job — it would hide whatever is beneath it.
ALPHAS = {
    "shadow": ("neutral", 950, [4, 6, 8, 12, 16, 24]),
    "scrim": ("neutral", 950, [40, 60, 80]),
    "highlight": ("neutral", 50, [8, 16, 24]),
    "ultramarine": ("ultramarine", 700, [8, 12, 24]),
    "orange": ("orange", 500, [8, 12, 24]),
}

# (token name, light-mode primitive, dark-mode primitive, description)
SEMANTIC = [
    ("Backgrounds", [
        ("bg-canvas", "neutral.50", "neutral.950", "Page background"),
        ("bg-subtle", "neutral.100", "neutral.900", "Recessed areas, table stripes, code blocks"),
        ("bg-muted", "neutral.200", "neutral.800", "Disabled fills, inactive tabs"),
        ("bg-inverse", "neutral.950", "neutral.50", "Tooltips and other deliberately inverted surfaces"),
    ]),
    ("Surfaces", [
        ("surface-default", "neutral.50", "neutral.900", "Cards, panels, sheets"),
        ("surface-raised", "neutral.50", "neutral.800", "Menus, popovers, anything above a card"),
        ("surface-sunken", "neutral.100", "neutral.950", "Wells and inset areas"),
        ("surface-overlay", "neutral.50", "neutral.800", "Modals and dialogs"),
    ]),
    ("Text", [
        ("text-primary", "neutral.950", "neutral.50", "Body copy and headings"),
        ("text-secondary", "neutral.800", "neutral.300", "Supporting copy, labels"),
        ("text-tertiary", "neutral.700", "neutral.400", "Captions, metadata, placeholders"),
        ("text-disabled", "neutral.500", "neutral.600", "Non-interactive text; deliberately below AA"),
        ("text-inverse", "neutral.50", "neutral.950", "Text on bg-inverse"),
        ("text-on-brand", "neutral.50", "neutral.950", "Text on a filled brand surface"),
        ("text-on-accent", "neutral.950", "neutral.950", "Text on a filled accent surface"),
        ("text-brand", "ultramarine.700", "ultramarine.400", "Links and brand-coloured text"),
        ("text-accent", "orange.700", "orange.400", "Accent-coloured text"),
    ]),
    ("Borders", [
        ("border-subtle", "neutral.200", "neutral.800", "Dividers and hairlines; decorative only"),
        ("border-default", "neutral.300", "neutral.700", "Card and panel edges; decorative only"),
        ("border-strong", "neutral.600", "neutral.400",
         "Outlines an interactive control; the only border token that clears 3:1"),
        ("border-brand", "ultramarine.700", "ultramarine.500", "Selected and active edges"),
    ]),
    ("Brand - ultramarine", [
        ("brand-default", "ultramarine.700", "ultramarine.500", "Primary buttons, active nav"),
        ("brand-hover", "ultramarine.800", "ultramarine.400", "Primary hover"),
        ("brand-active", "ultramarine.900", "ultramarine.300", "Primary pressed"),
        ("brand-subtle", "ultramarine.50", "ultramarine.950", "Tinted brand background"),
        ("brand-subtle-hover", "ultramarine.100", "ultramarine.900", "Tinted brand background, hovered"),
        ("brand-muted", "ultramarine.200", "ultramarine.800", "Brand background sitting behind text"),
        ("brand-disabled", "ultramarine.200", "ultramarine.900", "Disabled primary fill"),
    ]),
    ("Accent - orange", [
        ("accent-default", "orange.500", "orange.400", "Highlights, badges, emphasis"),
        ("accent-hover", "orange.400", "orange.300", "Accent hover; brightens rather than darkens"),
        ("accent-active", "orange.300", "orange.200", "Accent pressed; brightens rather than darkens"),
        ("accent-subtle", "orange.50", "orange.950", "Tinted accent background"),
        ("accent-subtle-hover", "orange.100", "orange.900", "Tinted accent background, hovered"),
        ("accent-muted", "orange.200", "orange.800", "Accent background sitting behind text"),
    ]),
]

# Semantic tokens that resolve to a transparent shade rather than a ramp step.
SEMANTIC_ALPHA = [
    ("Shading", [
        ("shadow-ambient", "shadow.6", "shadow.16", "Wide, soft shadow layer"),
        ("shadow-key", "shadow.12", "shadow.24", "Tight, directional shadow layer"),
        ("scrim", "scrim.60", "scrim.80", "Backdrop behind modals"),
        ("overlay-hover", "shadow.4", "highlight.8", "Wash laid over any surface on hover"),
        ("overlay-active", "shadow.8", "highlight.16", "Wash laid over any surface on press"),
        ("bevel-highlight", "highlight.16", "highlight.8", "Top-edge highlight on raised elements"),
        ("focus-ring", "ultramarine.24", "ultramarine.24", "Focus halo"),
        ("selection", "ultramarine.12", "ultramarine.24", "Selected text and rows"),
    ]),
]

SHADOWS = [
    ("xs", "0 1px 2px 0 var(--color-shadow-ambient)"),
    ("sm", "0 1px 2px 0 var(--color-shadow-key), 0 2px 4px -1px var(--color-shadow-ambient)"),
    ("md", "0 2px 4px -1px var(--color-shadow-key), 0 6px 12px -2px var(--color-shadow-ambient)"),
    ("lg", "0 4px 8px -2px var(--color-shadow-key), 0 12px 24px -4px var(--color-shadow-ambient)"),
    ("xl", "0 8px 16px -4px var(--color-shadow-key), 0 24px 48px -8px var(--color-shadow-ambient)"),
]


def alpha_value(ramps, ramp_name: str, step: int, pct: int) -> str:
    triplet = ", ".join(str(round(c * 255)) for c in hex_to_rgb(ramps[ramp_name][step]))
    return f"rgba({triplet}, {pct / 100:g})"


HEADER = """/*
 * Marginalia - colour tokens
 *
 * GENERATED FILE. Edit scripts/generate_color_tokens.py and re-run
 * `python3 scripts/generate_color_tokens.py`; do not edit this by hand.
 *
 * Layer 1 (primitives) is the palette: every ramp step, named by hue and
 * weight. Components must never reference these directly.
 * Layer 2 (semantic) is the vocabulary: what a colour is *for*. Components
 * reference only these, which is what lets the theme swap underneath without
 * a single component changing.
 */"""


def emit_css(ramps) -> str:
    out = [HEADER, "", ":root {", "  /* ---- Primitives: ramps ---- */"]
    for name, ramp in ramps.items():
        out.append("")
        out.append(f"  /* {name} */")
        for step, hexv in ramp.items():
            out.append(f"  --color-{name}-{step}: {hexv};")

    out.append("")
    out.append("  /* ---- Primitives: transparent shades ---- */")
    for group, (ramp_name, step, pcts) in ALPHAS.items():
        for pct in pcts:
            out.append(f"  --color-{group}-{pct}: {alpha_value(ramps, ramp_name, step, pct)};")

    out.append("")
    out.append("  /* ---- Source-colour aliases ---- */")
    out.append("  --color-light: var(--color-neutral-50);")
    out.append("  --color-dark: var(--color-neutral-950);")
    out.append("  --color-ultramarine: var(--color-ultramarine-700);")
    out.append("  --color-orange: var(--color-orange-500);")
    out.append("}")

    def semantic_block(mode: int, indent: str) -> list[str]:
        lines = []
        for section, rows in SEMANTIC:
            lines.append("")
            lines.append(f"{indent}/* {section} */")
            for token, light_ref, dark_ref, _ in rows:
                ramp, step = (light_ref, dark_ref)[mode].split(".")
                lines.append(f"{indent}--color-{token}: var(--color-{ramp}-{step});")
        for section, rows in SEMANTIC_ALPHA:
            lines.append("")
            lines.append(f"{indent}/* {section} */")
            for token, light_ref, dark_ref, _ in rows:
                group, pct = (light_ref, dark_ref)[mode].split(".")
                lines.append(f"{indent}--color-{token}: var(--color-{group}-{pct});")
        return lines

    out.append("")
    out.append("/* ==== Semantic tokens - light theme (default) ==== */")
    out.append(':root,\n[data-theme="light"] {')
    out.extend(semantic_block(0, "  "))
    out.append("}")

    out.append("")
    out.append("/* ==== Semantic tokens - dark theme ==== */")
    out.append('[data-theme="dark"] {')
    out.extend(semantic_block(1, "  "))
    out.append("}")

    out.append("")
    out.append("/* Follow the OS when the page has made no explicit choice. */")
    out.append("@media (prefers-color-scheme: dark) {")
    out.append('  :root:not([data-theme="light"]) {')
    out.extend(semantic_block(1, "    "))
    out.append("  }")
    out.append("}")

    out.append("")
    out.append("/* ==== Elevation, composed from the shading tokens ==== */")
    out.append(":root {")
    for name, value in SHADOWS:
        out.append(f"  --shadow-{name}: {value};")
    out.append("}")
    return "\n".join(out) + "\n"


def emit_json(ramps) -> str:
    doc = {
        "$description": (
            "Marginalia colour tokens. Generated by scripts/generate_color_tokens.py; "
            "do not edit by hand."
        ),
        "color": {"$type": "color", "primitive": {}, "semantic": {}},
    }
    prim = doc["color"]["primitive"]
    for name, ramp in ramps.items():
        prim[name] = {
            str(step): {
                "$value": hexv,
                "$description": f"{name} {step}"
                + (" - brand source colour" if step == ANCHORS.get(name) else ""),
            }
            for step, hexv in ramp.items()
        }
    prim["neutral"]["50"]["$description"] += " - source colour `light`"
    prim["neutral"]["950"]["$description"] += " - source colour `dark`"

    prim["alpha"] = {}
    for group, (ramp_name, step, pcts) in ALPHAS.items():
        prim["alpha"][group] = {
            str(pct): {
                "$value": alpha_value(ramps, ramp_name, step, pct),
                "$description": f"{ramp_name} {step} at {pct}% opacity",
            }
            for pct in pcts
        }

    sem = doc["color"]["semantic"]

    def add(rows, prefix):
        for token, light_ref, dark_ref, desc in rows:
            lref = prefix + ".".join(light_ref.split("."))
            dref = prefix + ".".join(dark_ref.split("."))
            sem[token] = {
                "$value": "{" + lref + "}",
                "$description": desc,
                "$extensions": {
                    "com.marginalia.mode": {
                        "light": "{" + lref + "}",
                        "dark": "{" + dref + "}",
                    }
                },
            }

    for _, rows in SEMANTIC:
        add(rows, "color.primitive.")
    for _, rows in SEMANTIC_ALPHA:
        add(rows, "color.primitive.alpha.")

    return json.dumps(doc, indent=2) + "\n"


def emit_tables(ramps) -> str:
    """The generated section of docs/design-system.md."""
    out = ["### Ramps", ""]
    for name, ramp in ramps.items():
        out.append(f"#### `{name}`")
        out.append("")
        out.append("| Step | Hex | OKLCH (L C H) | On `light` | On `dark` | |")
        out.append("| --- | --- | --- | --- | --- | --- |")
        for step, hexv in ramp.items():
            L, C, H = hex_to_oklch(hexv)
            note = ""
            if step == ANCHORS.get(name):
                note = "**source colour**"
            elif name == "neutral" and step == 50:
                note = "**source colour** — `light`"
            elif name == "neutral" and step == 950:
                note = "**source colour** — `dark`"
            out.append(
                f"| `{step}` | `{hexv}` | `{L:.3f} {C:.3f} {H:.1f}` | "
                f"{contrast(hexv, LIGHT):.2f}:1 | {contrast(hexv, DARK):.2f}:1 | {note} |"
            )
        out.append("")

    out.append("### Transparent shades")
    out.append("")
    out.append("| Token | Built from | Value |")
    out.append("| --- | --- | --- |")
    for group, (ramp_name, step, pcts) in ALPHAS.items():
        for pct in pcts:
            out.append(
                f"| `--color-{group}-{pct}` | `{ramp_name}-{step}` @ {pct}% | "
                f"`{alpha_value(ramps, ramp_name, step, pct)}` |"
            )
    out.append("")

    out.append("### Semantic tokens")
    out.append("")
    for section, rows in SEMANTIC:
        out.append(f"#### {section}")
        out.append("")
        out.append("| Token | Light | Dark | Use |")
        out.append("| --- | --- | --- | --- |")
        for token, light_ref, dark_ref, desc in rows:
            lr, ls = light_ref.split(".")
            dr, ds = dark_ref.split(".")
            out.append(
                f"| `--color-{token}` | `{lr}-{ls}` `{ramps[lr][int(ls)]}` | "
                f"`{dr}-{ds}` `{ramps[dr][int(ds)]}` | {desc} |"
            )
        out.append("")
    for section, rows in SEMANTIC_ALPHA:
        out.append(f"#### {section}")
        out.append("")
        out.append("| Token | Light | Dark | Use |")
        out.append("| --- | --- | --- | --- |")
        for token, light_ref, dark_ref, desc in rows:
            out.append(
                f"| `--color-{token}` | `--color-{light_ref.replace('.', '-')}` | "
                f"`--color-{dark_ref.replace('.', '-')}` | {desc} |"
            )
        out.append("")

    out.append("### Elevation")
    out.append("")
    out.append("| Token | Value |")
    out.append("| --- | --- |")
    for name, value in SHADOWS:
        out.append(f"| `--shadow-{name}` | `{value}` |")
    out.append("")
    return "\n".join(out)


START = "<!-- generated:start -->"
END = "<!-- generated:end -->"


def splice_doc(ramps) -> None:
    """Rewrite the generated region of the design system doc in place."""
    doc = ROOT / "docs" / "design-system.md"
    text = doc.read_text()
    if START not in text or END not in text:
        raise SystemExit(f"{doc} is missing the {START} / {END} markers")
    head, rest = text.split(START, 1)
    _, tail = rest.split(END, 1)
    body = emit_tables(ramps)
    doc.write_text(f"{head}{START}\n<!-- Regenerate with: python3 scripts/generate_color_tokens.py -->\n\n{body}\n{END}{tail}")


if __name__ == "__main__":
    ramps = build()
    (ROOT / "tokens" / "color.css").write_text(emit_css(ramps))
    (ROOT / "tokens" / "color.json").write_text(emit_json(ramps))
    splice_doc(ramps)
    print("wrote tokens/color.css, tokens/color.json, docs/design-system.md")
    for name, ramp in ramps.items():
        anchor = ANCHORS.get(name)
        for step, hexv in ramp.items():
            if step == anchor:
                print(f"  {name}-{step} pinned to source {hexv}")
