/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The comparison page (index.html): each original thumbnail next to a
 * Blockly recreation.
 */

import * as Blockly from 'blockly';
import './renderer.js';
import './theme.js';
import {SCENES} from './scenes.js';

const overlays = [];

async function renderScene(scene) {
  const src = `reference/card_thumbnails_${scene.name}.png`;
  const row = document.createElement('div');
  row.className = 'scene';
  row.innerHTML = `
    <div class="stage" style="width:${scene.width}px;height:${scene.height}px">
      <div class="ws" style="width:100%;height:100%"></div>
      <img class="overlay" onerror="this.remove()" src="${src}" width="${scene.width}" height="${scene.height}">
    </div>
    <img class="ref" onerror="this.remove()" src="${src}" width="${scene.width}" height="${scene.height}">
    <div>${scene.name}</div>`;
  document.getElementById('scenes').appendChild(row);
  overlays.push(row.querySelector('.overlay'));

  // ?zoom=3 magnifies every scene, for inspecting shapes up close.
  const zoom = Number(new URLSearchParams(location.search).get('zoom') ?? 1);
  const ws = Blockly.inject(row.querySelector('.ws'), {
    renderer: 'thumbnail',
    theme: 'thumbnail',
    zoom: {startScale: scene.scale * zoom},
    move: {scrollbars: false, drag: false, wheel: false},
    trashcan: false,
    sounds: false,
  });
  Blockly.serialization.workspaces.load(
    {blocks: {languageVersion: 0, blocks: scene.blocks}},
    ws,
  );
  for (const [id, style] of Object.entries(scene.styles ?? {})) {
    ws.getBlockById(id)?.setStyle(style);
  }
  for (const [id, text] of Object.entries(scene.warnings ?? {})) {
    ws.getBlockById(id)?.setWarningText(text);
  }
  // Put workspace (0, 0) at the stage's top-left so scene x/y are pixels
  // (divided by scale) from the corner, like the thumbnails.
  ws.translate(0, 0);
}

// Measure text with the real font, not the fallback.
document.fonts.load('12.5pt "Google Sans"').then(() => {
  SCENES.forEach(renderScene);
  document.getElementById('overlay').addEventListener('input', (e) => {
    for (const img of overlays) img.style.opacity = e.target.value;
  });
  for (const img of overlays) img.style.opacity = 0;
});
