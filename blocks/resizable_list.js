/**
 * @license
 * Copyright 2026 Raspberry Pi Foundation
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The mutator codelab's `resizable_list` block, ported from
 * ~/Code/testing/walkthrough-mutator-codelab (blocks/list.js,
 * mutators/list_mutator.js and the context menu items in index.js).
 *
 * The only change is using the global `Blockly` instead of ES imports, so it
 * shares the one Blockly instance that the renderer and theme register on.
 */

Blockly.common.defineBlocksWithJsonArray([
  {
    type: 'resizable_list',
    message0: 'resizable list with %1',
    args0: [{type: 'input_value', name: 'ADD0'}],
    output: null,
    style: 'list_blocks',
    mutator: 'list_mutator',
    tooltip: '',
    helpUrl: '',
  },
]);

const LIST_MUTATOR = {
  saveExtraState: function () {
    return {itemCount: this.itemCount};
  },

  loadExtraState: function (state) {
    this.itemCount = state['itemCount'];
    this.updateShape();
  },

  updateShape: function () {
    // Add new inputs.
    for (let i = 1; i < this.itemCount; i++) {
      if (!this.getInput('ADD' + i)) {
        this.appendValueInput('ADD' + i).setAriaLabelProvider(
          () => 'value ' + (i + 1),
        );
      }
    }
    // Remove deleted inputs.
    for (let i = this.itemCount; this.getInput('ADD' + i); i++) {
      this.removeInput('ADD' + i);
    }
  },

  addConnection: function () {
    this.setItemCount(this.itemCount + 1);
  },

  removeConnection: function () {
    if (this.itemCount > 1) this.setItemCount(this.itemCount - 1);
  },

  setItemCount: function (newCount) {
    // If there's no event group, start one so the whole mutation is one event.
    const existingGroup = Blockly.Events.getGroup();
    if (!existingGroup) Blockly.Events.setGroup(true);

    const oldCountState = JSON.stringify(this.saveExtraState());
    this.itemCount = newCount;
    this.updateShape();
    const newCountState = JSON.stringify(this.saveExtraState());

    if (newCountState !== oldCountState) {
      Blockly.Events.fire(
        new Blockly.Events.BlockChange(
          this,
          'mutation',
          null,
          oldCountState,
          newCountState,
        ),
      );
    }

    Blockly.Events.setGroup(existingGroup);
  },
};

Blockly.Extensions.registerMutator('list_mutator', LIST_MUTATOR, function () {
  this.itemCount = 1;
});

const isResizableList = (node) =>
  node instanceof Blockly.BlockSvg && node.type === 'resizable_list';

Blockly.ContextMenuRegistry.registry.register({
  id: 'add_item',
  displayText: 'Add Item',
  weight: 100,
  preconditionFn: (scope) =>
    isResizableList(scope.focusedNode) ? 'enabled' : 'hidden',
  callback: (scope) => scope.focusedNode.addConnection(),
});

Blockly.ContextMenuRegistry.registry.register({
  id: 'remove_item',
  displayText: 'Remove Item',
  weight: 110,
  preconditionFn: (scope) => {
    if (!isResizableList(scope.focusedNode)) return 'hidden';
    return scope.focusedNode.itemCount <= 1 ? 'disabled' : 'enabled';
  },
  callback: (scope) => scope.focusedNode.removeConnection(),
});
