/**
 * Code Editor Container
 * Manages both block and text editors with synchronization
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/store';
import { setEditorMode } from '@store/slices/editorSlice';
import { BlockEditor } from './BlockEditor';
import { TextEditor } from './TextEditor';
import './CodeEditorContainer.css';

export const CodeEditorContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { editorMode } = useSelector((state: RootState) => state.editor);

  const handleModeChange = (mode: 'blocks' | 'text') => {
    dispatch(setEditorMode(mode));
  };

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <h2>Ability Code Editor</h2>
        <div className="mode-switcher">
          <button
            className={`mode-button ${editorMode === 'blocks' ? 'active' : ''}`}
            onClick={() => handleModeChange('blocks')}
          >
            Blocks
          </button>
          <button
            className={`mode-button ${editorMode === 'text' ? 'active' : ''}`}
            onClick={() => handleModeChange('text')}
          >
            Text
          </button>
        </div>
      </div>
      <div className="editor-content">
        {editorMode === 'blocks' ? <BlockEditor /> : <TextEditor />}
      </div>
    </div>
  );
};
