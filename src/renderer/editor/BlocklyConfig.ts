/**
 * Blockly Configuration
 * Custom block definitions and Python-like block generators
 */

import Blockly from 'blockly';

/**
 * Initialize Blockly workspace with custom blocks
 * @param workspace - Blockly workspace instance
 */
export function initializeBlockly(workspace: Blockly.Workspace): void {
  // Define custom blocks for creature abilities
  
  // Damage block
  Blockly.Blocks['damage'] = {
    init: function() {
      this.appendValueInput('TARGET')
        .setCheck(null)
        .appendField('damage');
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('amount');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('Deal damage to target');
    }
  };

  // Heal block
  Blockly.Blocks['heal'] = {
    init: function() {
      this.appendValueInput('TARGET')
        .setCheck(null)
        .appendField('heal');
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('amount');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('Heal target');
    }
  };

  // Buff block
  Blockly.Blocks['buff'] = {
    init: function() {
      this.appendValueInput('TARGET')
        .setCheck(null)
        .appendField('buff');
      this.appendValueInput('STAT')
        .setCheck('String')
        .appendField('stat');
      this.appendValueInput('AMOUNT')
        .setCheck('Number')
        .appendField('amount');
      this.appendValueInput('DURATION')
        .setCheck('Number')
        .appendField('duration');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(65);
      this.setTooltip('Apply buff to target');
    }
  };

  // Get self block
  Blockly.Blocks['get_self'] = {
    init: function() {
      this.setOutput(true, null);
      this.setColour(120);
      this.setTooltip('Get current creature');
      this.appendDummyInput()
        .appendField('get_self()');
    }
  };

  // Get enemy block
  Blockly.Blocks['get_enemy'] = {
    init: function() {
      this.setOutput(true, null);
      this.setColour(120);
      this.setTooltip('Get enemy creature');
      this.appendDummyInput()
        .appendField('get_enemy()');
    }
  };

  // Get stat block
  Blockly.Blocks['get_stat'] = {
    init: function() {
      this.appendValueInput('CREATURE')
        .setCheck(null)
        .appendField('get_stat');
      this.appendValueInput('STAT_NAME')
        .setCheck('String')
        .appendField('stat');
      this.setOutput(true, 'Number');
      this.setColour(120);
      this.setTooltip('Get creature stat value');
    }
  };

  // Generate Python-like code from blocks
  Blockly.Python['damage'] = function(block: Blockly.Block) {
    const target = Blockly.Python.valueToCode(block, 'TARGET', Blockly.Python.ORDER_NONE) || 'None';
    const amount = Blockly.Python.valueToCode(block, 'AMOUNT', Blockly.Python.ORDER_NONE) || '0';
    return `damage(${target}, ${amount})\n`;
  };

  Blockly.Python['heal'] = function(block: Blockly.Block) {
    const target = Blockly.Python.valueToCode(block, 'TARGET', Blockly.Python.ORDER_NONE) || 'None';
    const amount = Blockly.Python.valueToCode(block, 'AMOUNT', Blockly.Python.ORDER_NONE) || '0';
    return `heal(${target}, ${amount})\n`;
  };

  Blockly.Python['buff'] = function(block: Blockly.Block) {
    const target = Blockly.Python.valueToCode(block, 'TARGET', Blockly.Python.ORDER_NONE) || 'None';
    const stat = Blockly.Python.valueToCode(block, 'STAT', Blockly.Python.ORDER_NONE) || '"attack"';
    const amount = Blockly.Python.valueToCode(block, 'AMOUNT', Blockly.Python.ORDER_NONE) || '0';
    const duration = Blockly.Python.valueToCode(block, 'DURATION', Blockly.Python.ORDER_NONE) || '1';
    return `buff(${target}, ${stat}, ${amount}, ${duration})\n`;
  };

  Blockly.Python['get_self'] = function(block: Blockly.Block) {
    return ['get_self()', Blockly.Python.ORDER_FUNCTION_CALL];
  };

  Blockly.Python['get_enemy'] = function(block: Blockly.Block) {
    return ['get_enemy()', Blockly.Python.ORDER_FUNCTION_CALL];
  };

  Blockly.Python['get_stat'] = function(block: Blockly.Block) {
    const creature = Blockly.Python.valueToCode(block, 'CREATURE', Blockly.Python.ORDER_NONE) || 'None';
    const statName = Blockly.Python.valueToCode(block, 'STAT_NAME', Blockly.Python.ORDER_NONE) || '"hp"';
    return [`get_stat(${creature}, ${statName})`, Blockly.Python.ORDER_FUNCTION_CALL];
  };
}

/**
 * Convert Blockly XML to Python-like code
 * @param xml - Blockly XML string
 * @returns Python-like code string
 */
export function blocksToCode(xml: string): string {
  const workspace = new Blockly.Workspace();
  Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
  const code = Blockly.Python.workspaceToCode(workspace);
  workspace.dispose();
  return code;
}

/**
 * Convert Python-like code to Blockly XML (limited support)
 * @param code - Python-like code string
 * @returns Blockly XML string
 */
export function codeToBlocks(code: string): string {
  // This is a simplified conversion - full implementation would require AST parsing
  // For now, return empty workspace XML
  return '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';
}
