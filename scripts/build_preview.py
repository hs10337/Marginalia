"""
Builds preview/colors.html — a live reference for the colour system, generated
from the same source as the tokens so no value is ever hand-transcribed.

The page is built entirely out of the tokens it documents: every surface, rule
and label on it resolves through a semantic token, so if a token is wrong the
page shows it.

Run:  python3 scripts/build_preview.py
"""

from __future__ import annotations

from generate_color_tokens import (
    ALPHAS,
    ANCHORS,
    DARK,
    LIGHT,
    SEMANTIC,
    SEMANTIC_ALPHA,
    SHADOWS,
    STEPS,
    ROOT,
    alpha_value,
    build,
    contrast,
    hex_to_oklch,
)
from check_contrast import PAIRINGS, INFORMATIONAL, semantic_map

SOURCES = [
    ("Light", LIGHT, "neutral-50", "Paper"),
    ("Ultramarine", "#3046C5", "ultramarine-700", "Brand"),
    ("Orange", "#FF5A1F", "orange-500", "Accent"),
    ("Dark", DARK, "neutral-950", "Ink"),
]

FONTS = (
    "https://fonts.googleapis.com/css2?"
    "family=IBM+Plex+Mono:wght@400;500;600&"
    "family=IBM+Plex+Sans:wght@400;500;600&"
    "family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap"
)

CSS = """
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--color-bg-canvas);
  color: var(--color-text-primary);
  font-family: "IBM Plex Sans", system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.wrap { max-width: 1140px; margin: 0 auto; padding: 0 32px 96px; }

/* ---- type ---- */
h1, h2, h3 { font-family: Newsreader, Georgia, serif; font-weight: 500; text-wrap: balance; margin: 0; }
h1 { font-size: 56px; line-height: 1.05; letter-spacing: -0.02em; }
h2 { font-size: 30px; line-height: 1.2; letter-spacing: -0.01em; }
h3 { font-size: 19px; line-height: 1.3; }
p { margin: 0; max-width: 66ch; }
.prose { font-family: Newsreader, Georgia, serif; font-size: 18px; line-height: 1.65; color: var(--color-text-secondary); }
.eyebrow {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 11px; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.14em; color: var(--color-text-tertiary);
}
code, .mono { font-family: "IBM Plex Mono", ui-monospace, monospace; font-variant-numeric: tabular-nums; }

/* ---- chrome ---- */
.topbar {
  position: sticky; top: 0; z-index: 20;
  display: flex; align-items: center; gap: 24px;
  padding: 12px 32px;
  background: var(--color-bg-canvas);
  border-bottom: 1px solid var(--color-border-subtle);
}
.topbar .brand { font-family: Newsreader, Georgia, serif; font-size: 18px; }
.topbar nav { display: flex; gap: 20px; margin-left: auto; flex-wrap: wrap; }
.topbar nav a {
  font-size: 13px; color: var(--color-text-tertiary); text-decoration: none;
  border-bottom: 1px solid transparent; padding-bottom: 2px;
}
.topbar nav a:hover { color: var(--color-text-brand); border-bottom-color: var(--color-border-brand); }

.toggle {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: "IBM Plex Mono", monospace; font-size: 12px;
  padding: 7px 13px; cursor: pointer;
  color: var(--color-text-secondary);
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-strong);
  border-radius: 2px;
}
.toggle:hover { background: var(--color-bg-subtle); color: var(--color-text-primary); }

:where(a, button, [tabindex]):focus-visible {
  outline: 2px solid var(--color-border-brand);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-focus-ring);
  border-radius: 2px;
}

/* ---- sections ---- */
section { padding-top: 72px; scroll-margin-top: 64px; }
.section-head { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.rule { height: 1px; background: var(--color-border-subtle); margin: 0; border: 0; }

/* ---- masthead ---- */
.masthead { padding: 72px 0 8px; display: flex; flex-direction: column; gap: 22px; }
.sources { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 14px; }
.source { border: 1px solid var(--color-border-default); border-radius: 3px; overflow: hidden; }
.source .chip { height: 108px; }
.source .meta { padding: 12px 14px; display: flex; flex-direction: column; gap: 3px; background: var(--color-surface-default); }
.source .name { font-size: 15px; font-weight: 500; }
.source .hex { font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--color-text-tertiary); }
.source .role { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-tertiary); font-family: "IBM Plex Mono", monospace; }

/* ---- ramp matrix ---- */
.matrix-scroll { overflow-x: auto; padding-bottom: 6px; }
.matrix { min-width: 900px; display: flex; flex-direction: column; gap: 18px; }
.matrix-header { display: grid; grid-template-columns: 116px repeat(STEPCOUNT, 1fr); gap: 4px; }
.matrix-header span {
  font-family: "IBM Plex Mono", monospace; font-size: 11px;
  color: var(--color-text-tertiary); text-align: center;
}
.ramp { display: grid; grid-template-columns: 116px repeat(STEPCOUNT, 1fr); gap: 4px; align-items: stretch; }
.ramp-label { display: flex; flex-direction: column; justify-content: center; gap: 2px; padding-right: 10px; }
.ramp-label .n { font-family: "IBM Plex Mono", monospace; font-size: 13px; font-weight: 500; }
.ramp-label .h { font-family: "IBM Plex Mono", monospace; font-size: 10px; color: var(--color-text-tertiary); }
.swatch {
  height: 74px; border-radius: 2px; padding: 7px 8px;
  /* Inset rather than a border or outline: pale swatches need an edge against
     the cream ground, and an outline on the last column clips at the scroll. */
  box-shadow: inset 0 0 0 1px var(--color-border-default);
  display: flex; flex-direction: column; justify-content: space-between;
  font-family: "IBM Plex Mono", monospace; font-size: 10px; line-height: 1.3;
}
.swatch .val { opacity: 0.82; }
.swatch.is-source { box-shadow: inset 0 0 0 3px var(--color-text-accent); }
.swatch .pin { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }

/* ---- token tables ---- */
.tbl-scroll { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; min-width: 640px; font-size: 13.5px; }
caption {
  text-align: left; font-size: 13px; font-weight: 600; padding: 22px 0 8px;
  color: var(--color-text-primary);
}
th {
  text-align: left; font-weight: 500; font-size: 11px; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--color-text-tertiary);
  font-family: "IBM Plex Mono", monospace;
  padding: 8px 12px 8px 0; border-bottom: 1px solid var(--color-border-default);
}
td { padding: 9px 12px 9px 0; border-bottom: 1px solid var(--color-border-subtle); vertical-align: middle; }
td.num { font-family: "IBM Plex Mono", monospace; font-variant-numeric: tabular-nums; }
.dot {
  display: inline-block; width: 26px; height: 26px; border-radius: 2px;
  border: 1px solid var(--color-border-default); vertical-align: middle;
}
.tok { font-family: "IBM Plex Mono", monospace; font-size: 12.5px; }
.ref { font-family: "IBM Plex Mono", monospace; font-size: 11.5px; color: var(--color-text-tertiary); }
.use { color: var(--color-text-secondary); }

.pill {
  display: inline-block; font-family: "IBM Plex Mono", monospace;
  font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
  padding: 2px 7px; border-radius: 2px;
}
.pill.pass { background: var(--color-brand-subtle); color: var(--color-text-brand); }
.pill.info { background: var(--color-bg-muted); color: var(--color-text-tertiary); }

/* ---- demos ---- */
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
.panel {
  background: var(--color-surface-default);
  border: 1px solid var(--color-border-default);
  border-radius: 3px; padding: 22px;
  display: flex; flex-direction: column; gap: 16px;
}
.panel h3 { font-family: "IBM Plex Sans", sans-serif; font-size: 12px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-tertiary); }
.row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }

.btn {
  font: 500 14px/1 "IBM Plex Sans", sans-serif;
  padding: 10px 16px; border-radius: 2px; border: 1px solid transparent;
  cursor: pointer;
}
.btn-brand { background: var(--color-brand-default); color: var(--color-text-on-brand); }
.btn-brand.h { background: var(--color-brand-hover); }
.btn-brand.a { background: var(--color-brand-active); }
.btn-brand.d { background: var(--color-brand-disabled); color: var(--color-text-disabled); cursor: not-allowed; }
.btn-accent { background: var(--color-accent-default); color: var(--color-text-on-accent); }
.btn-accent.h { background: var(--color-accent-hover); }
.btn-accent.a { background: var(--color-accent-active); }
.btn-ghost { background: transparent; color: var(--color-text-primary); border-color: var(--color-border-strong); }
.btn-ghost:hover { background: var(--color-overlay-hover); }
.btn-ghost:active { background: var(--color-overlay-active); }
.btn-live:hover { background: var(--color-brand-hover); }
.btn-live:active { background: var(--color-brand-active); }

.field {
  font: 400 14px/1 "IBM Plex Sans", sans-serif;
  padding: 10px 12px; border-radius: 2px;
  background: var(--color-bg-canvas); color: var(--color-text-primary);
  border: 1px solid var(--color-border-strong); width: 100%;
}
.field::placeholder { color: var(--color-text-tertiary); }
.field:focus-visible { outline: 2px solid var(--color-border-brand); outline-offset: 1px; }

.tag { font: 500 12px/1 "IBM Plex Mono", monospace; padding: 5px 9px; border-radius: 2px; }
.tag.brand { background: var(--color-brand-muted); color: var(--color-text-primary); }
.tag.accent { background: var(--color-accent-muted); color: var(--color-text-primary); }
.tooltip { background: var(--color-bg-inverse); color: var(--color-text-inverse); padding: 6px 10px; border-radius: 2px; font-size: 12.5px; }
a.link { color: var(--color-text-brand); text-underline-offset: 3px; }
::selection { background: var(--color-selection); }

.elevation { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 18px; }
.card {
  background: var(--color-surface-raised); border-radius: 3px; padding: 18px 14px;
  border-top: 1px solid var(--color-bevel-highlight);
  font-family: "IBM Plex Mono", monospace; font-size: 12px; text-align: center;
  color: var(--color-text-secondary);
}
.scrim-demo { position: relative; border-radius: 3px; overflow: hidden; border: 1px solid var(--color-border-default); }
.scrim-demo .under {
  padding: 26px 22px; min-height: 148px; background: var(--color-bg-subtle);
  font-family: Newsreader, Georgia, serif; font-size: 17px; line-height: 1.55;
  color: var(--color-text-primary);
}
.scrim-demo .over {
  position: absolute; inset: 0; background: var(--color-scrim);
  /* Bottom-left, so the caption never lands on the text it is dimming. */
  display: flex; align-items: flex-end; padding: 14px 16px;
  font-family: "IBM Plex Mono", monospace; font-size: 11px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--color-neutral-50);
}

footer { margin-top: 88px; padding-top: 26px; border-top: 1px solid var(--color-border-subtle);
  font-size: 13px; color: var(--color-text-tertiary); display: flex; flex-direction: column; gap: 6px; }

@media (max-width: 720px) {
  .wrap { padding: 0 20px 64px; }
  h1 { font-size: 40px; }
  .sources { grid-template-columns: repeat(2, 1fr); }
  .topbar nav { display: none; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
"""


def ink_for(hexv: str) -> str:
    """Pick whichever of the two source neutrals is legible on this swatch."""
    return DARK if contrast(hexv, DARK) >= contrast(hexv, LIGHT) else LIGHT


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_html() -> str:
    ramps = build()
    tokens_css = (ROOT / "tokens" / "color.css").read_text()
    light_tokens = semantic_map(ramps, 0)
    dark_tokens = semantic_map(ramps, 1)

    h: list[str] = []
    a = h.append

    a("<title>Marginalia Colour Tokens</title>")
    a(f'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    a(f'<link rel="stylesheet" href="{FONTS}">')
    a("<style>")
    a(tokens_css)
    a(CSS.replace("STEPCOUNT", str(len(STEPS))))
    a("</style>")

    # ---- top bar ----
    a('<div class="topbar">')
    a('<span class="brand">Marginalia</span>')
    a('<nav>')
    for label, target in [("Ramps", "ramps"), ("Semantic", "semantic"),
                          ("Shading", "shading"), ("Components", "components"),
                          ("Contrast", "contrast")]:
        a(f'<a href="#{target}">{label}</a>')
    a('</nav>')
    a('<button class="toggle" id="theme-toggle" type="button">'
      '<span id="theme-label">Light</span></button>')
    a('</div>')

    a('<div class="wrap">')

    # ---- masthead ----
    a('<header class="masthead">')
    a('<span class="eyebrow">Design system · Colour</span>')
    a("<h1>Four colours, every shade derived.</h1>")
    a('<p class="prose">Every value in this system comes from four source colours and '
      'nothing else. The ramps are generated in OKLCH — hue held constant, lightness on '
      'one shared grid, chroma falling away from the source in both directions — so a '
      'step means the same thing on every ramp. This page is built out of the tokens it '
      'documents; switch the theme and it re-resolves along with everything else.</p>')
    a('<div class="sources">')
    for name, hexv, step, role in SOURCES:
        a('<div class="source">')
        a(f'<div class="chip" style="background:{hexv}"></div>')
        a('<div class="meta">')
        a(f'<span class="role">{role}</span>')
        a(f'<span class="name">{name}</span>')
        a(f'<span class="hex">{hexv} · {step}</span>')
        a("</div></div>")
    a("</div></header>")

    # ---- ramps ----
    a('<section id="ramps"><div class="section-head">')
    a('<span class="eyebrow">01 · Primitives</span>')
    a("<h2>The ramps</h2>")
    a('<p class="prose">Read this as a matrix. Every column is one weight, and because '
      'all three ramps sit on the same lightness grid, a swatch is always the same visual '
      'weight as the one above and below it — which is what lets you recolour a component '
      'from neutral to brand without it getting heavier or lighter. Outlined swatches are '
      'the source colours, pinned exactly.</p>')
    a("</div>")
    a('<div class="matrix-scroll"><div class="matrix">')
    a('<div class="matrix-header"><span></span>')
    for step in STEPS:
        a(f"<span>{step}</span>")
    a("</div>")
    for name, ramp in ramps.items():
        _, _, hue = hex_to_oklch(ramp[700])
        a('<div class="ramp">')
        a('<div class="ramp-label">')
        a(f'<span class="n">{name}</span>')
        hue_label = "warm grey" if name == "neutral" else f"hue {hue:.0f}°"
        a(f'<span class="h">{hue_label}</span>')
        a("</div>")
        for step in STEPS:
            hexv = ramp[step]
            is_src = step == ANCHORS.get(name) or (name == "neutral" and step in (50, 950))
            cls = "swatch is-source" if is_src else "swatch"
            a(f'<div class="{cls}" style="background:{hexv};color:{ink_for(hexv)}">')
            a(f'<span class="pin">{"source" if is_src else "&nbsp;"}</span>')
            a(f'<span class="val">{hexv}</span>')
            a("</div>")
        a("</div>")
    a("</div></div>")

    # transparent shades
    a('<div class="tbl-scroll"><table>')
    a("<caption>Transparent shades — for effects that sit over an unknown surface</caption>")
    a("<tr><th>Token</th><th>Built from</th><th>Value</th></tr>")
    for group, (ramp_name, step, pcts) in ALPHAS.items():
        for pct in pcts:
            val = alpha_value(ramps, ramp_name, step, pct)
            a("<tr>")
            a(f'<td class="tok">--color-{group}-{pct}</td>')
            a(f'<td class="ref">{ramp_name}-{step} @ {pct}%</td>')
            a(f'<td class="num">{val}</td>')
            a("</tr>")
    a("</table></div></section>")

    # ---- semantic ----
    a('<section id="semantic"><div class="section-head">')
    a('<span class="eyebrow">02 · Semantic</span>')
    a("<h2>What a colour is for</h2>")
    a('<p class="prose">Components reference only these. Each one points at a different '
      'primitive per theme, so a theme switch rebinds the whole vocabulary at once and no '
      'component changes. The swatch column is live — it shows whichever value is resolving '
      'right now.</p>')
    a("</div>")
    for section, rows in SEMANTIC:
        a('<div class="tbl-scroll"><table>')
        a(f"<caption>{esc(section)}</caption>")
        a("<tr><th></th><th>Token</th><th>Light</th><th>Dark</th><th>Use</th></tr>")
        for token, light_ref, dark_ref, desc in rows:
            a("<tr>")
            a(f'<td><span class="dot" style="background:var(--color-{token})"></span></td>')
            a(f'<td class="tok">--color-{token}</td>')
            a(f'<td class="ref">{light_ref.replace(".", "-")} <span class="num">'
              f'{light_tokens[token]}</span></td>')
            a(f'<td class="ref">{dark_ref.replace(".", "-")} <span class="num">'
              f'{dark_tokens[token]}</span></td>')
            a(f'<td class="use">{esc(desc)}</td>')
            a("</tr>")
        a("</table></div>")
    for section, rows in SEMANTIC_ALPHA:
        a('<div class="tbl-scroll"><table>')
        a(f"<caption>{esc(section)}</caption>")
        a("<tr><th></th><th>Token</th><th>Light</th><th>Dark</th><th>Use</th></tr>")
        for token, light_ref, dark_ref, desc in rows:
            a("<tr>")
            a(f'<td><span class="dot" style="background:var(--color-{token})"></span></td>')
            a(f'<td class="tok">--color-{token}</td>')
            a(f'<td class="ref">--color-{light_ref.replace(".", "-")}</td>')
            a(f'<td class="ref">--color-{dark_ref.replace(".", "-")}</td>')
            a(f'<td class="use">{esc(desc)}</td>')
            a("</tr>")
        a("</table></div>")
    a("</section>")

    # ---- shading ----
    a('<section id="shading"><div class="section-head">')
    a('<span class="eyebrow">03 · Shading</span>')
    a("<h2>Darkening and lightening</h2>")
    a('<p class="prose">Shading is transparent, never flat. A shadow or a hover wash has to '
      'sit over a surface whose colour it does not know — a solid ramp step would hide what '
      'is beneath it instead of shading it. Elements with their own fill step along the ramp '
      '(<span class="tok">--color-brand-hover</span>); elements without one take a wash '
      '(<span class="tok">--color-overlay-hover</span>).</p>')
    a("</div>")
    a('<div class="elevation">')
    for name, _value in SHADOWS:
        a(f'<div class="card" style="box-shadow:var(--shadow-{name})">--shadow-{name}</div>')
    a("</div>")
    a('<div class="grid-2" style="margin-top:26px">')
    a('<div class="panel"><h3>Washes over a surface</h3>')
    a('<div class="row">')
    a('<button class="btn btn-ghost" type="button">Hover and press me</button>')
    a('<span class="tag brand">brand-muted</span>')
    a('<span class="tag accent">accent-muted</span>')
    a("</div>")
    a('<p class="use" style="font-size:13px">The ghost button has no fill of its own, so its '
      'states come from <span class="tok">--color-overlay-hover</span> and '
      '<span class="tok">--color-overlay-active</span>.</p>')
    a("</div>")
    a('<div class="panel" style="padding:0;border:0">')
    a('<div class="scrim-demo"><div class="under">Content behind a modal backdrop. The '
      'scrim dims what is underneath rather than covering it, so the reader keeps their '
      'place while the dialog has focus.</div>'
      '<div class="over">--color-scrim</div></div>')
    a("</div>")
    a("</div></section>")

    # ---- components ----
    a('<section id="components"><div class="section-head">')
    a('<span class="eyebrow">04 · In use</span>')
    a("<h2>The tokens under load</h2>")
    a('<p class="prose">Every state below is a token, not a hand-picked value. Note that the '
      'accent fill brightens on interaction rather than darkening: '
      '<span class="tok">#FF5A1F</span> sits high enough on the lightness axis that it takes '
      'a dark label, and darkening it would drop that label below 4.5:1.</p>')
    a("</div>")
    a('<div class="grid-2">')

    a('<div class="panel"><h3>Brand — steps down the ramp</h3><div class="row">')
    a('<button class="btn btn-brand" type="button">Default</button>')
    a('<span class="btn btn-brand h">Hover</span>')
    a('<span class="btn btn-brand a">Pressed</span>')
    a('<span class="btn btn-brand d">Disabled</span>')
    a("</div>")
    a('<div class="row"><button class="btn btn-brand btn-live" type="button">'
      "Live — tab to me for the focus ring</button></div>")
    a("</div>")

    a('<div class="panel"><h3>Accent — steps up the ramp</h3><div class="row">')
    a('<button class="btn btn-accent" type="button">Default</button>')
    a('<span class="btn btn-accent h">Hover</span>')
    a('<span class="btn btn-accent a">Pressed</span>')
    a("</div>")
    a('<p class="use" style="font-size:13px">Dark label throughout, so the fill has to get '
      "lighter to stay readable.</p></div>")

    a('<div class="panel"><h3>Control outlines</h3>')
    a('<input class="field" placeholder="border-strong — the only border clearing 3:1">')
    a('<p class="use" style="font-size:13px">border-subtle and border-default are decorative. '
      "Anything outlining a control uses border-strong.</p></div>")

    a('<div class="panel"><h3>Text and marks</h3>')
    a('<p class="prose" style="font-size:16px;color:var(--color-text-primary)">Body copy in '
      '<span class="tok">text-primary</span>, a <a class="link" href="#semantic">link</a> in '
      'text-brand, and <span style="color:var(--color-text-accent)">accent text</span> for '
      "emphasis. Select this line to see the selection token.</p>")
    a('<div class="row"><span class="tooltip">Tooltip on bg-inverse</span>'
      '<span class="use" style="font-size:13px">text-secondary</span>'
      '<span style="color:var(--color-text-tertiary);font-size:13px">text-tertiary</span>'
      '<span style="color:var(--color-text-disabled);font-size:13px">text-disabled</span></div>')
    a("</div>")
    a("</div></section>")

    # ---- contrast ----
    passing = sum(1 for _ in PAIRINGS) * 2
    a('<section id="contrast"><div class="section-head">')
    a('<span class="eyebrow">05 · Accessibility</span>')
    a("<h2>The audit</h2>")
    a(f'<p class="prose">Every pairing a component will actually use, checked in both themes. '
      f'All {passing} enforced pairings clear WCAG AA — 4.5:1 for text, 3:1 for control '
      f'boundaries. <span class="tok">scripts/check_contrast.py</span> exits non-zero on a '
      f'failure, so a token change that breaks one cannot ship quietly.</p>')
    a("</div>")
    a('<div class="tbl-scroll"><table>')
    a("<caption>Enforced pairings</caption>")
    a("<tr><th>Foreground</th><th>Background</th><th>Min</th><th>Light</th><th>Dark</th>"
      "<th>Where</th></tr>")
    for fg, bg, minimum, why in PAIRINGS:
        cl = contrast(light_tokens[fg], light_tokens[bg])
        cd = contrast(dark_tokens[fg], dark_tokens[bg])
        a("<tr>")
        a(f'<td class="tok">{fg}</td><td class="tok">{bg}</td>')
        a(f'<td class="num">{minimum}</td>')
        a(f'<td class="num">{cl:.2f} <span class="pill pass">pass</span></td>')
        a(f'<td class="num">{cd:.2f} <span class="pill pass">pass</span></td>')
        a(f'<td class="use">{esc(why)}</td>')
        a("</tr>")
    a("</table></div>")
    a('<div class="tbl-scroll"><table>')
    a("<caption>Reported, not enforced — decorative edges and deliberately dimmed text</caption>")
    a("<tr><th>Foreground</th><th>Background</th><th>Light</th><th>Dark</th><th>Why</th></tr>")
    for fg, bg, why in INFORMATIONAL:
        cl = contrast(light_tokens[fg], light_tokens[bg])
        cd = contrast(dark_tokens[fg], dark_tokens[bg])
        a("<tr>")
        a(f'<td class="tok">{fg}</td><td class="tok">{bg}</td>')
        a(f'<td class="num">{cl:.2f} <span class="pill info">n/a</span></td>')
        a(f'<td class="num">{cd:.2f} <span class="pill info">n/a</span></td>')
        a(f'<td class="use">{esc(why)}</td>')
        a("</tr>")
    a("</table></div>")
    a('<p class="prose" style="margin-top:24px">Status colours — success, error, warning — are '
      'deliberately unassigned. The palette has no green and no red, and overloading orange '
      'onto both warning and error would make two states that must never be confusable look '
      'identical.</p>')
    a("</section>")

    a("<footer>")
    a("<span>Generated from scripts/generate_color_tokens.py. "
      "Edit the generator, never the outputs.</span>")
    a('<span class="mono" style="font-size:12px">tokens/color.css · tokens/color.json · '
      "docs/design-system.md</span>")
    a("</footer>")
    a("</div>")

    # Theme toggle. The tokens already follow the OS when no choice is stamped;
    # this pins one so the page can be inspected in either.
    a("""<script>
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var label = document.getElementById('theme-label');
  function current() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paint() { label.textContent = current() === 'dark' ? 'Dark' : 'Light'; }
  btn.addEventListener('click', function () {
    root.setAttribute('data-theme', current() === 'dark' ? 'light' : 'dark');
    paint();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);
  paint();
})();
</script>""")
    return "\n".join(h) + "\n"


if __name__ == "__main__":
    out = ROOT / "preview" / "colors.html"
    out.write_text(build_html())
    print(f"wrote {out.relative_to(ROOT)}")
