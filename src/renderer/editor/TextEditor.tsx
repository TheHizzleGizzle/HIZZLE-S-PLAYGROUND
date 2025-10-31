/**
 * Text Editor Component
 * Monaco Editor-based text code editor with Python-like syntax highlighting
 */

import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { updateCodeText, syncCode } from '@store/slices/editorSlice';
import { blocksToCode } from './BlocklyConfig';
import './TextEditor.css';

export const TextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const dispatch = useDispatch();
  
  const { codeText, codeBlocks } = useSelector((state: RootState) => state.editor);

  useEffect(() => {
    if (!editorRef.current || monacoEditorRef.current) return;

    // Configure Monaco for Python-like syntax
    monaco.languages.setMonarchTokensProvider('python', {
      tokenizer: {
        root: [
          [/\b(damage|heal|buff|debuff|get_self|get_enemy|get_stat|if|else|for|while|def|return)\b/, 'keyword'],
          [/\b(self|enemy|hp|attack|defense|speed)\b/, 'variable'],
          [/"[^"]*"/, 'string'],
          [/\d+/, 'number'],
          [/[=+\-*/]/, 'operator'],
          [/[()]/, 'delimiter']
        ]
      }
    });

    // Create editor instance
    const editor = monaco.editor.create(editorRef.current, {
      value: codeText || '# Write your ability code here\n# Example: damage(get_enemy(), 10)',
      language: 'python',
      theme: 'vs-dark',
      fontSize: 14,
      minimap: { enabled: true },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on'
    });

    monacoEditorRef.current = editor;

    // Listen for changes
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      dispatch(updateCodeText(value));
    });

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
        monacoEditorRef.current = null;
      }
    };
  }, []);

  // Update editor when codeText changes externally
  useEffect(() => {
    if (monacoEditorRef.current && codeText !== monacoEditorRef.current.getValue()) {
      monacoEditorRef.current.setValue(codeText);
    }
  }, [codeText]);

  // Sync from blocks when codeBlocks changes
  useEffect(() => {
    if (codeBlocks && monacoEditorRef.current) {
      try {
        const generatedCode = blocksToCode(codeBlocks);
        if (generatedCode !== monacoEditorRef.current.getValue()) {
          monacoEditorRef.current.setValue(generatedCode);
        }
      } catch (e) {
        console.error('Error syncing blocks to text:', e);
      }
    }
  }, [codeBlocks]);

  return (
    <div className="text-editor">
      <div ref={editorRef} className="monaco-editor-container" />
    </div>
  );
};
