/**
 * Battle Engine
 * Handles battle system logic: turn order, ability execution, damage calculation
 */

import { BattleState, BattleCreature, BattleLogEntry } from '@shared/types/Battle';
import { Ability } from '@shared/types/Ability';
import { executeAbilityCode } from './CodeExecutor';
import { Creature } from './Creature';

export class BattleEngine {
  private battleState: BattleState;

  constructor(battleState: BattleState) {
    this.battleState = battleState;
  }

  /**
   * Calculate turn order based on speed stats
   */
  public calculateTurnOrder(): void {
    const creatures = [
      { id: this.battleState.playerCreature.creatureId, speed: this.battleState.playerCreature.speed },
      { id: this.battleState.enemyCreature.creatureId, speed: this.battleState.enemyCreature.speed }
    ];

    // Sort by speed (descending), with random tiebreaker
    creatures.sort((a, b) => {
      if (a.speed !== b.speed) {
        return b.speed - a.speed;
      }
      return Math.random() - 0.5;
    });

    this.battleState.turnOrder = creatures.map(c => c.id);
  }

  /**
   * Execute an ability in battle
   * @param ability - Ability to execute
   * @param isPlayerAbility - Whether this is the player's ability
   * @returns Updated battle state
   */
  public executeAbility(ability: Ability, isPlayerAbility: boolean): BattleState {
    const attacker = isPlayerAbility ? this.battleState.playerCreature : this.battleState.enemyCreature;
    const defender = isPlayerAbility ? this.battleState.enemyCreature : this.battleState.playerCreature;

    // Create execution context
    const context = {
      self: this.convertToBattleCreature(attacker),
      enemy: this.convertToBattleCreature(defender),
      battleState: {
        turn: this.battleState.currentTurn,
        playerTurn: isPlayerAbility
      }
    };

    // Execute ability code
    const result = executeAbilityCode(ability.codeText, context);

    // Apply damage
    if (result.damage) {
      defender.currentHp = Math.max(0, defender.currentHp - result.damage);
      this.addBattleLog({
        turn: this.battleState.currentTurn,
        message: `${attacker.name} dealt ${result.damage} damage to ${defender.name}`,
        type: 'damage'
      });
    }

    // Apply healing
    if (result.healing) {
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + result.healing);
      this.addBattleLog({
        turn: this.battleState.currentTurn,
        message: `${attacker.name} healed for ${result.healing} HP`,
        type: 'heal'
      });
    }

    // Apply buffs
    if (result.buffs) {
      result.buffs.forEach(buff => {
        attacker.activeBuffs.push({
          stat: buff.stat,
          amount: buff.amount,
          turnsRemaining: buff.duration
        });
        this.addBattleLog({
          turn: this.battleState.currentTurn,
          message: `${attacker.name} gained ${buff.stat} buff`,
          type: 'buff'
        });
      });
    }

    // Apply debuffs
    if (result.debuffs) {
      result.debuffs.forEach(debuff => {
        defender.activeDebuffs.push({
          stat: debuff.stat,
          amount: debuff.amount,
          turnsRemaining: debuff.duration
        });
        this.addBattleLog({
          turn: this.battleState.currentTurn,
          message: `${defender.name} received ${debuff.stat} debuff`,
          type: 'debuff'
        });
      });
    }

    // Add ability messages
    result.messages.forEach(msg => {
      this.addBattleLog({
        turn: this.battleState.currentTurn,
        message: msg,
        type: 'ability'
      });
    });

    // Update battle status
    this.updateBattleStatus();

    return this.battleState;
  }

  /**
   * Process end of turn (update buffs/debuffs, check win/loss)
   */
  public processEndOfTurn(): void {
    // Decrement buff/debuff durations
    this.battleState.playerCreature.activeBuffs.forEach(buff => {
      buff.turnsRemaining--;
    });
    this.battleState.playerCreature.activeDebuffs.forEach(debuff => {
      debuff.turnsRemaining--;
    });
    this.battleState.enemyCreature.activeBuffs.forEach(buff => {
      buff.turnsRemaining--;
    });
    this.battleState.enemyCreature.activeDebuffs.forEach(debuff => {
      debuff.turnsRemaining--;
    });

    // Remove expired buffs/debuffs
    this.battleState.playerCreature.activeBuffs = this.battleState.playerCreature.activeBuffs.filter(b => b.turnsRemaining > 0);
    this.battleState.playerCreature.activeDebuffs = this.battleState.playerCreature.activeDebuffs.filter(d => d.turnsRemaining > 0);
    this.battleState.enemyCreature.activeBuffs = this.battleState.enemyCreature.activeBuffs.filter(b => b.turnsRemaining > 0);
    this.battleState.enemyCreature.activeDebuffs = this.battleState.enemyCreature.activeDebuffs.filter(d => d.turnsRemaining > 0);

    this.battleState.currentTurn++;
    this.updateBattleStatus();
  }

  /**
   * Check and update battle status (win/loss)
   */
  private updateBattleStatus(): void {
    if (this.battleState.playerCreature.currentHp <= 0) {
      this.battleState.status = 'player-lost';
      this.addBattleLog({
        turn: this.battleState.currentTurn,
        message: 'You lost the battle!',
        type: 'system'
      });
    } else if (this.battleState.enemyCreature.currentHp <= 0) {
      this.battleState.status = 'player-won';
      this.addBattleLog({
        turn: this.battleState.currentTurn,
        message: 'You won the battle!',
        type: 'system'
      });
    }
  }

  /**
   * Convert Creature to BattleCreature format
   */
  private convertToBattleCreature(creature: BattleCreature): any {
    return {
      id: creature.creatureId,
      name: creature.name,
      stats: {
        hp: creature.maxHp,
        attack: creature.attack,
        defense: creature.defense,
        speed: creature.speed
      },
      currentHp: creature.currentHp,
      buffs: creature.activeBuffs.map(b => ({
        stat: b.stat,
        amount: b.amount,
        duration: b.turnsRemaining
      })),
      debuffs: creature.activeDebuffs.map(d => ({
        stat: d.stat,
        amount: d.amount,
        duration: d.turnsRemaining
      }))
    };
  }

  /**
   * Add entry to battle log
   */
  private addBattleLog(entry: BattleLogEntry): void {
    this.battleState.battleLog.push(entry);
  }

  /**
   * Get current battle state
   */
  public getBattleState(): BattleState {
    return this.battleState;
  }
}
