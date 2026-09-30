# WBR-S015 — non-perceptible document-height difference

Row: `/mobile?unsupported=desktopSettings`, paired mobile context, 390x844, en.

The automated row reports `geo=false` only because the prototype's `html`,
`body` and `#__nuxt` boxes are 844px tall while the source's are 918px. Text,
controls, route and the viewport screenshot are identical (0 changed pixels).

Cause: the prototype's Nuxt dev renderer (Nuxt 3.21.11 from the prototype
lockfile; the source dev server runs 3.21.1) emits `<link rel="stylesheet">`
tags for every stylesheet in its dev module graph. That includes the default
layout's global `html, body, #__nuxt { height: 100% }` rule, even on `/mobile`,
which uses `layout: false`. The page content (918px) overflows that box. The
document still scrolls to the same height.

Evidence in this folder:

- `s015-full-4291.png` (source) and `s015-full-4199.png` (prototype): full-page
  captures, both 390x918, 0 differing bytes.
- `s015-scrolled-4291.png` and `s015-scrolled-4199.png`: after scrolling 400px,
  both at scrollY 74, 0 differing bytes.
- `comparison.json`, `probe-output.txt`.

Classification: no perceptible or behavioral difference. It is a dev-server
stylesheet-preload artifact, recorded rather than patched.
