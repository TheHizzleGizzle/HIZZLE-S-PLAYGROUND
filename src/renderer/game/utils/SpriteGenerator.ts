/**
 * Sprite Generator
 * Creates Minecraft-style blocky sprites programmatically
 */

import Phaser from 'phaser';

export class SpriteGenerator {
  /**
   * Generate a Minecraft-style creature sprite
   * @param scene - Phaser scene
   * @param key - Sprite key
   * @param color - Base color
   * @param size - Sprite size (default: 32)
   */
  public static createCreatureSprite(
    scene: Phaser.Scene,
    key: string,
    color: number,
    size: number = 32
  ): void {
    const graphics = scene.add.graphics();
    
    // Base body (blocky rectangle)
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, size, size);
    
    // Darker outline for blocky effect
    const darkColor = Phaser.Display.Color.ValueToColor(color).darken(30).color;
    graphics.lineStyle(2, darkColor);
    graphics.strokeRect(0, 0, size, size);
    
    // Add highlights for 3D block effect
    const lightColor = Phaser.Display.Color.ValueToColor(color).lighten(25).color;
    
    // Top highlight (Minecraft-style)
    graphics.fillStyle(lightColor);
    graphics.fillRect(2, 2, size - 4, size / 3);
    
    // Left side highlight
    graphics.fillRect(2, 2, size / 3, size - 4);
    
    // Eyes (simple dots)
    const eyeColor = 0x000000;
    graphics.fillStyle(eyeColor);
    const eyeSize = 3;
    graphics.fillRect(size * 0.3, size * 0.4, eyeSize, eyeSize);
    graphics.fillRect(size * 0.7, size * 0.4, eyeSize, eyeSize);
    
    // Generate texture
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }

  /**
   * Generate a tile sprite (grass, water, etc.)
   * @param scene - Phaser scene
   * @param key - Sprite key
   * @param baseColor - Base tile color
   * @param patternColor - Pattern color for variation
   * @param size - Tile size (default: 32)
   */
  public static createTileSprite(
    scene: Phaser.Scene,
    key: string,
    baseColor: number,
    patternColor?: number,
    size: number = 32
  ): void {
    const graphics = scene.add.graphics();
    
    // Base tile
    graphics.fillStyle(baseColor);
    graphics.fillRect(0, 0, size, size);
    
    // Border
    const darkColor = Phaser.Display.Color.ValueToColor(baseColor).darken(20).color;
    graphics.lineStyle(1, darkColor);
    graphics.strokeRect(0, 0, size, size);
    
    // Add pattern if specified (for variety)
    if (patternColor) {
      graphics.fillStyle(patternColor);
      // Random dots pattern
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        graphics.fillRect(x, y, 2, 2);
      }
    }
    
    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }

  /**
   * Generate all game sprites
   * @param scene - Phaser scene
   */
  public static generateAllSprites(scene: Phaser.Scene): void {
    // Player sprite (blue)
    this.createCreatureSprite(scene, 'player', 0x3498db, 32);
    
    // Creature sprites by type
    this.createCreatureSprite(scene, 'fire_creature', 0xe74c3c, 32);
    this.createCreatureSprite(scene, 'water_creature', 0x3498db, 32);
    this.createCreatureSprite(scene, 'grass_creature', 0x27ae60, 32);
    this.createCreatureSprite(scene, 'normal_creature', 0x95a5a6, 32);
    this.createCreatureSprite(scene, 'electric_creature', 0xf1c40f, 32);
    this.createCreatureSprite(scene, 'ice_creature', 0x85c1e2, 32);
    this.createCreatureSprite(scene, 'creature', 0x9b59b6, 32); // Generic
    
    // Tile sprites
    this.createTileSprite(scene, 'grass_tile', 0x27ae60, 0x229954);
    this.createTileSprite(scene, 'water_tile', 0x3498db, 0x2980b9);
    this.createTileSprite(scene, 'forest_tile', 0x229954, 0x1e8449);
    this.createTileSprite(scene, 'desert_tile', 0xf39c12, 0xe67e22);
    this.createTileSprite(scene, 'mountain_tile', 0x7f8c8d, 0x5d6d7e);
    this.createTileSprite(scene, 'cave_tile', 0x34495e, 0x2c3e50);
  }
}
