/**
 * Menu Scene
 * Main menu interface for navigation
 */

import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0x34495e);

    // Title
    this.add.text(640, 200, 'CodeCreature', {
      fontSize: '64px',
      color: '#ecf0f1',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Buttons
    const startButton = this.add.rectangle(640, 350, 300, 60, 0x3498db)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('WorldScene');
      });

    this.add.text(640, 350, 'Start Game', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const editorButton = this.add.rectangle(640, 450, 300, 60, 0x9b59b6)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        // Will navigate to editor when implemented
        console.log('Editor button clicked');
      });

    this.add.text(640, 450, 'Ability Editor', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}
