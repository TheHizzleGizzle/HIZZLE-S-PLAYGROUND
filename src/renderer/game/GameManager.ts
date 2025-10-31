/**
 * Game Manager
 * Initializes and manages Phaser game instance
 */

import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';
import { BattleScene } from './scenes/BattleScene';
import { MenuScene } from './scenes/MenuScene';
import { BreedingScene } from './scenes/BreedingScene';
import { EncounterScene } from './scenes/EncounterScene';

export class GameManager {
  private game: Phaser.Game;

  constructor(container: HTMLElement) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: container,
      backgroundColor: '#2c3e50',
      scene: [MenuScene, WorldScene, BattleScene, BreedingScene, EncounterScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    this.game = new Phaser.Game(config);
  }

  public destroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  public getGame(): Phaser.Game {
    return this.game;
  }
}
