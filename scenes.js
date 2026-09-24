/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

// Stand-ins for the made-up blocks that appear in the thumbnails.
Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'play_note',
    message0: 'Play %1',
    args0: [
      {type: 'field_dropdown', name: 'NOTE', options: [['D4', 'D4'], ['C4', 'C4']]},
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'red',
  },
  {
    type: 'border_radius',
    message0: 'Border Radius %1',
    args0: [
      {type: 'field_dropdown', name: 'RADIUS', options: [['24', '24'], ['8', '8']]},
    ],
    previousStatement: null,
    nextStatement: null,
    style: 'red',
  },
  {
    type: 'print',
    message0: 'Print %1',
    args0: [{type: 'input_value', name: 'VALUE'}],
    previousStatement: null,
    nextStatement: null,
    style: 'green',
  },
  {
    type: 'list_range',
    message0: 'create list of numbers from %1 up to %2',
    args0: [
      {type: 'field_number', name: 'FROM', value: 0},
      {type: 'field_number', name: 'TO', value: 5},
    ],
    output: 'Array',
    style: 'yellow',
  },
]);

const num = (n, shadow = false) => ({
  [shadow ? 'shadow' : 'block']: {type: 'math_number', fields: {NUM: n}},
});

/**
 * Each scene recreates one thumbnail. `scale` is the workspace zoom; `styles`
 * and `warnings` are keyed by block id and applied after loading, because
 * neither is part of the serialized state.
 */
const SCENES = [
  {
    // Not a thumbnail: empty sockets, which none of the originals show.
    name: 'empty-sockets',
    width: 304,
    height: 264,
    scale: 1,
    blocks: [
      {type: 'math_arithmetic', x: 30, y: 30, fields: {OP: 'ADD'}},
      {type: 'lists_create_with', x: 30, y: 120, extraState: {itemCount: 2}},
    ],
  },
  {
    name: 'themes',
    width: 304,
    height: 264,
    scale: 1.15,
    blocks: [
      {
        type: 'math_arithmetic', x: 40, y: 100,
        fields: {OP: 'ADD'},
        inputs: {A: num(1, true), B: num(1, true)},
      },
    ],
  },
  {
    name: 'getting-started',
    width: 304,
    height: 264,
    scale: 1,
    blocks: [
      {
        type: 'controls_repeat_ext', x: 42, y: 66,
        inputs: {
          TIMES: num(3),
          DO: {block: {type: 'play_note', fields: {NOTE: 'D4'}}},
        },
      },
    ],
  },
  {
    name: 'css',
    width: 316,
    height: 274,
    scale: 1.2,
    blocks: [
      {
        type: 'controls_if', x: 22, y: 51,
        inputs: {
          IF0: {block: {type: 'logic_boolean', fields: {BOOL: 'TRUE'}}},
          DO0: {block: {type: 'border_radius', fields: {RADIUS: '24'}}},
        },
      },
    ],
  },
  {
    name: 'custom-generator',
    width: 304,
    height: 264,
    scale: 0.9,
    styles: {f: 'blue', t: 'blue'},
    blocks: [
      {
        type: 'lists_create_with', x: 22, y: 55,
        extraState: {itemCount: 4},
        inputs: {
          ADD0: num(1),
          ADD1: {block: {type: 'text', fields: {TEXT: 'two'}}},
          ADD2: {block: {type: 'logic_boolean', id: 'f', fields: {BOOL: 'FALSE'}}},
          ADD3: {block: {type: 'logic_boolean', id: 't', fields: {BOOL: 'TRUE'}}},
        },
      },
    ],
  },
  {
    name: 'validating-and-displaying',
    width: 304,
    height: 264,
    scale: 0.7,
    styles: {bad: 'grey'},
    warnings: {bad: 'The start is bigger than the end.'},
    blocks: [
      {
        type: 'print', x: 26, y: 102,
        inputs: {VALUE: {block: {type: 'list_range', fields: {FROM: 0, TO: 5}}}},
      },
      {type: 'list_range', id: 'bad', x: 44, y: 172, fields: {FROM: 6, TO: 3}},
    ],
  },
  {
    name: 'custom-renderers',
    width: 304,
    height: 264,
    scale: 1.05,
    styles: {loop: 'blue'},
    blocks: [
      {
        type: 'controls_repeat_ext', id: 'loop', x: 56, y: 68,
        inputs: {TIMES: num(10, true)},
      },
    ],
  },
];
