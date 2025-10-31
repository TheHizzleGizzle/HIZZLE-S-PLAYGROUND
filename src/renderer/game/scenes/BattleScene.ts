/**
 * Battle Scene
 * Turn-based battle system with ability execution
 */

import Phaser from 'phaser';
import { SpriteLoader } from '../utils/SpriteLoader';

export class BattleScene extends Phaser.Scene {
  private playerCreature!: Phaser.GameObjects.Sprite;
  private enemyCreature!: Phaser.GameObjects.Sprite;
  private battleState: 'player-turn' | 'enemy-turn' | 'executing' | 'finished' = 'player-turn';

  constructor() {
    super({ key: 'BattleScene' });
  }

  preload(): void {
    // Load sprites
    SpriteLoader.loadSprites(this);
  }

  create(data?: { playerCreature?: any; enemyCreature?: any }): void {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0x27ae60);

    // Player creature (left side)
    this.playerCreature = this.add.sprite(200, 400, 'creature');
    this.playerCreature.setScale(2);

    // Enemy creature (right side)
    this.enemyCreature = this.add.sprite(1080, 400, 'creature');
    this.enemyCreature.setScale(2);
    this.enemyCreature.setFlipX(true);

    // Battle UI placeholder
    this.add.text(640, 600, 'Battle Started!', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Return to world button (temporary)
    const returnButton = this.add.rectangle(1200, 50, 120, 40, 0xe74c3c)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('WorldScene');
      });

    this.add.text(1200, 50, 'Flee', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  update(): void {
    // Battle logic will be implemented with BattleEngine
  }
}
