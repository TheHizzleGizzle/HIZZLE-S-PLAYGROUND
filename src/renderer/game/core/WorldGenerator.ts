/**
 * World Generator
 * Procedural world generation with biomes and creature spawn points
 */

export interface TileData {
  x: number;
  y: number;
  tileType: number;
  biome: BiomeType;
}

export type BiomeType = 'grassland' | 'forest' | 'desert' | 'water' | 'mountain' | 'cave';

export interface WorldData {
  width: number;
  height: number;
  tiles: TileData[][];
  spawnPoints: SpawnPoint[];
}

export interface SpawnPoint {
  x: number;
  y: number;
  creatureType: string;
  spawnRate: number;
}

export class WorldGenerator {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed || Math.floor(Math.random() * 1000000);
  }

  /**
   * Generate a new world
   * @param width - World width in tiles
   * @param height - World height in tiles
   * @returns Generated world data
   */
  public generateWorld(width: number = 100, height: number = 100): WorldData {
    const tiles: TileData[][] = [];
    const spawnPoints: SpawnPoint[] = [];

    // Simple seeded random function
    let seedValue = this.seed;
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };

    // Generate tiles
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        const noise = seededRandom();
        let biome: BiomeType = 'grassland';
        let tileType = 0; // Grass tile

        // Simple biome generation based on noise
        if (noise < 0.3) {
          biome = 'water';
          tileType = 1; // Water tile
        } else if (noise < 0.5) {
          biome = 'grassland';
          tileType = 0; // Grass tile
        } else if (noise < 0.7) {
          biome = 'forest';
          tileType = 2; // Forest tile
        } else if (noise < 0.85) {
          biome = 'desert';
          tileType = 3; // Desert tile
        } else {
          biome = 'mountain';
          tileType = 4; // Mountain tile
        }

        tiles[y][x] = {
          x,
          y,
          tileType,
          biome
        };

        // Add spawn points randomly
        if (seededRandom() < 0.01 && biome !== 'water' && biome !== 'mountain') {
          spawnPoints.push({
            x,
            y,
            creatureType: this.getCreatureTypeForBiome(biome),
            spawnRate: 0.1
          });
        }
      }
    }

    return {
      width,
      height,
      tiles,
      spawnPoints
    };
  }

  /**
   * Get creature type for biome
   */
  private getCreatureTypeForBiome(biome: BiomeType): string {
    const biomeCreatures: Record<BiomeType, string[]> = {
      grassland: ['fire', 'normal'],
      forest: ['grass', 'bug'],
      desert: ['fire', 'ground'],
      water: ['water', 'ice'],
      mountain: ['rock', 'steel'],
      cave: ['rock', 'dark']
    };

    const types = biomeCreatures[biome] || ['normal'];
    return types[Math.floor(Math.random() * types.length)];
  }
}
