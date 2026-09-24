/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The playground page: a normal workspace with a toolbox, saved to
 * localStorage.
 */

import * as Blockly from 'blockly';
import './renderer.js';
import './theme.js';
import './blocks/resizable_list.js';
import './blocks/add_text.js';
import {TOOLBOX} from './toolbox.js';

const STORAGE_KEY = 'thumbnail-playground';

// Measure text with the real font, not the fallback.
document.fonts.load('12.5pt "Google Sans"').then(() => {
  const ws = Blockly.inject('blocklyDiv', {
    renderer: 'thumbnail',
    theme: 'thumbnail',
    toolbox: TOOLBOX,
    trashcan: true,
    zoom: {controls: true, wheel: true, startScale: 1.5},
    move: {scrollbars: true, drag: true, wheel: false},
  });

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    Blockly.serialization.workspaces.load(JSON.parse(saved), ws);
  }
  ws.addChangeListener((e) => {
    if (e.isUiEvent) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Blockly.serialization.workspaces.save(ws)),
    );
  });

  document.getElementById('clear').addEventListener('click', () => {
    ws.clear();
  });
});
