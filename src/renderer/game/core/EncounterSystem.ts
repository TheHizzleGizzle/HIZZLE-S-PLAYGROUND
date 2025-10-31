/**
 * Encounter System
 * Handles wild creature encounters and catching mechanics
 */

import { Creature } from './Creature';
import { CreatureTemplate, CreatureType } from '@shared/types/Creature';
import { creatureTemplates } from '@shared/data/creatureTemplates';

export interface Encounter {
  creature: Creature;
  catchRate: number; // 0-100, percentage chance to catch
  wildLevel: number;
}

export class EncounterSystem {
  /**
   * Generate a random wild encounter
   * @param biome - Current biome type
   * @param playerLevel - Player's average creature level
   * @returns Encounter with wild creature
   */
  public static generateEncounter(
    biome: string,
    playerLevel: number = 5
  ): Encounter {
    // Determine creature type based on biome
    const creatureType = this.getCreatureTypeForBiome(biome);
    
    // Select template
    const templateKey = this.selectTemplate(creatureType);
    const template = creatureTemplates[templateKey] || creatureTemplates.normal_wild;
    
    // Generate level (around player level ?3)
    const minLevel = Math.max(1, playerLevel - 3);
    const maxLevel = playerLevel + 3;
    const wildLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    
    // Create creature
    const creature = new Creature(template, wildLevel);
    
    // Calculate catch rate (higher HP = harder to catch)
    const hpPercentage = creature.stats.currentHp / creature.stats.maxHp;
    const baseCatchRate = 50; // Base 50% catch rate
    const catchRate = Math.max(10, Math.min(90, baseCatchRate + (hpPercentage < 0.5 ? 30 : 0)));
    
    return {
      creature,
      catchRate,
      wildLevel
    };
  }

  /**
   * Attempt to catch a creature
   * @param encounter - Current encounter
   * @param throwStrength - Strength of throw (0-100, affects catch rate)
   * @returns True if caught, false otherwise
   */
  public static attemptCatch(
    encounter: Encounter,
    throwStrength: number = 50
  ): boolean {
    // Calculate final catch rate
    // Lower HP = easier to catch
    const hpPercentage = encounter.creature.stats.currentHp / encounter.creature.stats.maxHp;
    const hpModifier = (1 - hpPercentage) * 30; // Up to +30% for low HP
    
    // Throw strength modifier
    const throwModifier = (throwStrength / 100) * 20; // Up to +20% for perfect throw
    
    const finalCatchRate = Math.min(95, encounter.catchRate + hpModifier + throwModifier);
    
    // Roll for catch
    const roll = Math.random() * 100;
    return roll < finalCatchRate;
  }

  /**
   * Get creature type for biome
   */
  private static getCreatureTypeForBiome(biome: string): CreatureType {
    const biomeMap: Record<string, CreatureType> = {
      grassland: 'normal',
      forest: 'grass',
      desert: 'fire',
      water: 'water',
      mountain: 'rock',
      cave: 'dark'
    };
    
    return biomeMap[biome] || 'normal';
  }

  /**
   * Select template based on creature type
   */
  private static selectTemplate(type: CreatureType): string {
    const typeMap: Record<CreatureType, string> = {
      fire: 'fire_starter',
      water: 'water_starter',
      grass: 'grass_starter',
      normal: 'normal_wild',
      electric: 'normal_wild',
      ice: 'normal_wild',
      fighting: 'normal_wild',
      poison: 'normal_wild',
      ground: 'normal_wild',
      flying: 'normal_wild',
      psychic: 'normal_wild',
      bug: 'normal_wild',
      rock: 'normal_wild',
      ghost: 'normal_wild',
      dragon: 'normal_wild',
      dark: 'normal_wild',
      steel: 'normal_wild'
    };
    
    return typeMap[type] || 'normal_wild';
  }
}
