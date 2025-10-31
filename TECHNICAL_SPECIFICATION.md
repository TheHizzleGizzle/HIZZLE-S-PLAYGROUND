# Technical Specification: CodeCreature Game

## Project Overview
A Pokemon-style creature collection and breeding game with turn-based combat, where players create creature abilities through visual block-based and text-based coding. Features open-world exploration with Minecraft-style blocky graphics.

## Technology Stack

### Core Framework
- **Primary**: Electron + React + TypeScript (enables web + desktop)
- **Game Engine**: Phaser 3 (2D game framework)
- **Code Editor**: Blockly (visual blocks) + Monaco Editor (text editor)
- **Python Interpreter**: Brython (runs Python-like code in browser) OR Skulpt
- **State Management**: Redux Toolkit
- **Styling**: CSS Modules + Styled Components

### Build Tools
- **Bundler**: Webpack or Vite
- **Type Checker**: TypeScript
- **Package Manager**: npm/yarn

## Architecture

### High-Level Structure
```
CodeCreature/
??? src/
?   ??? main/                    # Electron main process
?   ??? renderer/                # Electron renderer (game UI)
?   ?   ??? game/                # Phaser game instance
?   ?   ??? editor/              # Code editor components
?   ?   ??? ui/                  # React UI components
?   ?   ??? store/               # Redux store
?   ??? shared/                  # Shared utilities/types
??? assets/
?   ??? sprites/                 # Creature sprites (Minecraft-style)
?   ??? tiles/                   # World tiles
?   ??? audio/                   # Sound effects/music
??? dist/                        # Build output
```

## File Structure

### Core Game Files

**src/renderer/game/scenes/WorldScene.ts**
- Purpose: Handles open-world exploration, creature encounters, map rendering
- Responsibilities: Tile map rendering, player movement, collision detection, encounter triggers

**src/renderer/game/scenes/BattleScene.ts**
- Purpose: Turn-based battle system
- Responsibilities: Battle state management, turn order, ability execution, visual feedback

**src/renderer/game/scenes/MenuScene.ts**
- Purpose: Main menu, inventory, creature collection management
- Responsibilities: Navigation, creature list display, stats viewing

**src/renderer/game/scenes/BreedingScene.ts**
- Purpose: Creature breeding interface
- Responsibilities: Parent selection, breeding logic, offspring generation with code inheritance

**src/renderer/game/core/Creature.ts**
- Purpose: Creature data model
- Properties: id, name, stats (hp, attack, defense, speed), level, abilities (array of Ability objects), geneticCode (code snippets)

**src/renderer/game/core/Ability.ts**
- Purpose: Ability data model
- Properties: id, name, code (block and text representation), parameters, executionFunction

**src/renderer/game/core/CodeExecutor.ts**
- Purpose: Executes player-written code safely
- Responsibilities: Sandbox execution, converts blocks to Python-like code, runs code in battle context, error handling

**src/renderer/game/core/BreedingEngine.ts**
- Purpose: Handles creature breeding mechanics
- Responsibilities: Genetic code combination, mutation logic, stat inheritance, ability merging

**src/renderer/game/core/BattleEngine.ts**
- Purpose: Battle system logic
- Responsibilities: Turn order calculation, ability execution, damage calculation, status effects, win/loss conditions

**src/renderer/game/core/WorldGenerator.ts**
- Purpose: Procedural world generation
- Responsibilities: Biome generation, creature spawn points, resource placement, map data structure

### Code Editor Files

**src/renderer/editor/BlockEditor.tsx**
- Purpose: Blockly-based visual code editor
- Responsibilities: Block UI, drag-and-drop interface, block-to-code conversion

**src/renderer/editor/TextEditor.tsx**
- Purpose: Monaco Editor-based text code editor
- Responsibilities: Syntax highlighting (Python-like), code validation, code-to-block conversion

**src/renderer/editor/CodeEditorContainer.tsx**
- Purpose: Container managing both editors
- Responsibilities: Mode switching (blocks/text), synchronization between editors, ability save/load

**src/renderer/editor/BlocklyConfig.ts**
- Purpose: Blockly customization configuration
- Responsibilities: Custom block definitions, Python-like block generators, available functions/APIs

**src/renderer/editor/CodeValidator.ts**
- Purpose: Validates code before execution
- Responsibilities: Syntax checking, safety validation (prevents infinite loops, file access, etc.), API whitelist checking

### UI Components

**src/renderer/ui/components/CreatureCard.tsx**
- Purpose: Displays creature information
- Properties: creature data, onClick handlers

**src/renderer/ui/components/BattleUI.tsx**
- Purpose: Battle screen UI
- Properties: battle state, ability selection, turn indicators

**src/renderer/ui/components/AbilityList.tsx**
- Purpose: Lists creature abilities
- Properties: abilities array, onEdit callback, onUse callback

**src/renderer/ui/components/TutorialOverlay.tsx**
- Purpose: Gentle introduction to coding
- Properties: tutorial step, next/prev handlers

### State Management

**src/renderer/store/slices/gameSlice.ts**
- Purpose: Game state (creatures, inventory, world position)
- State: playerCreatures, inventory, currentLocation, gameProgress

**src/renderer/store/slices/battleSlice.ts**
- Purpose: Battle state
- State: currentBattle, turnOrder, battleLog, selectedAbility

**src/renderer/store/slices/editorSlice.ts**
- Purpose: Code editor state
- State: currentAbility, editorMode (blocks/text), codeBlocks, codeText

### Shared Utilities

**src/shared/types/Creature.ts**
- Purpose: TypeScript type definitions for creatures

**src/shared/types/Ability.ts**
- Purpose: TypeScript type definitions for abilities

**src/shared/types/Battle.ts**
- Purpose: TypeScript type definitions for battle state

**src/shared/utils/safeEval.ts**
- Purpose: Safe code execution sandbox
- Responsibilities: Restricted Python-like execution environment, API exposure to player code

## Game Systems Specification

### 1. Ability Creation System

**Code Editor Features:**
- Dual mode: Blocks (Blockly) and Text (Monaco with Python-like syntax)
- Synchronization: Changes in blocks update text, changes in text update blocks
- Available APIs exposed to player code:
  - `damage(target, amount)` - Deal damage to target
  - `heal(target, amount)` - Heal target
  - `buff(target, stat, amount, duration)` - Apply buff
  - `debuff(target, stat, amount, duration)` - Apply debuff
  - `get_self()` - Get current creature
  - `get_enemy()` - Get enemy creature
  - `get_stat(creature, stat_name)` - Get creature stat
  - `random(min, max)` - Random number generation
  - `if_then_else(condition, then_block, else_block)` - Conditional logic
  - `loop(times, block)` - Loop construct

**Block Types (Initial Set):**
- Function blocks: damage, heal, buff, debuff
- Variable blocks: get_self, get_enemy, get_stat
- Control blocks: if, if-else, loop
- Math blocks: +, -, *, /, random
- Comparison blocks: <, >, ==, !=

**Code Templates (For Gentle Introduction):**
- Template 1: Simple Attack - `damage(get_enemy(), 10)`
- Template 2: Conditional Heal - `if get_stat(get_self(), "hp") < 50: heal(get_self(), 20)`
- Template 3: Buff Before Attack - `buff(get_self(), "attack", 5, 3); damage(get_enemy(), 15)`

### 2. Turn-Based Battle System

**Battle Flow:**
1. Initialize battle with player creature and wild/enemy creature
2. Calculate turn order based on speed stat
3. Player selects ability (with code preview)
4. Execute ability code in sandbox
5. Apply effects (damage, healing, buffs)
6. Update battle state
7. Check win/loss conditions
8. Repeat until battle ends

**Battle State:**
- Active creatures (player, enemy)
- Turn order queue
- Applied buffs/debuffs with durations
- Battle log for feedback

**Ability Execution:**
- Code runs in restricted sandbox
- Has access to battle context (self, enemy, stats)
- Returns execution result (damage dealt, effects applied)
- Visual feedback shows code execution step-by-step

### 3. Creature System

**Creature Properties:**
- Base stats: hp, attack, defense, speed
- Level (1-100)
- Experience points
- Abilities (array of 4 Ability objects)
- Genetic code (code snippets from breeding)
- Type/element (affects battle effectiveness)

**Stat Calculation:**
- Base stats + (level * growth_rate)
- Modified by buffs/debuffs during battle

### 4. Breeding System

**Breeding Process:**
1. Select two parent creatures
2. Calculate offspring stats (average of parents with variation)
3. Combine genetic code from both parents
4. Apply mutations (random code changes)
5. Generate new abilities from combined code
6. Create offspring creature

**Code Inheritance:**
- Each parent contributes code snippets
- Offspring gets combination of both
- Mutations introduce new code patterns
- Rare combinations unlock special abilities

**Mutation Types:**
- Parameter modification (numbers change)
- Function substitution (different functions)
- Logic structure changes (add/remove conditionals)
- New code generation (random valid code)

### 5. Open World System

**World Structure:**
- Tile-based map (isometric or top-down)
- Multiple biomes (forest, desert, water, mountain, etc.)
- Different creature types per biome
- Hidden areas requiring coded abilities to access
- NPCs with quests/challenges

**Exploration:**
- Player movement (WASD or arrow keys)
- Encounter system (random encounters in grass/water)
- Resource nodes (collect materials for breeding)
- Landmarks (save points, breeding centers, code shops)

**World Generation:**
- Procedural generation with seed
- Predefined important locations
- Spawn tables per biome

### 6. Progression System

**Tutorial Progression:**
1. Basic movement and catching
2. Introduction to code editor (blocks first)
3. First ability creation (template-based)
4. First battle using custom ability
5. Introduction to text editor
6. Breeding basics
7. Advanced coding concepts (conditionals, loops)

**Unlock System:**
- New code functions unlock with level/progress
- New areas unlock after defeating gym leaders/challenges
- Advanced editor features unlock gradually

### 7. Visual Style

**Graphics:**
- Minecraft-style: blocky, pixelated sprites
- Creature sprites: 32x32 or 64x64 pixels, blocky design
- World tiles: 16x16 or 32x32 pixel tiles
- Simple animations: frame-based sprite animation
- Color palette: vibrant but limited (Minecraft-style)

**UI Design:**
- Clean, modern interface
- Code editor takes prominent space
- Battle UI shows creatures side-by-side
- HUD shows HP bars, turn indicators

## Implementation Details

### Code Execution Sandbox

**Restrictions:**
- No file system access
- No network access
- No infinite loops (timeout protection)
- Limited recursion depth
- Whitelist of allowed functions only

**Implementation:**
- Use Brython or Skulpt for Python-like execution
- Wrap execution in try-catch with timeout
- Provide battle context as global variables
- Capture output/effects from code execution

### Block-to-Code Conversion

**Process:**
1. Blockly generates XML representation
2. Convert XML to Python-like AST
3. Generate text code from AST
4. Validate generated code
5. Sync to text editor

### Code-to-Block Conversion

**Process:**
1. Parse text code to AST
2. Map AST nodes to Blockly blocks
3. Generate Blockly XML
4. Update block editor
5. Handle unmappable code (show warning)

### Data Persistence

**Save System:**
- LocalStorage for web version
- File system (JSON) for desktop version
- Save data: creatures, inventory, world progress, created abilities

**Data Format:**
- JSON for save files
- Include version for migration support

## External Dependencies

### npm Packages:
- electron
- react
- react-dom
- phaser
- blockly
- monaco-editor
- @reduxjs/toolkit
- react-redux
- brython (or skulpt)
- typescript
- webpack (or vite)
- @types/node

## Implementation Checklist

1. Set up project structure with Electron + React + TypeScript
2. Configure build system (Webpack/Vite) for web and desktop
3. Install and configure Phaser 3 game engine
4. Create basic Phaser scene structure (WorldScene, BattleScene, MenuScene)
5. Implement Creature data model and TypeScript types
6. Implement Ability data model with code storage
7. Set up Redux store with gameSlice, battleSlice, editorSlice
8. Install and configure Blockly for visual code editor
9. Create BlockEditor component with custom block definitions
10. Install and configure Monaco Editor for text code editor
11. Create TextEditor component with Python-like syntax highlighting
12. Implement CodeEditorContainer to manage both editors and synchronization
13. Set up Brython/Skulpt for code execution sandbox
14. Implement CodeExecutor with safety restrictions and battle context
15. Create BlocklyConfig with custom blocks (damage, heal, buff, debuff, etc.)
16. Implement code validator with syntax and safety checks
17. Create tutorial system with progressive unlocks
18. Implement WorldScene with tile-based map rendering
19. Create WorldGenerator for procedural world generation
20. Implement player movement and collision detection
21. Create encounter system for wild creatures
22. Implement BattleScene with turn-based battle flow
23. Create BattleEngine for battle logic (turn order, damage calculation)
24. Implement ability execution in battle with visual feedback
25. Create BattleUI component for battle screen
26. Implement CreatureCard component for creature display
27. Create AbilityList component for ability management
28. Implement BreedingScene and BreedingEngine
29. Create code inheritance system for breeding
30. Implement mutation system for genetic code
31. Create creature catching system
32. Implement creature leveling and stat progression
33. Create inventory system
34. Implement save/load system (LocalStorage for web, file system for desktop)
35. Create sprite assets (Minecraft-style creatures, tiles, UI elements)
36. Implement sprite rendering in Phaser
37. Create sound system (optional but recommended)
38. Implement NPC system with quests/challenges
39. Create progression unlock system
40. Add polish: animations, transitions, UI feedback
41. Test code editor synchronization (blocks ? text)
42. Test battle system with various ability codes
43. Test breeding system with code inheritance
44. Optimize performance for large worlds
45. Package Electron app for distribution
46. Create web build for browser version
47. Write user documentation/tutorial in-game
48. Final testing and bug fixes
