/**
 * Sprite Loader Utility
 * Loads and manages game sprites (Minecraft-style blocky sprites)
 */

import Phaser from 'phaser';

export class SpriteLoader {
  /**
   * Load all game sprites
   * @param scene - Phaser scene to load sprites into
   */
  public static loadSprites(scene: Phaser.Scene): void {
    // Create placeholder sprites using Phaser's graphics API
    // In production, these would be loaded from image files

    // Player sprite (placeholder)
    this.createPlaceholderSprite(scene, 'player', 32, 32, 0x3498db);

    // Creature sprites (placeholders)
    this.createPlaceholderSprite(scene, 'creature', 32, 32, 0xe74c3c);
    this.createPlaceholderSprite(scene, 'fire_creature', 32, 32, 0xe67e22);
    this.createPlaceholderSprite(scene, 'water_creature', 32, 32, 0x3498db);
    this.createPlaceholderSprite(scene, 'grass_creature', 32, 32, 0x27ae60);
    this.createPlaceholderSprite(scene, 'normal_creature', 32, 32, 0x95a5a6);

    // Tile sprites (placeholders)
    this.createPlaceholderSprite(scene, 'grass_tile', 32, 32, 0x27ae60);
    this.createPlaceholderSprite(scene, 'water_tile', 32, 32, 0x3498db);
    this.createPlaceholderSprite(scene, 'forest_tile', 32, 32, 0x229954);
    this.createPlaceholderSprite(scene, 'desert_tile', 32, 32, 0xf39c12);
    this.createPlaceholderSprite(scene, 'mountain_tile', 32, 32, 0x7f8c8d);
  }

  /**
   * Create a placeholder sprite using graphics
   * @param scene - Phaser scene
   * @param key - Sprite key
   * @param width - Sprite width
   * @param height - Sprite height
   * @param color - Fill color
   */
  private static createPlaceholderSprite(
    scene: Phaser.Scene,
    key: string,
    width: number,
    height: number,
    color: number
  ): void {
    const graphics = scene.add.graphics();
    
    // Draw blocky Minecraft-style sprite
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, width, height);
    
    // Add darker outline for blocky effect
    graphics.lineStyle(2, Phaser.Display.Color.ValueToColor(color).darken(50).color);
    graphics.strokeRect(0, 0, width, height);
    
    // Add highlight
    graphics.fillStyle(Phaser.Display.Color.ValueToColor(color).lighten(20).color);
    graphics.fillRect(2, 2, width - 4, 4);
    
    // Generate texture from graphics
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }
}
