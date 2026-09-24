/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';

/**
 * The "thumbnail" renderer: Thrasos with the shapes, sizes and CSS from the
 * codelab card thumbnails. Colours live in the theme (theme.js); everything
 * about geometry lives here.
 */

const OUTLINE = '#202124';

class ThumbnailConstantProvider extends Blockly.blockRendering.ConstantProvider {
  constructor() {
    super();
    // Sizes are in workspace units at scale 1, which is roughly the scale of
    // the 304px-wide thumbnails. Font family and size come from the theme.
    this.CORNER_RADIUS = 8;

    this.NOTCH_WIDTH = 24;
    this.NOTCH_HEIGHT = 7;
    this.NOTCH_OFFSET_LEFT = 20;

    // TAB_HEIGHT is the tab's base, where it meets the block; TAB_WIDTH is
    // how far it sticks out. Proportions measured from the css thumbnail.
    this.TAB_WIDTH = 6;
    this.TAB_HEIGHT = 8;
    this.TAB_OFFSET_FROM_TOP = 14;
    // Not base-class constants; only makePuzzleTab reads these.
    this.TAB_OVERHANG = 2;
    this.TAB_CORNER_RADIUS = 1.5;

    this.MIN_BLOCK_HEIGHT = 40;
    this.MEDIUM_PADDING = 7;
    this.LARGE_PADDING = 14;
    this.STATEMENT_INPUT_PADDING_LEFT = 28;

    this.FIELD_BORDER_RECT_RADIUS = 5;
    this.FIELD_BORDER_RECT_HEIGHT = 28;
    this.FIELD_BORDER_RECT_X_PADDING = 8;

    // The base constructor derives these from the values above, but it runs
    // before this constructor body, so it saw the *old* values. Recompute the
    // ones we care about. (Some are normally derived from TAB_HEIGHT, which is
    // now too small to base row heights on, so they get fixed values.)
    this.DUMMY_INPUT_MIN_HEIGHT = 20;
    this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = 20;
    this.STATEMENT_INPUT_NOTCH_OFFSET = this.NOTCH_OFFSET_LEFT;
    this.TOP_ROW_MIN_HEIGHT = this.MEDIUM_PADDING;
    this.TOP_ROW_PRECEDES_STATEMENT_MIN_HEIGHT = this.LARGE_PADDING;
    this.BOTTOM_ROW_MIN_HEIGHT = this.MEDIUM_PADDING;
    this.BOTTOM_ROW_AFTER_STATEMENT_MIN_HEIGHT = this.LARGE_PADDING;
    this.EMPTY_INLINE_INPUT_HEIGHT = 36;
    this.EMPTY_STATEMENT_INPUT_HEIGHT = this.MIN_BLOCK_HEIGHT;
    this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = this.FIELD_BORDER_RECT_HEIGHT;
    this.FIELD_COLOUR_DEFAULT_HEIGHT = this.FIELD_BORDER_RECT_HEIGHT;
    this.FIELD_CHECKBOX_X_OFFSET = this.FIELD_BORDER_RECT_X_PADDING - 3;
  }

  /**
   * A rounded U-shaped notch instead of Thrasos's straight-sided trapezoid.
   * Each half is one cubic curve with flat tangents at both ends, which gives
   * soft shoulders at the top and a rounded bottom.
   */
  makeNotch() {
    const width = this.NOTCH_WIDTH;
    const height = this.NOTCH_HEIGHT;
    const half = width / 2;
    const {curve, point} = Blockly.utils.svgPaths;

    function makeMainPath(dir) {
      return (
        curve('c', [
          point(dir * half * 0.5, 0),
          point(dir * half * 0.5, height),
          point(dir * half, height),
        ]) +
        curve('c', [
          point(dir * half * 0.5, 0),
          point(dir * half * 0.5, -height),
          point(dir * half, -height),
        ])
      );
    }

    return {
      type: this.SHAPES.NOTCH,
      width,
      height,
      pathLeft: makeMainPath(1),
      pathRight: makeMainPath(-1),
    };
  }

  /**
   * A dovetail: straight sides that flare out from a TAB_HEIGHT-tall base to
   * a flat outer edge TAB_OVERHANG longer at each end, with its two outer
   * corners rounded.
   *
   * The outer edge pokes outside the band [0, TAB_HEIGHT] that Blockly
   * reserves for the connection, so TAB_OFFSET_FROM_TOP has to leave room
   * above it for the overhang plus the corner radius of the input hole.
   */
  makePuzzleTab() {
    const width = this.TAB_WIDTH;
    const height = this.TAB_HEIGHT;
    const overhang = this.TAB_OVERHANG;
    const radius = this.TAB_CORNER_RADIUS;
    const {point} = Blockly.utils.svgPaths;

    // `up` draws the tab from bottom to top (a block's output tab, on its
    // left edge); otherwise top to bottom (an input, on a right edge). The
    // shape is symmetric, so flipping y is enough.
    function makeMainPath(up) {
      const f = up ? -1 : 1;
      // Absolute corners, starting from the block edge at (0, 0).
      const corners = [
        [0, 0],
        [-width, -f * overhang],
        [-width, f * (height + overhang)],
        [0, f * height],
      ];
      // Walk the corners, cutting each of the two outer ones short by
      // `radius` and rounding it with a quadratic curve through the corner.
      // SVG commands are relative, so track the current position.
      let [x, y] = corners[0];
      let path = '';
      const to = (cmd, ...pts) => {
        path += cmd + pts.map(([px, py]) => point(px - x, py - y)).join('');
        [x, y] = pts[pts.length - 1];
      };
      for (let i = 1; i < corners.length - 1; i++) {
        const [cx, cy] = corners[i];
        const toward = ([px, py]) => {
          const d = Math.hypot(px - cx, py - cy);
          return [cx + ((px - cx) * radius) / d, cy + ((py - cy) * radius) / d];
        };
        to('l', toward(corners[i - 1]));
        to('q', [cx, cy], toward(corners[i + 1]));
      }
      to('l', corners[corners.length - 1]);
      return path;
    }

    return {
      type: this.SHAPES.PUZZLE,
      width,
      height,
      pathDown: makeMainPath(false),
      pathUp: makeMainPath(true),
    };
  }

  getCSS_(selector) {
    // prettier-ignore
    return super.getCSS_(selector).concat([
      `${selector} .blocklyPath {`,
        `stroke-width: 1.5px;`,
      `}`,
      // Blockly draws shadow blocks with no outline (a `stroke="none"`
      // attribute, which CSS overrides). Inline shadows borrow the outline of
      // the hole they sit in, but external ones have none, so give every
      // shadow its own.
      `${selector} .blocklyShadow>.blocklyPath {`,
        `stroke: ${OUTLINE};`,
      `}`,

      // Dark text everywhere, instead of white text on the block.
      `${selector} .blocklyText,`,
      `${selector} .blocklyNonEditableField>text,`,
      `${selector} .blocklyEditableField>text {`,
        `fill: ${OUTLINE};`,
      `}`,

      // 50% white over the block colour gives exactly the thumbnails' tints
      // (e.g. #4285f4 -> #a1c2fa).
      `${selector} .blocklyNonEditableField>rect,`,
      `${selector} .blocklyEditableField>rect {`,
        `fill-opacity: .5;`,
      `}`,

      // The ⌄ glyph sits below the text's midline; nudge it up. (The arrow is
      // the only tspan in a dropdown's text.)
      `${selector} .blocklyDropdownField tspan {`,
        `baseline-shift: 25%;`,
      `}`,

      // Image fields (e.g. the text block's quotes) are white PNG/SVG images
      // that CSS can't recolour; a filter darkens them to near-outline colour.
      `${selector} .blocklyImageField image {`,
        `filter: brightness(0.13);`,
      `}`,

      // Mutator gear: outline only, no blue square behind it.
      `${selector} .blocklyMutatorIcon rect.blocklyIconShape {`,
        `fill: none;`,
        `stroke: none;`,
      `}`,
      `${selector} .blocklyMutatorIcon .blocklyIconSymbol,`,
      `${selector} .blocklyMutatorIcon circle.blocklyIconShape {`,
        `fill: none;`,
        `stroke: ${OUTLINE};`,
        `stroke-width: 1.2px;`,
      `}`,

      // Warning: yellow triangle, dark outline and dark "!".
      `${selector} .blocklyWarningIcon .blocklyIconShape {`,
        `fill: #fbbc04;`,
        `stroke: ${OUTLINE};`,
        `stroke-width: 1.2px;`,
      `}`,
      `${selector} .blocklyWarningIcon .blocklyIconSymbol {`,
        `fill: ${OUTLINE};`,
      `}`,
    ]);
  }
}

// Thrasos squares off the right-hand corners always, and the left-hand ones
// when a block has an output or a block attached below. The thumbnails round
// every corner, so these rows never report a square corner.
class RoundedTopRow extends Blockly.blockRendering.TopRow {
  hasLeftSquareCorner() {
    return false;
  }
  hasRightSquareCorner() {
    return false;
  }
}

class RoundedBottomRow extends Blockly.blockRendering.BottomRow {
  hasLeftSquareCorner() {
    return false;
  }
  hasRightSquareCorner() {
    return false;
  }
}

class ThumbnailRenderInfo extends Blockly.thrasos.RenderInfo {
  constructor(renderer, block) {
    super(renderer, block);
    // Safe to swap here: rows are only populated later, in measure().
    this.topRow = new RoundedTopRow(this.constants_);
    this.bottomRow = new RoundedBottomRow(this.constants_);
  }

  /**
   * Blocks stacked in external inputs (e.g. the items of "create list with")
   * should sit edge to edge. Each child spans its input row plus the spacer
   * row below it, which Thrasos makes LARGE_PADDING tall. But the base class
   * sizes the row as childHeight - TAB_OFFSET_FROM_TOP - MEDIUM_PADDING, which
   * only works while those two add up to LARGE_PADDING, as Thrasos's defaults
   * happen to (5 + 5 = 10). Ours don't, because the tab sits lower, so size
   * the row from the spacer directly.
   *
   * For the first and last children to line up with the parent's top and
   * bottom edges too, the top and bottom rows (MEDIUM_PADDING each) must add
   * up to that spacer: LARGE_PADDING == 2 * MEDIUM_PADDING.
   */
  addInput_(input, activeRow) {
    super.addInput_(input, activeRow);
    const elem = activeRow.elements[activeRow.elements.length - 1];
    if (Blockly.blockRendering.Types.isExternalInput(elem)) {
      // An empty socket is sized as if a minimum-height block were in it, so
      // it has room for the socket's downward offset (see the drawer).
      const childHeight =
        elem.connectedBlockHeight || this.constants_.MIN_BLOCK_HEIGHT;
      elem.height = childHeight - this.constants_.LARGE_PADDING;
    }
  }
}

class ThumbnailDrawer extends Blockly.blockRendering.Drawer {
  /**
   * The base drawer cuts a square-cornered hole for inline inputs. Once the
   * child block has rounded corners, the hole's square corners show around
   * it, so round the hole with the same radius.
   */
  drawInlineInput_(input) {
    const {arc, point, moveTo, lineOnAxis} = Blockly.utils.svgPaths;
    const r = this.constants_.CORNER_RADIUS;
    const width = input.width - input.connectionWidth;
    const height = input.height;
    const left = input.xPos + input.connectionWidth;
    const top = input.centerline - height / 2;
    const connectionBottom = input.connectionOffsetY + input.connectionHeight;
    // Anticlockwise quarter circle to the given offset.
    const corner = (dx, dy) => arc('a', '0 0,0', r, point(dx, dy));

    this.inlinePath_ +=
      moveTo(left + r, top) +
      corner(-r, r) +
      lineOnAxis('v', input.connectionOffsetY - r) +
      input.shape.pathDown +
      lineOnAxis('v', height - connectionBottom - r) +
      corner(r, r) +
      lineOnAxis('h', width - 2 * r) +
      corner(r, -r) +
      lineOnAxis('v', -(height - 2 * r)) +
      corner(-r, -r) +
      'z';

    this.positionInlineInputConnection_(input);
  }

  /**
   * How far below the top of its row an external input's socket sits.
   *
   * The base drawer puts it at the very top of the row. The child's own tab
   * is TAB_OFFSET_FROM_TOP below its top edge, so the child starts that far
   * above the row. For the first row that should land on the parent's top
   * edge, which is TOP_ROW_MIN_HEIGHT above the row. Thrasos's defaults make
   * those equal; ours don't, so shift the socket down by the difference.
   */
  externalInputOffset() {
    return this.constants_.TAB_OFFSET_FROM_TOP - this.constants_.TOP_ROW_MIN_HEIGHT;
  }

  drawValueInput_(row) {
    const {lineOnAxis} = Blockly.utils.svgPaths;
    const input = row.getLastInput();
    const offset = this.externalInputOffset();
    this.positionExternalValueConnection_(row);

    this.outlinePath_ +=
      lineOnAxis('H', input.xPos + input.width) +
      lineOnAxis('v', offset) +
      input.shape.pathDown +
      lineOnAxis('v', row.height - offset - input.connectionHeight);
  }

  positionExternalValueConnection_(row) {
    const input = row.getLastInput();
    if (!input?.connectionModel) return;
    const x = row.xPos + row.width;
    input.connectionModel.setOffsetInBlock(
      this.info_.RTL ? -x : x,
      row.yPos + this.externalInputOffset(),
    );
  }
}

class ThumbnailRenderer extends Blockly.thrasos.Renderer {
  makeConstants_() {
    return new ThumbnailConstantProvider();
  }

  makeRenderInfo_(block) {
    return new ThumbnailRenderInfo(this, block);
  }

  makeDrawer_(block, info) {
    return new ThumbnailDrawer(block, info);
  }
}

Blockly.blockRendering.register('thumbnail', ThumbnailRenderer);

// A thin chevron instead of ▾. This is a global static, so it changes every
// dropdown on the page, whatever the renderer.
Blockly.FieldDropdown.ARROW_CHAR = '⌄';
