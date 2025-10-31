/**
 * Creature Type Definitions
 * Defines the data structure for creatures
 */

import { Ability } from './Ability';

export interface Creature {
  id: string;
  name: string;
  level: number;
  experience: number;
  stats: CreatureStats;
  abilities: Ability[];
  geneticCode: string[]; // Code snippets from breeding
  type: CreatureType;
  spriteKey: string;
}

export interface CreatureStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
}

export type CreatureType = 
  | 'fire' 
  | 'water' 
  | 'grass' 
  | 'electric' 
  | 'ice' 
  | 'fighting' 
  | 'poison' 
  | 'ground' 
  | 'flying' 
  | 'psychic' 
  | 'bug' 
  | 'rock' 
  | 'ghost' 
  | 'dragon' 
  | 'dark' 
  | 'steel' 
  | 'normal';

export interface CreatureTemplate {
  name: string;
  baseStats: CreatureStats;
  type: CreatureType;
  spriteKey: string;
  growthRates: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}
