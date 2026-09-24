# Thumbnail theme

A Blockly theme (`theme.js`) and renderer (`renderer.js`) that draw blocks in
the style of the codelab card thumbnails.

Serve the folder and open one of the pages:

```bash
python3 -m http.server 8123
```

- `playground.html` — a normal workspace with a toolbox, for building new
  thumbnails. It saves to localStorage.
- `index.html` — each original thumbnail next to a Blockly recreation, for
  comparing the style. `?zoom=3` magnifies.

## Adding a custom block

1. Put its definition in `blocks/`, using the global `Blockly` (not
   `import * as Blockly from 'blockly'` — see below). `blocks/resizable_list.js`
   is an example.
2. Add a `<script>` tag for it in `playground.html`, after `theme.js`.
3. Add it to the "Codelab blocks" category in `toolbox.js`.

Everything here uses the single global `Blockly` from `blockly.min.js`, with no
build step. Code written with ES `import`s (like the webpack sample app) would
load a second copy of Blockly, which wouldn't know about this renderer, theme,
or any blocks registered on the global one.

## Using the style in another app

In a webpack/ES-module app, change the top of `renderer.js` and `theme.js` to
`import * as Blockly from 'blockly';`, import both files before injecting,
and pass `renderer: 'thumbnail', theme: 'thumbnail'` to `Blockly.inject`.
Also load Google Sans (see the `<link>` in `playground.html`).

## Thumbnail files

The originals come in two versions: `card_thumbnails_<name>.png` on a
transparent background, and `card_thumbnails_<name>-dark.png` on white (for
the site's dark mode).

## AI disclaimer

Disclaimer: This repository was almost entirely created via vibe coding, it is 
only intended to be used to create resonable screenshots for codelabs and not 
as an example of using Blockly 
