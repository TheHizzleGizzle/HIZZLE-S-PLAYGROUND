/**
 * Battle Type Definitions
 * Defines the data structure for battle state
 */

import { Creature } from './Creature';
import { Ability } from './Ability';

export interface BattleState {
  id: string;
  playerCreature: BattleCreature;
  enemyCreature: BattleCreature;
  turnOrder: string[]; // Creature IDs in turn order
  currentTurn: number;
  battleLog: BattleLogEntry[];
  status: 'active' | 'player-won' | 'player-lost' | 'fled';
  selectedAbility?: Ability;
}

export interface BattleCreature {
  creatureId: string;
  name: string;
  level: number;
  currentHp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  abilities: Ability[];
  activeBuffs: ActiveBuff[];
  activeDebuffs: ActiveDebuff[];
}

export interface ActiveBuff {
  stat: 'attack' | 'defense' | 'speed';
  amount: number;
  turnsRemaining: number;
}

export interface ActiveDebuff {
  stat: 'attack' | 'defense' | 'speed';
  amount: number;
  turnsRemaining: number;
}

export interface BattleLogEntry {
  turn: number;
  message: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'ability' | 'system';
}
