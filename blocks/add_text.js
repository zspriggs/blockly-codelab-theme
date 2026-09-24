/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The sample app's `add_text` block, ported from
 * ~/Code/testing/walkthrough-mutator-codelab/src/blocks/text.js.
 *
 * The original uses `colour: 160`. A raw colour makes Blockly derive the
 * tertiary colour, which this renderer draws as the outline, so the block
 * would get a light outline instead of the thumbnails' dark one. It uses the
 * theme's red instead, so it stands out from the green loop blocks.
 */

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'add_text',
    message0: 'Add text %1',
    args0: [{type: 'input_value', name: 'TEXT', check: 'String'}],
    previousStatement: null,
    nextStatement: null,
    style: 'red',
    tooltip: '',
    helpUrl: '',
  },
]);
