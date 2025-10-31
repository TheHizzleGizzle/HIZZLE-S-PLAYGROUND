/**
 * Creature Templates
 * Base templates for different creature types
 */

import { CreatureTemplate } from '../types/Creature';

export const creatureTemplates: Record<string, CreatureTemplate> = {
  fire_starter: {
    name: 'Flamelet',
    baseStats: {
      hp: 50,
      maxHp: 50,
      attack: 15,
      defense: 10,
      speed: 12
    },
    type: 'fire',
    spriteKey: 'fire_creature',
    growthRates: {
      hp: 3,
      attack: 2,
      defense: 1.5,
      speed: 2
    }
  },
  water_starter: {
    name: 'Aqua',
    baseStats: {
      hp: 55,
      maxHp: 55,
      attack: 12,
      defense: 12,
      speed: 10
    },
    type: 'water',
    spriteKey: 'water_creature',
    growthRates: {
      hp: 3.5,
      attack: 1.8,
      defense: 2,
      speed: 1.5
    }
  },
  grass_starter: {
    name: 'Leafy',
    baseStats: {
      hp: 45,
      maxHp: 45,
      attack: 13,
      defense: 13,
      speed: 14
    },
    type: 'grass',
    spriteKey: 'grass_creature',
    growthRates: {
      hp: 2.5,
      attack: 2,
      defense: 2,
      speed: 2.5
    }
  },
  normal_wild: {
    name: 'Wildling',
    baseStats: {
      hp: 40,
      maxHp: 40,
      attack: 10,
      defense: 10,
      speed: 10
    },
    type: 'normal',
    spriteKey: 'normal_creature',
    growthRates: {
      hp: 2,
      attack: 1.5,
      defense: 1.5,
      speed: 1.5
    }
  }
};
