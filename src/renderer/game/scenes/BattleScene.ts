/**
 * Battle Scene
 * Turn-based battle system with ability execution
 */

import Phaser from 'phaser';
import { SpriteLoader } from '../utils/SpriteLoader';
import { AnimationUtils } from '../utils/AnimationUtils';
import { store } from '@store/store';
import { RootState } from '@store/store';
import { BattleEngine } from '../core/BattleEngine';
import { BattleState } from '@shared/types/Battle';

export class BattleScene extends Phaser.Scene {
  private playerCreature!: Phaser.GameObjects.Sprite;
  private enemyCreature!: Phaser.GameObjects.Sprite;
  private battleEngine!: BattleEngine;
  private uiContainer!: HTMLDivElement;

  constructor() {
    super({ key: 'BattleScene' });
  }

  preload(): void {
    SpriteLoader.loadSprites(this);
  }

  create(data?: { playerCreature?: any; enemyCreature?: any }): void {
    // Background with gradient effect
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x27ae60);
    
    // Create battle state from Redux or data
    const battleState = this.createBattleState(data);
    this.battleEngine = new BattleEngine(battleState);
    this.battleEngine.calculateTurnOrder();

    // Player creature (left side)
    this.playerCreature = this.add.sprite(200, 500, 'creature');
    this.playerCreature.setScale(3);
    AnimationUtils.slideIn(this, this.playerCreature, 'left');

    // Enemy creature (right side)
    this.enemyCreature = this.add.sprite(1080, 500, 'creature');
    this.enemyCreature.setScale(3);
    this.enemyCreature.setFlipX(true);
    AnimationUtils.slideIn(this, this.enemyCreature, 'right');

    // Create React UI overlay
    this.createBattleUI();

    // Listen to Redux store for battle actions
    store.subscribe(() => {
      const state = store.getState() as RootState;
      if (state.battle.currentBattle) {
        this.updateBattleVisuals(state.battle.currentBattle);
      }
    });
  }

  private createBattleState(data?: any): BattleState {
    // Create mock battle state if needed
    // In production, this would come from Redux store
    return {
      id: 'battle_' + Date.now(),
      playerCreature: {
        creatureId: 'player_1',
        name: 'Flamelet',
        level: 5,
        currentHp: 50,
        maxHp: 50,
        attack: 15,
        defense: 10,
        speed: 12,
        abilities: [],
        activeBuffs: [],
        activeDebuffs: []
      },
      enemyCreature: {
        creatureId: 'enemy_1',
        name: 'Wildling',
        level: 5,
        currentHp: 40,
        maxHp: 40,
        attack: 10,
        defense: 10,
        speed: 10,
        abilities: [],
        activeBuffs: [],
        activeDebuffs: []
      },
      turnOrder: [],
      currentTurn: 1,
      battleLog: [],
      status: 'active'
    };
  }

  private createBattleUI(): void {
    // Mount React UI component
    const reactRoot = document.getElementById('root');
    if (reactRoot) {
      // Battle UI will be rendered by React component
      // Phaser scene runs underneath
    }
  }

  private updateBattleVisuals(battleState: BattleState): void {
    // Update HP bars visually
    // Animate damage/healing
    if (battleState.status !== 'active') {
      // Battle ended
      AnimationUtils.screenFlash(this, 0xffffff, 300);
    }
  }

  update(): void {
    // Battle logic handled by BattleEngine and Redux
  }
}
