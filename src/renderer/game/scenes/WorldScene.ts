/**
 * World Scene
 * Handles open-world exploration, creature encounters, map rendering
 */

import Phaser from 'phaser';
import { SpriteLoader } from '../utils/SpriteLoader';

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset;
  private worldLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'WorldScene' });
  }

  preload(): void {
    // Load sprites
    SpriteLoader.loadSprites(this);
  }

  create(): void {
    // Create simple tilemap for now (will be replaced with WorldGenerator)
    this.tilemap = this.make.tilemap({ 
      tileWidth: 32, 
      tileHeight: 32, 
      width: 40, 
      height: 40 
    });

    // Create a simple tileset (placeholder - will use actual sprites later)
    this.tileset = this.tilemap.addTilesetImage('tiles', undefined, 32, 32, 0, 0);
    
    // Create a simple layer filled with grass tiles (placeholder)
    const data: number[][] = [];
    for (let y = 0; y < 40; y++) {
      data[y] = [];
      for (let x = 0; x < 40; x++) {
        data[y][x] = 0; // Grass tile
      }
    }
    this.tilemap.putTilesAt(data, 0, 0);
    this.worldLayer = this.tilemap.createLayer(0, this.tileset, 0, 0) || this.tilemap.createBlankLayer('world', this.tileset, 0, 0, 40, 40);
    
    // Set world bounds
    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.setBounds(0, 0, 40 * 32, 40 * 32);

    // Create player sprite (placeholder)
    this.player = this.physics.add.sprite(640, 360, 'player');
    this.player.setCollideWorldBounds(true);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Camera follows player
    this.cameras.main.setBounds(0, 0, 40 * 32, 40 * 32);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);
  }

  update(): void {
    // Player movement
    const speed = 150;
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }

    // Normalize diagonal movement
    if (this.cursors.left.isDown || this.cursors.right.isDown || 
        this.cursors.up.isDown || this.cursors.down.isDown) {
      this.player.setVelocity(
        this.player.body!.velocity.x * 0.707,
        this.player.body!.velocity.y * 0.707
      );
    }

    // Random encounters (10% chance per second when moving on grass)
    if (this.player.body!.velocity.x !== 0 || this.player.body!.velocity.y !== 0) {
      if (Math.random() < 0.001) { // Very low chance per frame
        this.triggerEncounter();
      }
    }
  }

  private triggerEncounter(): void {
    // Stop player movement
    this.player.setVelocity(0);
    
    // Transition to encounter scene
    this.scene.start('EncounterScene', {
      biome: 'grassland', // Could be determined by current tile
      playerLevel: 5 // Could be calculated from player's creatures
    });
  }
}
