/**
 * Breeding Engine
 * Handles creature breeding mechanics with genetic code combination
 */

import { Creature } from './Creature';
import { Ability } from './Ability';
import { CreatureTemplate } from '@shared/types/Creature';

export class BreedingEngine {
  /**
   * Breed two creatures to create an offspring
   * @param parent1 - First parent creature
   * @param parent2 - Second parent creature
   * @param template - Creature template for the offspring
   * @returns New offspring creature
   */
  public breedCreatures(
    parent1: Creature,
    parent2: Creature,
    template: CreatureTemplate
  ): Creature {
    // Create offspring at level 1
    const offspring = new Creature(template, 1);

    // Combine stats (average with variation)
    const statVariation = 0.1; // 10% variation
    offspring.stats.hp = Math.floor(
      (parent1.stats.hp + parent2.stats.hp) / 2 * (1 + (Math.random() - 0.5) * statVariation)
    );
    offspring.stats.maxHp = offspring.stats.hp;
    offspring.stats.attack = Math.floor(
      (parent1.stats.attack + parent2.stats.attack) / 2 * (1 + (Math.random() - 0.5) * statVariation)
    );
    offspring.stats.defense = Math.floor(
      (parent1.stats.defense + parent2.stats.defense) / 2 * (1 + (Math.random() - 0.5) * statVariation)
    );
    offspring.stats.speed = Math.floor(
      (parent1.stats.speed + parent2.stats.speed) / 2 * (1 + (Math.random() - 0.5) * statVariation)
    );

    // Combine genetic code
    this.combineGeneticCode(parent1, parent2, offspring);

    // Generate abilities from combined code
    this.generateAbilitiesFromCode(parent1, parent2, offspring);

    return offspring;
  }

  /**
   * Combine genetic code from both parents with mutations
   * @param parent1 - First parent
   * @param parent2 - Second parent
   * @param offspring - Offspring to add code to
   */
  private combineGeneticCode(
    parent1: Creature,
    parent2: Creature,
    offspring: Creature
  ): void {
    // Combine code from both parents
    const combinedCode = [
      ...parent1.geneticCode,
      ...parent2.geneticCode
    ];

    // Apply mutations
    const mutationRate = 0.2; // 20% chance of mutation per code snippet
    combinedCode.forEach(code => {
      if (Math.random() < mutationRate) {
        const mutatedCode = this.mutateCode(code);
        offspring.addGeneticCode(mutatedCode);
      } else {
        offspring.addGeneticCode(code);
      }
    });

    // Add some new random code snippets (rare)
    if (Math.random() < 0.1) {
      const newCode = this.generateRandomCode();
      offspring.addGeneticCode(newCode);
    }
  }

  /**
   * Mutate a code snippet
   * @param code - Original code
   * @returns Mutated code
   */
  private mutateCode(code: string): string {
    // Simple mutation: change numbers or function names
    let mutated = code;

    // Randomly change numbers (?20%)
    mutated = mutated.replace(/\d+/g, (match) => {
      if (Math.random() < 0.3) {
        const num = parseInt(match);
        const variation = Math.floor(num * 0.2);
        return String(num + Math.floor((Math.random() - 0.5) * variation * 2));
      }
      return match;
    });

    return mutated;
  }

  /**
   * Generate random code snippet
   * @returns Random code string
   */
  private generateRandomCode(): string {
    const functions = ['damage', 'heal', 'buff'];
    const targets = ['get_enemy()', 'get_self()'];
    const amounts = [5, 10, 15, 20];

    const func = functions[Math.floor(Math.random() * functions.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];

    return `${func}(${target}, ${amount})`;
  }

  /**
   * Generate abilities from combined genetic code
   * @param parent1 - First parent
   * @param parent2 - Second parent
   * @param offspring - Offspring to add abilities to
   */
  private generateAbilitiesFromCode(
    parent1: Creature,
    parent2: Creature,
    offspring: Creature
  ): void {
    // Combine abilities from parents
    const parentAbilities = [
      ...parent1.abilities,
      ...parent2.abilities
    ];

    // Create up to 4 abilities for offspring
    const numAbilities = Math.min(4, Math.max(1, Math.floor(Math.random() * 3) + 2));

    for (let i = 0; i < numAbilities; i++) {
      if (parentAbilities.length > 0 && Math.random() < 0.7) {
        // Inherit ability from parent (possibly mutated)
        const parentAbility = parentAbilities[Math.floor(Math.random() * parentAbilities.length)];
        const ability = this.mutateAbility(parentAbility);
        offspring.addAbility(ability);
      } else {
        // Generate new ability from genetic code
        const ability = this.createAbilityFromCode(offspring.geneticCode);
        if (ability) {
          offspring.addAbility(ability);
        }
      }
    }
  }

  /**
   * Mutate an ability
   * @param ability - Original ability
   * @returns Mutated ability
   */
  private mutateAbility(ability: Ability): Ability {
    let mutatedCode = ability.codeText;

    // Mutate code text
    mutatedCode = this.mutateCode(mutatedCode);

    return new Ability(
      ability.name + ' (Evolved)',
      ability.codeBlocks, // Keep blocks same for now
      mutatedCode,
      ability.parameters,
      ability.description
    );
  }

  /**
   * Create ability from genetic code snippets
   * @param geneticCode - Array of code snippets
   * @returns New ability or null
   */
  private createAbilityFromCode(geneticCode: string[]): Ability | null {
    if (geneticCode.length === 0) {
      return null;
    }

    // Combine code snippets
    const combinedCode = geneticCode.join('\n');

    return new Ability(
      'Inherited Ability',
      '', // Blocks will be generated from code
      combinedCode,
      {
        targetType: 'enemy',
        cost: 0
      },
      'Ability created from genetic code'
    );
  }
}
