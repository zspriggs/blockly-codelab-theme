/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Toolbox for the playground. "Codelab blocks" holds the custom blocks; add a
 * new one there after defining it in blocks/. The rest is a trimmed-down set
 * of built-in blocks.
 */

const shadowNum = (n) => ({shadow: {type: 'math_number', fields: {NUM: n}}});
const shadowText = (t) => ({shadow: {type: 'text', fields: {TEXT: t}}});
const blocks = (...types) => types.map((type) => ({kind: 'block', type}));

const TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Codelab blocks',
      colour: '#fbbc04',
      contents: [
        {kind: 'block', type: 'resizable_list'},
        {
          kind: 'block',
          type: 'resizable_list',
          extraState: {itemCount: 3},
          inputs: {
            ADD0: {block: {type: 'math_number', fields: {NUM: 1}}},
            ADD1: {block: {type: 'text', fields: {TEXT: 'two'}}},
            ADD2: {block: {type: 'logic_boolean', fields: {BOOL: 'TRUE'}}},
          },
        },
        {kind: 'block', type: 'add_text', inputs: {TEXT: shadowText('abc')}},
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '#fbbc04',
      contents: blocks(
        'controls_if',
        'logic_compare',
        'logic_operation',
        'logic_negate',
        'logic_boolean',
        'logic_null',
        'logic_ternary',
      ),
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '#34a853',
      contents: [
        {kind: 'block', type: 'controls_repeat_ext', inputs: {TIMES: shadowNum(10)}},
        ...blocks('controls_whileUntil'),
        {
          kind: 'block',
          type: 'controls_for',
          inputs: {FROM: shadowNum(1), TO: shadowNum(10), BY: shadowNum(1)},
        },
        ...blocks('controls_forEach', 'controls_flow_statements'),
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '#4285f4',
      contents: [
        {kind: 'block', type: 'math_number', fields: {NUM: 123}},
        {kind: 'block', type: 'math_arithmetic', inputs: {A: shadowNum(1), B: shadowNum(1)}},
        {kind: 'block', type: 'math_single', inputs: {NUM: shadowNum(9)}},
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {FROM: shadowNum(1), TO: shadowNum(100)},
        },
      ],
    },
    {
      kind: 'category',
      name: 'Text',
      colour: '#34a853',
      contents: [
        ...blocks('text', 'text_join'),
        {kind: 'block', type: 'text_length', inputs: {VALUE: shadowText('abc')}},
        {kind: 'block', type: 'text_print', inputs: {TEXT: shadowText('abc')}},
      ],
    },
    {
      kind: 'category',
      name: 'Lists',
      colour: '#fbbc04',
      contents: [
        ...blocks('lists_create_with', 'lists_create_empty'),
        {kind: 'block', type: 'lists_repeat', inputs: {NUM: shadowNum(5)}},
        ...blocks('lists_length', 'lists_isEmpty', 'lists_getIndex', 'lists_sort'),
      ],
    },
    {kind: 'sep'},
    {kind: 'category', name: 'Variables', colour: '#ea4335', custom: 'VARIABLE'},
    {kind: 'category', name: 'Functions', colour: '#4285f4', custom: 'PROCEDURE'},
  ],
};
