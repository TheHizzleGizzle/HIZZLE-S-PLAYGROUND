/**
 * Encounter Scene
 * Handles wild creature encounters and catching
 */

import Phaser from 'phaser';
import { SpriteLoader } from '../utils/SpriteLoader';
import { EncounterSystem, Encounter } from '../core/EncounterSystem';
import { store } from '../../store/store';
import { addCreature } from '../../store/slices/gameSlice';
import { startBattle } from '../../store/slices/battleSlice';

export class EncounterScene extends Phaser.Scene {
  private encounter!: Encounter;
  private catchButton!: Phaser.GameObjects.Rectangle;
  private battleButton!: Phaser.GameObjects.Rectangle;
  private catchText!: Phaser.GameObjects.Text;
  private catchBar!: Phaser.GameObjects.Graphics;
  private caughtText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'EncounterScene' });
  }

  init(data: { biome?: string; playerLevel?: number }) {
    // Generate encounter
    this.encounter = EncounterSystem.generateEncounter(
      data.biome || 'grassland',
      data.playerLevel || 5
    );
  }

  preload(): void {
    SpriteLoader.loadSprites(this);
  }

  create(): void {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0x27ae60);

    // Title
    this.add.text(640, 100, 'Wild Creature Appeared!', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Creature sprite with animation
    const creatureSprite = this.add.sprite(640, 300, this.encounter.creature.spriteKey);
    creatureSprite.setScale(4);
    creatureSprite.setAlpha(0);
    
    // Fade in and bounce animation
    this.tweens.add({
      targets: creatureSprite,
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    });
    
    this.tweens.add({
      targets: creatureSprite,
      y: 280,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 500
    });

    // Creature info
    this.add.text(640, 450, `${this.encounter.creature.name} - Level ${this.encounter.creature.level}`, {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Catch rate bar
    this.catchBar = this.add.graphics();
    this.updateCatchBar();

    // Catch button
    this.catchButton = this.add.rectangle(500, 550, 200, 60, 0x3498db)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.attemptCatch())
      .on('pointerover', () => this.catchButton.setFillStyle(0x2980b9))
      .on('pointerout', () => this.catchButton.setFillStyle(0x3498db));

    this.add.text(500, 550, 'Catch', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Battle button
    this.battleButton = this.add.rectangle(780, 550, 200, 60, 0xe74c3c)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startBattle())
      .on('pointerover', () => this.battleButton.setFillStyle(0xc0392b))
      .on('pointerout', () => this.battleButton.setFillStyle(0xe74c3c));

    this.add.text(780, 550, 'Battle', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Catch rate text
    this.catchText = this.add.text(640, 500, `Catch Rate: ${Math.round(this.encounter.catchRate)}%`, {
      fontSize: '20px',
      color: '#ecf0f1',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Back button
    const backButton = this.add.rectangle(100, 50, 120, 40, 0x34495e)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('WorldScene');
      });

    this.add.text(100, 50, 'Flee', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  private updateCatchBar(): void {
    this.catchBar.clear();
    
    const barWidth = 400;
    const barHeight = 20;
    const x = 640 - barWidth / 2;
    const y = 480;
    
    // Background
    this.catchBar.fillStyle(0x2c3e50);
    this.catchBar.fillRect(x, y, barWidth, barHeight);
    
    // Fill based on catch rate
    const fillWidth = (this.encounter.catchRate / 100) * barWidth;
    const color = this.encounter.catchRate > 70 ? 0x2ecc71 : 
                  this.encounter.catchRate > 40 ? 0xf39c12 : 0xe74c3c;
    
    this.catchBar.fillStyle(color);
    this.catchBar.fillRect(x, y, fillWidth, barHeight);
    
    // Border
    this.catchBar.lineStyle(2, 0xffffff);
    this.catchBar.strokeRect(x, y, barWidth, barHeight);
  }

  private attemptCatch(): void {
    const throwStrength = 50 + Math.random() * 30; // 50-80% strength
    const caught = EncounterSystem.attemptCatch(this.encounter, throwStrength);
    
    if (caught) {
      // Add creature to collection
      store.dispatch(addCreature(this.encounter.creature));
      
      // Show success message
      this.catchButton.setInteractive(false);
      this.battleButton.setInteractive(false);
      
      this.caughtText = this.add.text(640, 600, 'Caught!', {
        fontSize: '48px',
        color: '#2ecc71',
        fontFamily: 'Arial',
        fontWeight: 'bold'
      }).setOrigin(0.5);
      
      // Return to world after delay
      this.time.delayedCall(2000, () => {
        this.scene.start('WorldScene');
      });
    } else {
      // Show failure message
      const failText = this.add.text(640, 600, 'The creature broke free!', {
        fontSize: '32px',
        color: '#e74c3c',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: failText,
        alpha: 0,
        duration: 2000,
        onComplete: () => failText.destroy()
      });
    }
  }

  private startBattle(): void {
    // Transition to battle scene
    // Battle scene will be set up with the wild creature
    this.scene.start('BattleScene', {
      enemyCreature: this.encounter.creature
    });
  }
}
