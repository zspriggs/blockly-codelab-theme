# Thumbnail theme

A Blockly theme (`theme.js`) and renderer (`renderer.js`) that draw blocks in
the style of the codelab card thumbnails.

Install and start the webpack dev server, which opens the comparison page:

```bash
npm install
npm start
```

- `playground.html` (`playground.js`) — a normal workspace with a toolbox,
  for building new thumbnails. It saves to localStorage. Open it at
  `/playground.html` on the dev server's port, or from the link at the top
  of the comparison page.
- `index.html` (`comparison.js`) — each original thumbnail next to a Blockly
  recreation, for comparing the style. `?zoom=3` magnifies.

Each page has one entry script, listed in `webpack.config.js`, which imports
everything else. The HTML files are templates: webpack adds the `<script>`
tag for the page's bundle.

## Adding a custom block

1. Put its definition in `blocks/`, with `import * as Blockly from 'blockly'`
   at the top. `blocks/resizable_list.js` is an example.
2. Import it in `playground.js`.
3. Add it to the "Codelab blocks" category in `toolbox.js`.

## Using the style in another app

Copy `renderer.js` and `theme.js` into the app, import both before injecting
(`import './renderer.js'; import './theme.js';`), and pass
`renderer: 'thumbnail', theme: 'thumbnail'` to `Blockly.inject`. Also load Google Sans (see the `<link>` in `playground.html`).

## Thumbnail files

The originals come in two versions: `card_thumbnails_<name>.png` on a
transparent background, and `card_thumbnails_<name>-dark.png` on white (for
the site's dark mode).

## AI disclaimer

Disclaimer: This repository was almost entirely created via vibe coding, it is 
only intended to be used to create resonable screenshots for codelabs and not 
as an example of using Blockly 
