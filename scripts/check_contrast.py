"""
Marginalia colour token audit.

Checks that the semantic pairings a component is actually going to use clear
WCAG 2.1 contrast in both themes, and that every semantic token resolves to a
primitive that exists. Exits non-zero if a required pairing fails, so this can
gate CI.

Run:  python3 scripts/check_contrast.py
"""

from __future__ import annotations

import sys

from generate_color_tokens import (
    ANCHORS,
    BRANDS,
    DARK,
    LIGHT,
    SEMANTIC,
    build,
    contrast,
)

# (foreground token, background token, minimum ratio, why)
# 4.5 = AA body text, 3.0 = AA large text and non-text UI (borders, icons).
PAIRINGS = [
    ("text-primary", "bg-canvas", 4.5, "body copy on the page"),
    ("text-primary", "bg-subtle", 4.5, "body copy in a recessed area"),
    ("text-primary", "surface-default", 4.5, "body copy on a card"),
    ("text-primary", "surface-raised", 4.5, "body copy in a menu"),
    ("text-primary", "surface-sunken", 4.5, "body copy in a well"),
    ("text-secondary", "bg-canvas", 4.5, "labels on the page"),
    ("text-secondary", "surface-default", 4.5, "labels on a card"),
    ("text-tertiary", "bg-canvas", 4.5, "captions on the page"),
    ("text-tertiary", "surface-default", 4.5, "captions on a card"),
    ("text-inverse", "bg-inverse", 4.5, "tooltip text"),
    ("text-brand", "bg-canvas", 4.5, "links on the page"),
    ("text-brand", "surface-default", 4.5, "links on a card"),
    ("text-brand", "brand-subtle", 4.5, "links inside a tinted brand panel"),
    ("text-accent", "bg-canvas", 4.5, "accent text on the page"),
    ("text-accent", "accent-subtle", 4.5, "accent text inside a tinted panel"),
    ("text-on-brand", "brand-default", 4.5, "primary button label"),
    ("text-on-brand", "brand-hover", 4.5, "primary button label, hovered"),
    ("text-on-brand", "brand-active", 4.5, "primary button label, pressed"),
    ("text-on-accent", "accent-default", 4.5, "accent button label"),
    ("text-on-accent", "accent-hover", 4.5, "accent button label, hovered"),
    ("text-on-accent", "accent-active", 4.5, "accent button label, pressed"),
    ("border-strong", "bg-canvas", 3.0, "control outline on the page"),
    ("border-strong", "surface-default", 3.0, "control outline on a card"),
    ("border-strong", "surface-raised", 3.0, "control outline in a menu"),
    ("text-primary", "brand-muted", 4.5, "text on a brand-tinted chip"),
    ("text-primary", "accent-muted", 4.5, "text on an accent-tinted chip"),
    ("border-brand", "bg-canvas", 3.0, "selected edge"),
    ("brand-default", "bg-canvas", 3.0, "filled button against the page"),
    ("accent-default", "bg-canvas", 3.0, "filled accent against the page"),
]

# Reported but not enforced. WCAG 1.4.11 governs boundaries that identify a
# control; dividers and card edges are decoration and carry no ratio. Anything
# outlining an actual control must use border-strong, which is enforced above.
INFORMATIONAL = [
    ("border-subtle", "bg-canvas", "divider on the page"),
    ("border-default", "bg-canvas", "card edge on the page"),
    ("border-default", "surface-default", "edge on a card"),
    ("text-disabled", "bg-canvas", "disabled text; below AA by design"),
]


def semantic_map(ramps, mode: int) -> dict[str, str]:
    """Resolve every ramp-backed semantic token to a concrete hex for one theme."""
    out = {}
    for _section, rows in SEMANTIC:
        for token, light_ref, dark_ref, _desc in rows:
            ramp, step = (light_ref, dark_ref)[mode].split(".")
            if ramp not in ramps or int(step) not in ramps[ramp]:
                raise SystemExit(f"token --color-{token} points at missing primitive {ramp}-{step}")
            out[token] = ramps[ramp][int(step)]
    return out


def main() -> int:
    ramps = build()

    # The source colours must survive the ramp maths untouched.
    for name, base in BRANDS.items():
        got = ramps[name][ANCHORS[name]]
        assert got.upper() == base.upper(), f"{name}-{ANCHORS[name]} drifted: {got} != {base}"
    assert ramps["neutral"][50] == LIGHT, "neutral-50 must be the light source colour"
    assert ramps["neutral"][950] == DARK, "neutral-950 must be the dark source colour"

    failures = []
    for mode, label in ((0, "light"), (1, "dark")):
        tokens = semantic_map(ramps, mode)
        print(f"\n=== {label} theme ===")
        for fg, bg, minimum, why in PAIRINGS:
            ratio = contrast(tokens[fg], tokens[bg])
            ok = ratio >= minimum
            flag = "PASS" if ok else "FAIL"
            if not ok:
                failures.append((label, fg, bg, ratio, minimum, why))
            print(f"  [{flag}] {ratio:5.2f}:1 (min {minimum})  {fg} on {bg} — {why}")
        for fg, bg, why in INFORMATIONAL:
            ratio = contrast(tokens[fg], tokens[bg])
            print(f"  [ -- ] {ratio:5.2f}:1 (n/a)        {fg} on {bg} — {why}")

    print()
    if failures:
        print(f"{len(failures)} pairing(s) below the required ratio:")
        for label, fg, bg, ratio, minimum, why in failures:
            print(f"  {label}: {fg} on {bg} = {ratio:.2f}:1, needs {minimum}:1 ({why})")
        return 1
    print(f"All {len(PAIRINGS) * 2} enforced pairings pass.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
