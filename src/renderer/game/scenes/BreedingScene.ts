/**
 * Breeding Scene
 * Creature breeding interface with code inheritance
 */

import Phaser from 'phaser';

export class BreedingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BreedingScene' });
  }

  create(): void {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0x8e44ad);

    // Title
    this.add.text(640, 100, 'Breeding Center', {
      fontSize: '48px',
      color: '#ecf0f1',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Placeholder text
    this.add.text(640, 360, 'Breeding system coming soon!', {
      fontSize: '32px',
      color: '#ecf0f1',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Return button
    const returnButton = this.add.rectangle(100, 50, 120, 40, 0x34495e)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('WorldScene');
      });

    this.add.text(100, 50, 'Back', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}
