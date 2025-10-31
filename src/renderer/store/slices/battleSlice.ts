/**
 * Battle Slice
 * Manages battle state: current battle, turn order, battle log
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BattleState } from '@shared/types/Battle';
import { Ability } from '@shared/types/Ability';

interface BattleSliceState {
  currentBattle: BattleState | null;
  selectedAbility: Ability | null;
  isPlayerTurn: boolean;
}

const initialState: BattleSliceState = {
  currentBattle: null,
  selectedAbility: null,
  isPlayerTurn: true
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    startBattle: (state, action: PayloadAction<BattleState>) => {
      state.currentBattle = action.payload;
      state.isPlayerTurn = true;
      state.selectedAbility = null;
    },
    endBattle: (state) => {
      state.currentBattle = null;
      state.selectedAbility = null;
      state.isPlayerTurn = true;
    },
    selectAbility: (state, action: PayloadAction<Ability>) => {
      state.selectedAbility = action.payload;
    },
    clearSelectedAbility: (state) => {
      state.selectedAbility = null;
    },
    setPlayerTurn: (state, action: PayloadAction<boolean>) => {
      state.isPlayerTurn = action.payload;
    },
    updateBattleState: (state, action: PayloadAction<Partial<BattleState>>) => {
      if (state.currentBattle) {
        state.currentBattle = { ...state.currentBattle, ...action.payload };
      }
    }
  }
});

export const {
  startBattle,
  endBattle,
  selectAbility,
  clearSelectedAbility,
  setPlayerTurn,
  updateBattleState
} = battleSlice.actions;

export default battleSlice.reducer;
