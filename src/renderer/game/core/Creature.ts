/**
 * Creature Class
 * Represents a creature with stats, abilities, and genetic code
 */

import { Creature as CreatureType, CreatureStats, CreatureTemplate } from '@shared/types/Creature';
import { Ability } from '@shared/types/Ability';

export class Creature implements CreatureType {
  public id: string;
  public name: string;
  public level: number;
  public experience: number;
  public stats: CreatureStats;
  public abilities: Ability[];
  public geneticCode: string[];
  public type: CreatureType['type'];
  public spriteKey: string;

  constructor(template: CreatureTemplate, level: number = 1) {
    this.id = `creature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = template.name;
    this.level = level;
    this.experience = 0;
    this.type = template.type;
    this.spriteKey = template.spriteKey;
    this.geneticCode = [];
    this.abilities = [];

    // Calculate stats based on level and growth rates
    this.stats = {
      hp: Math.floor(template.baseStats.hp + (level - 1) * template.growthRates.hp),
      maxHp: Math.floor(template.baseStats.hp + (level - 1) * template.growthRates.hp),
      attack: Math.floor(template.baseStats.attack + (level - 1) * template.growthRates.attack),
      defense: Math.floor(template.baseStats.defense + (level - 1) * template.growthRates.defense),
      speed: Math.floor(template.baseStats.speed + (level - 1) * template.growthRates.speed)
    };
  }

  /**
   * Add an ability to this creature
   * @param ability - The ability to add
   */
  public addAbility(ability: Ability): void {
    if (this.abilities.length < 4) {
      this.abilities.push(ability);
    }
  }

  /**
   * Level up the creature
   */
  public levelUp(): void {
    this.level++;
    // Stats increase will be handled by template recalculation
  }

  /**
   * Add experience points
   * @param exp - Experience points to add
   */
  public addExperience(exp: number): void {
    this.experience += exp;
    const expToNextLevel = this.getExpToNextLevel();
    if (this.experience >= expToNextLevel) {
      this.levelUp();
      this.experience -= expToNextLevel;
    }
  }

  /**
   * Calculate experience needed for next level
   */
  private getExpToNextLevel(): number {
    return Math.floor(100 * Math.pow(1.5, this.level - 1));
  }

  /**
   * Add genetic code snippet from breeding
   * @param code - Code snippet to add
   */
  public addGeneticCode(code: string): void {
    this.geneticCode.push(code);
  }
}
