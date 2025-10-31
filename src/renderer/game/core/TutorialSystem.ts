/**
 * Tutorial System
 * Progressive tutorial with code examples and gentle introduction
 */

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  codeExample?: string;
  codeBlocks?: string;
  completed: boolean;
  unlockNext: string[];
}

export class TutorialSystem {
  private static tutorials: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to CodeCreature!',
      description: 'Learn to code by creating abilities for your creatures. Let\'s start with the basics!',
      completed: false,
      unlockNext: ['first-code']
    },
    {
      id: 'first-code',
      title: 'Your First Ability',
      description: 'Click on the code editor. Try dragging a "damage" block and connect it to "get_enemy()" and a number.',
      codeExample: 'damage(get_enemy(), 10)',
      codeBlocks: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="damage">
    <value name="TARGET">
      <block type="get_enemy"></block>
    </value>
    <value name="AMOUNT">
      <block type="math_number">
        <field name="NUM">10</field>
      </block>
    </value>
  </block>
</xml>`,
      completed: false,
      unlockNext: ['text-editor']
    },
    {
      id: 'text-editor',
      title: 'Text Mode',
      description: 'Switch to text mode to see the code you created. You can edit it directly!',
      codeExample: 'damage(get_enemy(), 10)',
      completed: false,
      unlockNext: ['first-battle']
    },
    {
      id: 'first-battle',
      title: 'Your First Battle',
      description: 'Use your ability in battle! Select it and watch your code execute.',
      completed: false,
      unlockNext: ['conditionals']
    },
    {
      id: 'conditionals',
      title: 'Adding Logic',
      description: 'Try using an "if" block to heal yourself when HP is low: if get_stat(get_self(), "hp") < 50: heal(get_self(), 20)',
      codeExample: `if get_stat(get_self(), "hp") < 50:
    heal(get_self(), 20)
else:
    damage(get_enemy(), 15)`,
      completed: false,
      unlockNext: ['breeding']
    },
    {
      id: 'breeding',
      title: 'Breeding Creatures',
      description: 'Combine two creatures to create offspring with combined code! Their genetic code mixes together.',
      completed: false,
      unlockNext: []
    }
  ];

  /**
   * Get tutorial step by ID
   */
  public static getStep(id: string): TutorialStep | undefined {
    return this.tutorials.find(step => step.id === id);
  }

  /**
   * Get all tutorials
   */
  public static getAllTutorials(): TutorialStep[] {
    return this.tutorials;
  }

  /**
   * Mark tutorial step as completed
   */
  public static completeStep(id: string): void {
    const step = this.getStep(id);
    if (step) {
      step.completed = true;
    }
  }

  /**
   * Get next available tutorial steps
   */
  public static getAvailableSteps(): TutorialStep[] {
    return this.tutorials.filter(step => 
      !step.completed && 
      (step.unlockNext.length === 0 || 
       step.unlockNext.every(unlockId => {
         const unlockStep = this.getStep(unlockId);
         return unlockStep?.completed;
       }))
    );
  }

  /**
   * Check if a step is unlocked
   */
  public static isStepUnlocked(id: string): boolean {
    const step = this.getStep(id);
    if (!step) return false;
    
    return step.unlockNext.length === 0 || 
           step.unlockNext.every(unlockId => {
             const unlockStep = this.getStep(unlockId);
             return unlockStep?.completed;
           });
  }
}
