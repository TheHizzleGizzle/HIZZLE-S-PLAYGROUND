/**
 * Editor Slice
 * Manages code editor state: current ability, editor mode, code content
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ability } from '@shared/types/Ability';

interface EditorState {
  currentAbility: Ability | null;
  editorMode: 'blocks' | 'text';
  codeBlocks: string; // Blockly XML
  codeText: string; // Python-like code
  isDirty: boolean; // Has unsaved changes
}

const initialState: EditorState = {
  currentAbility: null,
  editorMode: 'blocks',
  codeBlocks: '',
  codeText: '',
  isDirty: false
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    loadAbility: (state, action: PayloadAction<Ability>) => {
      state.currentAbility = action.payload;
      state.codeBlocks = action.payload.codeBlocks;
      state.codeText = action.payload.codeText;
      state.isDirty = false;
    },
    clearEditor: (state) => {
      state.currentAbility = null;
      state.codeBlocks = '';
      state.codeText = '';
      state.isDirty = false;
    },
    setEditorMode: (state, action: PayloadAction<'blocks' | 'text'>) => {
      state.editorMode = action.payload;
    },
    updateCodeBlocks: (state, action: PayloadAction<string>) => {
      state.codeBlocks = action.payload;
      state.isDirty = true;
    },
    updateCodeText: (state, action: PayloadAction<string>) => {
      state.codeText = action.payload;
      state.isDirty = true;
    },
    syncCode: (state, action: PayloadAction<{ blocks: string; text: string }>) => {
      state.codeBlocks = action.payload.blocks;
      state.codeText = action.payload.text;
      state.isDirty = true;
    },
    markSaved: (state) => {
      state.isDirty = false;
    }
  }
});

export const {
  loadAbility,
  clearEditor,
  setEditorMode,
  updateCodeBlocks,
  updateCodeText,
  syncCode,
  markSaved
} = editorSlice.actions;

export default editorSlice.reducer;
