/**
 * Ability Class
 * Represents a creature ability with code representation
 */

import { Ability as AbilityType, AbilityParameters, AbilityContext, AbilityResult } from '@shared/types/Ability';

export class Ability implements AbilityType {
  public id: string;
  public name: string;
  public codeBlocks: string; // Blockly XML
  public codeText: string; // Python-like code
  public parameters: AbilityParameters;
  public executionFunction?: (context: AbilityContext) => AbilityResult;
  public description: string;

  constructor(
    name: string,
    codeBlocks: string,
    codeText: string,
    parameters: AbilityParameters,
    description: string = ''
  ) {
    this.id = `ability_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = name;
    this.codeBlocks = codeBlocks;
    this.codeText = codeText;
    this.parameters = parameters;
    this.description = description;
  }

  /**
   * Set the execution function for this ability
   * @param func - Function that executes the ability code
   */
  public setExecutionFunction(func: (context: AbilityContext) => AbilityResult): void {
    this.executionFunction = func;
  }

  /**
   * Update code representation (both blocks and text)
   * @param codeBlocks - New Blockly XML
   * @param codeText - New Python-like code
   */
  public updateCode(codeBlocks: string, codeText: string): void {
    this.codeBlocks = codeBlocks;
    this.codeText = codeText;
  }
}
