/**
 * Ability Type Definitions
 * Defines the data structure for creature abilities
 */

export interface Ability {
  id: string;
  name: string;
  codeBlocks: string; // Blockly XML representation
  codeText: string; // Python-like text code
  parameters: AbilityParameters;
  executionFunction?: (context: AbilityContext) => AbilityResult;
  description: string;
}

export interface AbilityParameters {
  cost?: number; // Energy/mana cost
  cooldown?: number; // Turns before reuse
  targetType: 'self' | 'enemy' | 'both' | 'none';
}

export interface AbilityContext {
  self: BattleCreature;
  enemy: BattleCreature;
  battleState: BattleState;
}

export interface AbilityResult {
  damage?: number;
  healing?: number;
  buffs?: Buff[];
  debuffs?: Debuff[];
  messages: string[];
}

export interface BattleCreature {
  id: string;
  name: string;
  stats: CreatureStats;
  currentHp: number;
  buffs: Buff[];
  debuffs: Debuff[];
}

export interface CreatureStats {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface Buff {
  stat: 'attack' | 'defense' | 'speed';
  amount: number;
  duration: number; // Turns remaining
}

export interface Debuff {
  stat: 'attack' | 'defense' | 'speed';
  amount: number;
  duration: number; // Turns remaining
}

export interface BattleState {
  turn: number;
  playerTurn: boolean;
}
