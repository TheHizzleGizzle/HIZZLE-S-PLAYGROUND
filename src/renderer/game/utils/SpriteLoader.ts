/**
 * Sprite Loader Utility
 * Loads and manages game sprites (Minecraft-style blocky sprites)
 */

import Phaser from 'phaser';
import { SpriteGenerator } from './SpriteGenerator';

export class SpriteLoader {
  /**
   * Load all game sprites
   * @param scene - Phaser scene to load sprites into
   */
  public static loadSprites(scene: Phaser.Scene): void {
    // Generate all Minecraft-style sprites
    SpriteGenerator.generateAllSprites(scene);
  }
}
