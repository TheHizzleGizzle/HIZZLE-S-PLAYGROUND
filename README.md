# CodeCreature

A Pokemon-style creature collection and breeding game where players create creature abilities through visual block-based and text-based coding. Features open-world exploration with Minecraft-style blocky graphics.

## Features

- **Dual Code Editor**: Create abilities using visual blocks (Blockly) or text-based Python-like code (Monaco Editor)
- **Turn-Based Battles**: Strategic combat system where abilities are executed through player-written code
- **Creature Breeding**: Combine creatures to create offspring with inherited and mutated genetic code
- **Open World Exploration**: Discover creatures, resources, and coding challenges in a procedurally generated world
- **Progressive Learning**: Gentle introduction to coding concepts with gradually unlocking features

## Technology Stack

- **Electron + React + TypeScript**: Cross-platform desktop and web support
- **Phaser 3**: 2D game engine
- **Blockly**: Visual block-based code editor
- **Monaco Editor**: Text-based code editor (VS Code editor)
- **Redux Toolkit**: State management
- **Brython**: Python-like code execution (planned)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
# Start web development server
npm run dev

# Start Electron app (development)
npm run electron:dev

# Or start both together
npm start
```

### Building

```bash
# Build for production
npm run build

# Run Electron app
npm run electron
```

## Project Structure

```
src/
??? main/                    # Electron main process
??? renderer/                # Electron renderer (game UI)
?   ??? game/               # Phaser game instance
?   ?   ??? scenes/         # Game scenes (World, Battle, Menu, Breeding)
?   ?   ??? core/           # Core game systems (Creature, Ability, BattleEngine, etc.)
?   ??? editor/             # Code editor components
?   ??? ui/                 # React UI components
?   ??? store/              # Redux store
??? shared/                 # Shared utilities/types
```

## Game Systems

### Ability Creation
Players create creature abilities using either:
- **Block Editor**: Drag-and-drop visual blocks (similar to Scratch)
- **Text Editor**: Write Python-like code directly

Available API functions:
- `damage(target, amount)` - Deal damage
- `heal(target, amount)` - Heal target
- `buff(target, stat, amount, duration)` - Apply buff
- `debuff(target, stat, amount, duration)` - Apply debuff
- `get_self()` - Get current creature
- `get_enemy()` - Get enemy creature
- `get_stat(creature, stat_name)` - Get creature stat

### Battle System
Turn-based combat where abilities execute player-written code in a sandboxed environment. Code runs safely with timeout protection and restricted API access.

### Breeding System
Combine two creatures to create offspring that inherits:
- Combined stats (with variation)
- Genetic code from both parents
- Mutated abilities
- New code patterns from rare combinations

## Development Status

This project is in active development. Current implementation includes:
- ? Project structure and build configuration
- ? Basic Phaser scenes (Menu, World, Battle, Breeding)
- ? Creature and Ability data models
- ? Redux state management
- ? Dual code editor (Blockly + Monaco)
- ? Code execution sandbox
- ? Battle engine
- ? Breeding engine

## License

MIT
