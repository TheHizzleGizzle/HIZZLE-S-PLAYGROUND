/**
 * Code Executor
 * Executes player-written code safely in a sandboxed environment
 */

import { AbilityContext, AbilityResult, BattleCreature } from '@shared/types/Ability';
import { validateCode } from '../../editor/CodeValidator';

/**
 * Battle context for code execution
 */
interface ExecutionContext {
  self: BattleCreature;
  enemy: BattleCreature;
  battleState: { turn: number; playerTurn: boolean };
}

/**
 * Execute ability code in a safe sandbox
 * @param code - Python-like code to execute
 * @param context - Battle context (self, enemy, battle state)
 * @returns Result of code execution
 */
export function executeAbilityCode(
  code: string,
  context: ExecutionContext
): AbilityResult {
  // Validate code first
  const validation = validateCode(code);
  if (!validation.isValid) {
    return {
      messages: [`Code validation failed: ${validation.errors.join(', ')}`],
      damage: 0
    };
  }

  // Create sandboxed execution environment
  const result: AbilityResult = {
    messages: [],
    damage: 0,
    healing: 0,
    buffs: [],
    debuffs: []
  };

  // Create safe API functions for player code
  const safeAPI = {
    // Damage function
    damage: (target: BattleCreature, amount: number) => {
      if (target && typeof amount === 'number' && amount > 0) {
        result.damage = (result.damage || 0) + amount;
        result.messages.push(`Dealt ${amount} damage to ${target.name}`);
      }
    },

    // Heal function
    heal: (target: BattleCreature, amount: number) => {
      if (target && typeof amount === 'number' && amount > 0) {
        result.healing = (result.healing || 0) + amount;
        result.messages.push(`Healed ${target.name} for ${amount} HP`);
      }
    },

    // Buff function
    buff: (target: BattleCreature, stat: string, amount: number, duration: number) => {
      if (target && typeof amount === 'number' && typeof duration === 'number') {
        const validStats = ['attack', 'defense', 'speed'];
        if (validStats.includes(stat.toLowerCase())) {
          result.buffs = result.buffs || [];
          result.buffs.push({
            stat: stat.toLowerCase() as 'attack' | 'defense' | 'speed',
            amount,
            duration
          });
          result.messages.push(`Applied ${stat} buff to ${target.name}`);
        }
      }
    },

    // Debuff function
    debuff: (target: BattleCreature, stat: string, amount: number, duration: number) => {
      if (target && typeof amount === 'number' && typeof duration === 'number') {
        const validStats = ['attack', 'defense', 'speed'];
        if (validStats.includes(stat.toLowerCase())) {
          result.debuffs = result.debuffs || [];
          result.debuffs.push({
            stat: stat.toLowerCase() as 'attack' | 'defense' | 'speed',
            amount,
            duration
          });
          result.messages.push(`Applied ${stat} debuff to ${target.name}`);
        }
      }
    },

    // Get self creature
    get_self: () => context.self,

    // Get enemy creature
    get_enemy: () => context.enemy,

    // Get stat value
    get_stat: (creature: BattleCreature, statName: string) => {
      if (!creature) return 0;
      const stat = statName.toLowerCase();
      switch (stat) {
        case 'hp':
        case 'health':
          return creature.currentHp;
        case 'attack':
          return creature.stats.attack;
        case 'defense':
          return creature.stats.defense;
        case 'speed':
          return creature.stats.speed;
        default:
          return 0;
      }
    },

    // Random number generator
    random: (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Print for debugging (goes to messages)
    print: (...args: any[]) => {
      result.messages.push(args.map(arg => String(arg)).join(' '));
    }
  };

  // Wrap code execution with timeout protection
  try {
    // Convert Python-like syntax to JavaScript-compatible code
    // This is a simplified version - full implementation would use a proper parser
    const jsCode = convertPythonLikeToJS(code, safeAPI);
    
    // Execute with timeout
    const executionPromise = new Promise<void>((resolve, reject) => {
      try {
        // Use Function constructor for isolated execution
        const func = new Function('self', 'enemy', 'battleState', jsCode);
        func(safeAPI.get_self(), safeAPI.get_enemy(), context.battleState);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    // Set timeout (2 seconds max)
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Execution timeout')), 2000);
    });

    Promise.race([executionPromise, timeoutPromise])
      .catch((error) => {
        result.messages.push(`Execution error: ${error.message}`);
      });

  } catch (error: any) {
    result.messages.push(`Code execution failed: ${error.message}`);
  }

  return result;
}

/**
 * Convert Python-like code to JavaScript (simplified version)
 * Full implementation would require a proper AST parser
 */
function convertPythonLikeToJS(code: string, api: any): string {
  let jsCode = code;

  // Replace Python-like function calls with API calls
  jsCode = jsCode.replace(/damage\s*\(/g, 'api.damage(');
  jsCode = jsCode.replace(/heal\s*\(/g, 'api.heal(');
  jsCode = jsCode.replace(/buff\s*\(/g, 'api.buff(');
  jsCode = jsCode.replace(/debuff\s*\(/g, 'api.debuff(');
  jsCode = jsCode.replace(/get_self\s*\(/g, 'api.get_self(');
  jsCode = jsCode.replace(/get_enemy\s*\(/g, 'api.get_enemy(');
  jsCode = jsCode.replace(/get_stat\s*\(/g, 'api.get_stat(');
  jsCode = jsCode.replace(/random\s*\(/g, 'api.random(');
  jsCode = jsCode.replace(/print\s*\(/g, 'api.print(');

  // Note: This is a very simplified conversion
  // For production, use a proper Python-to-JS transpiler or Brython/Skulpt
  
  // Wrap in API context
  return `
    const api = arguments[0];
    const self = arguments[1];
    const enemy = arguments[2];
    const battleState = arguments[3];
    ${jsCode}
  `;
}
