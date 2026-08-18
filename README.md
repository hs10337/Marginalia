# Marginalia

Typography tokens for Marginalia — **Instrument Sans** for the interface,
**Newsreader** for reading — authored once and generated for iOS and web.

- **[docs/typography.md](docs/typography.md)** — how the system works and how to use it
- **[docs/scale.md](docs/scale.md)** — every style with its sizes
- **[docs/specimen.html](docs/specimen.html)** — visual specimen, open in a browser

```sh
node scripts/build-tokens.mjs   # regenerate after editing tokens/typography.json
```

| | |
| --- | --- |
| Source of truth | `tokens/typography.json` |
| iOS | `platforms/ios/Typography.swift` + generated tokens |
| Web | `platforms/web/typography.css` |
