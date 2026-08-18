# Typography

Marginalia uses two typefaces, split by role:

- **Instrument Sans** — the interface. Navigation, controls, labels, metadata. It is
  narrow-ish, neutral, and holds up at 11pt, which is what a dense library screen needs.
- **Newsreader** — the reading. Book text, excerpts, quotes, and the margin notes
  themselves. It has a true italic and a variable optical-size axis, so the same face
  works at a 40pt cover title and a 14pt citation without looking like the same drawing
  scaled up.

The rule of thumb: **if the reader wrote it or an author wrote it, it's Newsreader. If
the app said it, it's Instrument Sans.**

## Where things live

```
tokens/typography.json                          ← source of truth, edit this
scripts/build-tokens.mjs                        ← generator (no dependencies)
platforms/ios/TypographyTokens.generated.swift  ← generated
platforms/ios/Typography.swift                  ← hand-written runtime
platforms/web/typography.css                    ← generated
docs/scale.md                                   ← generated table of every style
docs/specimen.html                              ← generated specimen, open in a browser
```

Change a size in `tokens/typography.json`, then:

```sh
node scripts/build-tokens.mjs
```

Never edit a generated file — the next build overwrites it.

## The scale

See [scale.md](./scale.md) for every token with its sizes. The shape of it:

- `editorial.*` — Newsreader. Display → title → heading → subheading, then three
  body sizes (`bodyLarge` / `body` / `bodySmall`) plus `quote`, `note` and `caption`.
  The three body sizes exist because reading text is the one thing a reader will want
  to resize by hand; they map cleanly to a small/medium/large control.
- `ui.*` — Instrument Sans. `display` → `title1/2/3` → `headline` → `body` →
  `callout` → `subhead` → `footnote` → `caption` → `captionSmall`, plus `overline`,
  `button` and `tabLabel`.

Sizes are authored iOS-first in points, anchored to the platform's own conventions
(17pt body, 15pt subhead, 13pt footnote) so the app feels native next to system
controls. Web sizes are derived from those and stated explicitly in the tokens where
they diverge — the display sizes get bigger on a wide screen, and `ui.body` starts a
point smaller because 17px of sans on a desktop reads heavier than 17pt on a phone.

### Why line heights are absolute on iOS and ratios on web

iOS gets absolute point line heights, because Dynamic Type scales the size and the
line height together through `UIFontMetrics` — a ratio would drift at accessibility
sizes. Web gets unitless ratios, because a fluid `clamp()` size needs the leading to
track it continuously.

## iOS

Add the font files to the target and list them under `UIAppFonts` in `Info.plist`.
The PostScript names the code expects are in the generated
`postScriptName(weight:italic:)` table — if you ship the variable fonts or a
different static cut, correct the names in `tokens/typography.json` rather than
in Swift.

```swift
Text("The Rings of Saturn")
    .typography(.uiHeadline)

Text(passage)
    .typography(.editorialBody)

Text("Recently annotated")
    .typography(.uiOverline)   // uppercasing is part of the token
```

Every token scales with Dynamic Type via its `textStyle` anchor, applies its own
tracking (scaled proportionally), and sets line spacing as the difference between the
token's line height and the font's natural one — so a single-line label is never
inflated, and a paragraph gets the leading it was designed with.

For the UIKit reading surface (a `UITextView` rendering annotated text), use the
attribute bundle instead so highlights and notes share metrics with SwiftUI text:

```swift
let attributed = NSAttributedString(
    string: passage,
    attributes: TypographyToken.editorialBody.attributes()
)
```

A missing font falls back to the system font at the same size and weight rather than
crashing, and prints once per face in DEBUG. To fail loudly at launch instead:

```swift
#if DEBUG
assert(TypographyDiagnostics.missingFontNames().isEmpty,
       "Missing fonts: \(TypographyDiagnostics.missingFontNames())")
#endif
```

## Web

Load the fonts, then the stylesheet:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/platforms/web/typography.css">
```

Self-hosting is preferable in production — both families are SIL Open Font License,
so the variable `.woff2` files can be served from your own origin. Keep the family
names (`Instrument Sans`, `Newsreader`) identical so the token stacks resolve.

Each style ships as both a class and a set of custom properties:

```html
<h1 class="type-editorial-title">Notes on a Ruined Map</h1>
<p class="type-editorial-body">…</p>
```

```css
.article-lede {
  font-family: var(--type-editorial-body-large-family);
  font-size: var(--type-editorial-body-large-size);
  line-height: var(--type-editorial-body-large-line-height);
}
```

Styles whose min and max sizes differ interpolate with `clamp()` between a 375px and
a 1280px viewport; the rest are fixed. Newsreader styles set `font-optical-sizing:
auto`, which is the web equivalent of the `opsz` values the iOS tokens carry.

## Adding a style

Add an entry to `scale` in `tokens/typography.json` with a `family`, `weight`,
`tracking`, an `ios` block (`size`, `lineHeight`, `textStyle`, optional
`opticalSize`) and a `web` block (`min`, `max`, `lineHeight`), then rebuild. The
Swift constant, the CSS class, the docs table and the specimen all follow.

Before adding one, check whether an existing token is close enough. Twenty-five
styles is already near the ceiling for a scale a team can hold in its head.
