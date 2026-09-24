/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';

/**
 * The "thumbnail" theme: colours and font sampled from the codelab card
 * thumbnails. Pair it with the "thumbnail" renderer (renderer.js), which owns
 * the shapes and draws field backgrounds as 50% white over the block colour.
 */

const PALETTE = {
  blue: '#4285f4',
  green: '#34a853',
  red: '#ea4335',
  yellow: '#fbbc04',
  grey: '#d0d2d3',
};

/**
 * In the thumbnails a shadow block is the same colour as a normal block (only
 * its field is lighter), so secondary is the same as primary. Tertiary is the
 * outline in this renderer.
 */
function styleFor(colour) {
  return {
    colourPrimary: colour,
    colourSecondary: colour,
    colourTertiary: '#202124',
  };
}

const blockStyles = {
  logic_blocks: styleFor(PALETTE.yellow),
  loop_blocks: styleFor(PALETTE.green),
  math_blocks: styleFor(PALETTE.blue),
  text_blocks: styleFor(PALETTE.green),
  list_blocks: styleFor(PALETTE.yellow),
  variable_blocks: styleFor(PALETTE.red),
  variable_dynamic_blocks: styleFor(PALETTE.red),
  procedure_blocks: styleFor(PALETTE.blue),
  colour_blocks: styleFor(PALETTE.yellow),
  hat_blocks: styleFor(PALETTE.yellow),
};
// Plain colour names, for recolouring any block to match a particular
// thumbnail: `block.setStyle('red')`.
for (const [name, colour] of Object.entries(PALETTE)) {
  blockStyles[name] = styleFor(colour);
}

Blockly.Theme.defineTheme('thumbnail', {
  name: 'thumbnail',
  base: Blockly.Themes.Classic,
  blockStyles,
  componentStyles: {
    workspaceBackgroundColour: '#ffffff',
  },
  fontStyle: {
    family: '"Google Sans", sans-serif',
    weight: '400',
    size: 12.5,
  },
});
