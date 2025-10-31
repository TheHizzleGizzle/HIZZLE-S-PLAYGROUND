/**
 * Game Slice
 * Manages game state: creatures, inventory, world position, progress
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Creature } from '@shared/types/Creature';

interface GameState {
  playerCreatures: Creature[];
  inventory: InventoryItem[];
  currentLocation: { x: number; y: number };
  gameProgress: {
    tutorialStep: number;
    areasUnlocked: string[];
    codeFunctionsUnlocked: string[];
  };
}

interface InventoryItem {
  id: string;
  name: string;
  type: 'item' | 'resource' | 'code-fragment';
  quantity: number;
}

const initialState: GameState = {
  playerCreatures: [],
  inventory: [],
  currentLocation: { x: 0, y: 0 },
  gameProgress: {
    tutorialStep: 0,
    areasUnlocked: ['starter-area'],
    codeFunctionsUnlocked: ['damage', 'heal']
  }
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addCreature: (state, action: PayloadAction<Creature>) => {
      state.playerCreatures.push(action.payload);
    },
    removeCreature: (state, action: PayloadAction<string>) => {
      state.playerCreatures = state.playerCreatures.filter(
        c => c.id !== action.payload
      );
    },
    updateCreature: (state, action: PayloadAction<Creature>) => {
      const index = state.playerCreatures.findIndex(
        c => c.id === action.payload.id
      );
      if (index !== -1) {
        state.playerCreatures[index] = action.payload;
      }
    },
    addInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const existing = state.inventory.find(
        item => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.inventory.push(action.payload);
      }
    },
    updateLocation: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.currentLocation = action.payload;
    },
    advanceTutorial: (state) => {
      state.gameProgress.tutorialStep += 1;
    },
    unlockArea: (state, action: PayloadAction<string>) => {
      if (!state.gameProgress.areasUnlocked.includes(action.payload)) {
        state.gameProgress.areasUnlocked.push(action.payload);
      }
    },
    unlockCodeFunction: (state, action: PayloadAction<string>) => {
      if (!state.gameProgress.codeFunctionsUnlocked.includes(action.payload)) {
        state.gameProgress.codeFunctionsUnlocked.push(action.payload);
      }
    }
  }
});

export const {
  addCreature,
  removeCreature,
  updateCreature,
  addInventoryItem,
  updateLocation,
  advanceTutorial,
  unlockArea,
  unlockCodeFunction
} = gameSlice.actions;

export default gameSlice.reducer;
