# Marginalia Design System

## Colour

This is the first system in the Marginalia design language. Everything below is
derived from four source colours, and only from those four — no new hues have
been introduced.

| Name | Hex | Role |
| --- | --- | --- |
| Light | `#FEFDF9` | Paper. The lightest point of the neutral axis. |
| Ultramarine | `#3046C5` | Brand. Primary actions, links, selection. |
| Orange | `#FF5A1F` | Accent. Emphasis, highlights, marks. |
| Dark | `#181818` | Ink. The darkest point of the neutral axis. |

### Token architecture

Two layers, and the separation between them is the whole point.

**Primitives** (`--color-ultramarine-700`) are the palette: every step of every
ramp, named by hue and weight. They describe what a colour *is*. Components must
never reference a primitive directly — a component that hardcodes
`--color-neutral-950` for its text is a component that turns invisible the
moment someone switches to the dark theme.

**Semantic tokens** (`--color-text-primary`) are the vocabulary: they describe
what a colour is *for*. Each one points at a different primitive per theme, so
swapping themes rebinds every semantic token at once and no component changes.

```
--color-neutral-950  ──┐
                       ├──►  --color-text-primary  ──►  component
--color-neutral-50   ──┘
   (primitives)            (semantic, theme-aware)
```

Rule of thumb: if you are typing a number into a component's colour, you are on
the wrong layer.

### How the ramps are built

Ramps are generated, not hand-picked. `scripts/generate_color_tokens.py` works
in **OKLCH**, where a change in the lightness coordinate matches a change in
perceived lightness — which sRGB and HSL both fail at, and which is why naive
ramps go grey and muddy in the middle.

Three rules produce every step:

1. **Hue is held constant** down each ramp. Ultramarine stays at hue 269° from
   its palest tint to its deepest shade, so nothing drifts purple or cyan.
2. **Lightness follows one shared grid** across all ramps. Any `-600` sits at
   the same perceived lightness as any other `-600`, which is what makes the
   ramps swappable: recolouring a component from brand to accent does not change
   how heavy it looks.
3. **Chroma falls away from the source colour** in both directions — steeply
   toward white (pale tints go muddy if you keep the saturation) and gently
   toward black (dark shades need to stay recognisably the brand). Any step that
   lands outside sRGB has its chroma reduced by bisection until it fits, so
   every value is displayable.

The source colours are **pinned exactly** at their step. `--color-ultramarine-700`
is `#3046C5` to the byte, not an approximation the maths happened to land near.

Ultramarine sits at `700` and orange at `500` because that is where each falls
on the lightness grid, and because those placements leave a usable number of
shades on each side for hover, pressed, and dark-theme depth.

### Light and dark are one ramp, not two

`#FEFDF9` and `#181818` are the two ends of the same axis, so they are the two
ends of a single `neutral` ramp — `neutral-50` and `neutral-950`. Splitting them
into separate "light" and "dark" ramps would produce two scales overlapping
through the same greys, and a permanent question about which one to reach for.

The cream's hue is carried the whole way down, with a slight lift in chroma
through the mid-tones so the warmth survives 8-bit quantisation instead of
dissolving into hue noise. The greys are warm on purpose: a neutral grey reads
cold and slightly dirty next to `#FEFDF9`.

`--color-light` and `--color-dark` exist as aliases onto the ramp ends, for the
cases where you mean the brand colour rather than a position on a scale.

### Shading

Shading effects are transparent, not flat. A shadow or a hover wash has to sit
over a surface whose colour it does not know, and a flat ramp step would hide
what is beneath it instead of darkening it. So the shading tokens are alpha
values built from `neutral-950` (to darken) and `neutral-50` (to lighten).

This is also why hover and pressed states come in two flavours. Use the ramp
steps (`--color-brand-hover`) when the element has its own fill. Use the overlay
washes (`--color-overlay-hover`) when it does not — a ghost button, a list row,
anything sitting directly on a surface.

Dark themes need heavier shadows to read at all, so `--color-shadow-*` rebinds
to stronger alphas there rather than keeping one fixed value.

### Accessibility

`scripts/check_contrast.py` audits every pairing a component is actually going
to use, in both themes, and exits non-zero on a failure. All 58 enforced
pairings currently pass. Run it before shipping a token change.

Three constraints came out of that audit and are baked into the tokens:

- **`border-strong` is the only border token that clears 3:1.** Anything
  outlining an interactive control — inputs, checkboxes, selects — must use it.
  `border-subtle` and `border-default` are decorative (dividers, card edges) and
  carry no contrast guarantee. WCAG 1.4.11 governs boundaries that *identify* a
  control, not decoration.
- **Accent fills brighten on interaction instead of darkening.** `#FF5A1F` sits
  high on the lightness axis, so it takes dark text; darkening it on hover drops
  that label below 4.5:1. Going up the ramp keeps the label readable and matches
  what the dark theme already does.
- **`text-disabled` is deliberately below AA.** Unavailable controls are
  supposed to look unavailable. Never use it for text a user has to read.

Ultramarine and orange are close in perceived lightness at their source steps,
so never rely on hue alone to distinguish two elements — pair it with weight,
shape, or a label.

### Status colours are not defined yet

There is no green and no red in this palette, so `success` / `error` /
`warning` / `info` have deliberately been left unassigned rather than faked by
overloading orange onto both warning and error — two states that must never be
confusable.

Two options when this is picked up: derive two additional hues tuned in OKLCH to
match the existing chroma and lightness so they read as part of the system, or
keep four hues and distinguish status by icon and copy rather than colour. Until
that decision is made, do not invent status colours locally.

## Reference

<!-- generated:start -->
<!-- Regenerate with: python3 scripts/generate_color_tokens.py -->

### Ramps

#### `neutral`

| Step | Hex | OKLCH (L C H) | On `light` | On `dark` | |
| --- | --- | --- | --- | --- | --- |
| `50` | `#FEFDF9` | `0.994 0.005 95.1` | 1.00:1 | 17.45:1 | **source colour** — `light` |
| `100` | `#EEEDE8` | `0.945 0.007 97.4` | 1.15:1 | 15.15:1 |  |
| `200` | `#DEDCD7` | `0.895 0.007 88.6` | 1.35:1 | 12.96:1 |  |
| `300` | `#C9C7C2` | `0.830 0.007 88.7` | 1.66:1 | 10.51:1 |  |
| `400` | `#AEACA6` | `0.744 0.009 91.5` | 2.23:1 | 7.82:1 |  |
| `500` | `#95948E` | `0.666 0.009 98.9` | 2.99:1 | 5.84:1 |  |
| `600` | `#7D7C76` | `0.585 0.009 99.0` | 4.11:1 | 4.24:1 |  |
| `700` | `#66655F` | `0.506 0.009 99.0` | 5.74:1 | 3.04:1 |  |
| `800` | `#504E4A` | `0.424 0.007 84.6` | 8.16:1 | 2.14:1 |  |
| `900` | `#383733` | `0.336 0.007 95.3` | 11.71:1 | 1.49:1 |  |
| `950` | `#181818` | `0.209 0.000 89.9` | 17.45:1 | 1.00:1 | **source colour** — `dark` |

#### `ultramarine`

| Step | Hex | OKLCH (L C H) | On `light` | On `dark` | |
| --- | --- | --- | --- | --- | --- |
| `50` | `#F3F7FF` | `0.975 0.011 264.5` | 1.05:1 | 16.54:1 |  |
| `100` | `#E6EDFF` | `0.946 0.025 268.8` | 1.15:1 | 15.15:1 |  |
| `200` | `#CFDCFF` | `0.896 0.050 269.3` | 1.35:1 | 12.97:1 |  |
| `300` | `#B1C6FF` | `0.831 0.084 268.8` | 1.67:1 | 10.48:1 |  |
| `400` | `#8CA8FD` | `0.745 0.127 269.3` | 2.26:1 | 7.72:1 |  |
| `500` | `#6D8CF3` | `0.664 0.157 269.2` | 3.08:1 | 5.66:1 |  |
| `600` | `#5270E5` | `0.585 0.180 269.3` | 4.29:1 | 4.07:1 |  |
| `700` | `#3046C5` | `0.463 0.198 269.2` | 7.35:1 | 2.37:1 | **source colour** |
| `800` | `#293DB1` | `0.425 0.184 269.1` | 8.61:1 | 2.03:1 |  |
| `900` | `#1A2883` | `0.335 0.152 269.1` | 12.32:1 | 1.42:1 |  |
| `950` | `#0E175C` | `0.255 0.122 269.1` | 15.92:1 | 1.10:1 |  |

#### `orange`

| Step | Hex | OKLCH (L C H) | On `light` | On `dark` | |
| --- | --- | --- | --- | --- | --- |
| `50` | `#FFF4F1` | `0.975 0.013 35.7` | 1.06:1 | 16.46:1 |  |
| `100` | `#FFE7DF` | `0.945 0.029 39.3` | 1.16:1 | 15.01:1 |  |
| `200` | `#FFD0C2` | `0.895 0.057 37.2` | 1.37:1 | 12.73:1 |  |
| `300` | `#FFB19A` | `0.829 0.097 37.1` | 1.72:1 | 10.15:1 |  |
| `400` | `#FF845F` | `0.745 0.159 37.5` | 2.37:1 | 7.37:1 |  |
| `500` | `#FF5A1F` | `0.682 0.211 37.7` | 3.06:1 | 5.69:1 | **source colour** |
| `600` | `#D54201` | `0.586 0.193 37.7` | 4.48:1 | 3.90:1 |  |
| `700` | `#AF3400` | `0.506 0.167 37.6` | 6.23:1 | 2.80:1 |  |
| `800` | `#8A2700` | `0.425 0.140 37.6` | 8.70:1 | 2.00:1 |  |
| `900` | `#631900` | `0.335 0.111 37.4` | 12.36:1 | 1.41:1 |  |
| `950` | `#420E00` | `0.254 0.084 37.7` | 15.94:1 | 1.09:1 |  |

### Transparent shades

| Token | Built from | Value |
| --- | --- | --- |
| `--color-shadow-4` | `neutral-950` @ 4% | `rgba(24, 24, 24, 0.04)` |
| `--color-shadow-6` | `neutral-950` @ 6% | `rgba(24, 24, 24, 0.06)` |
| `--color-shadow-8` | `neutral-950` @ 8% | `rgba(24, 24, 24, 0.08)` |
| `--color-shadow-12` | `neutral-950` @ 12% | `rgba(24, 24, 24, 0.12)` |
| `--color-shadow-16` | `neutral-950` @ 16% | `rgba(24, 24, 24, 0.16)` |
| `--color-shadow-24` | `neutral-950` @ 24% | `rgba(24, 24, 24, 0.24)` |
| `--color-scrim-40` | `neutral-950` @ 40% | `rgba(24, 24, 24, 0.4)` |
| `--color-scrim-60` | `neutral-950` @ 60% | `rgba(24, 24, 24, 0.6)` |
| `--color-scrim-80` | `neutral-950` @ 80% | `rgba(24, 24, 24, 0.8)` |
| `--color-highlight-8` | `neutral-50` @ 8% | `rgba(254, 253, 249, 0.08)` |
| `--color-highlight-16` | `neutral-50` @ 16% | `rgba(254, 253, 249, 0.16)` |
| `--color-highlight-24` | `neutral-50` @ 24% | `rgba(254, 253, 249, 0.24)` |
| `--color-ultramarine-8` | `ultramarine-700` @ 8% | `rgba(48, 70, 197, 0.08)` |
| `--color-ultramarine-12` | `ultramarine-700` @ 12% | `rgba(48, 70, 197, 0.12)` |
| `--color-ultramarine-24` | `ultramarine-700` @ 24% | `rgba(48, 70, 197, 0.24)` |
| `--color-orange-8` | `orange-500` @ 8% | `rgba(255, 90, 31, 0.08)` |
| `--color-orange-12` | `orange-500` @ 12% | `rgba(255, 90, 31, 0.12)` |
| `--color-orange-24` | `orange-500` @ 24% | `rgba(255, 90, 31, 0.24)` |

### Semantic tokens

#### Backgrounds

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-bg-canvas` | `neutral-50` `#FEFDF9` | `neutral-950` `#181818` | Page background |
| `--color-bg-subtle` | `neutral-100` `#EEEDE8` | `neutral-900` `#383733` | Recessed areas, table stripes, code blocks |
| `--color-bg-muted` | `neutral-200` `#DEDCD7` | `neutral-800` `#504E4A` | Disabled fills, inactive tabs |
| `--color-bg-inverse` | `neutral-950` `#181818` | `neutral-50` `#FEFDF9` | Tooltips and other deliberately inverted surfaces |

#### Surfaces

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-surface-default` | `neutral-50` `#FEFDF9` | `neutral-900` `#383733` | Cards, panels, sheets |
| `--color-surface-raised` | `neutral-50` `#FEFDF9` | `neutral-800` `#504E4A` | Menus, popovers, anything above a card |
| `--color-surface-sunken` | `neutral-100` `#EEEDE8` | `neutral-950` `#181818` | Wells and inset areas |
| `--color-surface-overlay` | `neutral-50` `#FEFDF9` | `neutral-800` `#504E4A` | Modals and dialogs |

#### Text

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-text-primary` | `neutral-950` `#181818` | `neutral-50` `#FEFDF9` | Body copy and headings |
| `--color-text-secondary` | `neutral-800` `#504E4A` | `neutral-300` `#C9C7C2` | Supporting copy, labels |
| `--color-text-tertiary` | `neutral-700` `#66655F` | `neutral-400` `#AEACA6` | Captions, metadata, placeholders |
| `--color-text-disabled` | `neutral-500` `#95948E` | `neutral-600` `#7D7C76` | Non-interactive text; deliberately below AA |
| `--color-text-inverse` | `neutral-50` `#FEFDF9` | `neutral-950` `#181818` | Text on bg-inverse |
| `--color-text-on-brand` | `neutral-50` `#FEFDF9` | `neutral-950` `#181818` | Text on a filled brand surface |
| `--color-text-on-accent` | `neutral-950` `#181818` | `neutral-950` `#181818` | Text on a filled accent surface |
| `--color-text-brand` | `ultramarine-700` `#3046C5` | `ultramarine-400` `#8CA8FD` | Links and brand-coloured text |
| `--color-text-accent` | `orange-700` `#AF3400` | `orange-400` `#FF845F` | Accent-coloured text |

#### Borders

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-border-subtle` | `neutral-200` `#DEDCD7` | `neutral-800` `#504E4A` | Dividers and hairlines; decorative only |
| `--color-border-default` | `neutral-300` `#C9C7C2` | `neutral-700` `#66655F` | Card and panel edges; decorative only |
| `--color-border-strong` | `neutral-600` `#7D7C76` | `neutral-400` `#AEACA6` | Outlines an interactive control; the only border token that clears 3:1 |
| `--color-border-brand` | `ultramarine-700` `#3046C5` | `ultramarine-500` `#6D8CF3` | Selected and active edges |

#### Brand - ultramarine

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-brand-default` | `ultramarine-700` `#3046C5` | `ultramarine-500` `#6D8CF3` | Primary buttons, active nav |
| `--color-brand-hover` | `ultramarine-800` `#293DB1` | `ultramarine-400` `#8CA8FD` | Primary hover |
| `--color-brand-active` | `ultramarine-900` `#1A2883` | `ultramarine-300` `#B1C6FF` | Primary pressed |
| `--color-brand-subtle` | `ultramarine-50` `#F3F7FF` | `ultramarine-950` `#0E175C` | Tinted brand background |
| `--color-brand-subtle-hover` | `ultramarine-100` `#E6EDFF` | `ultramarine-900` `#1A2883` | Tinted brand background, hovered |
| `--color-brand-muted` | `ultramarine-200` `#CFDCFF` | `ultramarine-800` `#293DB1` | Brand background sitting behind text |
| `--color-brand-disabled` | `ultramarine-200` `#CFDCFF` | `ultramarine-900` `#1A2883` | Disabled primary fill |

#### Accent - orange

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-accent-default` | `orange-500` `#FF5A1F` | `orange-400` `#FF845F` | Highlights, badges, emphasis |
| `--color-accent-hover` | `orange-400` `#FF845F` | `orange-300` `#FFB19A` | Accent hover; brightens rather than darkens |
| `--color-accent-active` | `orange-300` `#FFB19A` | `orange-200` `#FFD0C2` | Accent pressed; brightens rather than darkens |
| `--color-accent-subtle` | `orange-50` `#FFF4F1` | `orange-950` `#420E00` | Tinted accent background |
| `--color-accent-subtle-hover` | `orange-100` `#FFE7DF` | `orange-900` `#631900` | Tinted accent background, hovered |
| `--color-accent-muted` | `orange-200` `#FFD0C2` | `orange-800` `#8A2700` | Accent background sitting behind text |

#### Shading

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-shadow-ambient` | `--color-shadow-6` | `--color-shadow-16` | Wide, soft shadow layer |
| `--color-shadow-key` | `--color-shadow-12` | `--color-shadow-24` | Tight, directional shadow layer |
| `--color-scrim` | `--color-scrim-60` | `--color-scrim-80` | Backdrop behind modals |
| `--color-overlay-hover` | `--color-shadow-4` | `--color-highlight-8` | Wash laid over any surface on hover |
| `--color-overlay-active` | `--color-shadow-8` | `--color-highlight-16` | Wash laid over any surface on press |
| `--color-bevel-highlight` | `--color-highlight-16` | `--color-highlight-8` | Top-edge highlight on raised elements |
| `--color-focus-ring` | `--color-ultramarine-24` | `--color-ultramarine-24` | Focus halo |
| `--color-selection` | `--color-ultramarine-12` | `--color-ultramarine-24` | Selected text and rows |

### Elevation

| Token | Value |
| --- | --- |
| `--shadow-xs` | `0 1px 2px 0 var(--color-shadow-ambient)` |
| `--shadow-sm` | `0 1px 2px 0 var(--color-shadow-key), 0 2px 4px -1px var(--color-shadow-ambient)` |
| `--shadow-md` | `0 2px 4px -1px var(--color-shadow-key), 0 6px 12px -2px var(--color-shadow-ambient)` |
| `--shadow-lg` | `0 4px 8px -2px var(--color-shadow-key), 0 12px 24px -4px var(--color-shadow-ambient)` |
| `--shadow-xl` | `0 8px 16px -4px var(--color-shadow-key), 0 24px 48px -8px var(--color-shadow-ambient)` |

<!-- generated:end -->

## Using the tokens

### CSS

```css
@import "tokens/color.css";

.button-primary {
  background: var(--color-brand-default);
  color: var(--color-text-on-brand);
  border: 1px solid transparent;
  box-shadow: var(--shadow-sm);
}
.button-primary:hover  { background: var(--color-brand-hover); }
.button-primary:active { background: var(--color-brand-active); }
.button-primary:focus-visible {
  outline: 2px solid var(--color-border-brand);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-focus-ring);
}
```

### Theming

The light theme is the default. Set `data-theme` on the root element to pin a
theme; leave it off to follow the operating system.

```html
<html data-theme="dark">
```

### Other formats

`tokens/color.json` is the same set in the W3C design-token (DTCG) format, for
Style Dictionary, Figma Variables, and Tokens Studio. Semantic tokens carry
their light value in `$value` and both modes under
`$extensions["com.marginalia.mode"]`.

## Changing the tokens

`tokens/color.css`, `tokens/color.json`, and the generated section above are all
build outputs — editing them by hand gets your change overwritten. Edit
`scripts/generate_color_tokens.py`, then:

```sh
python3 scripts/generate_color_tokens.py   # regenerate
python3 scripts/check_contrast.py          # audit; must exit 0
```
