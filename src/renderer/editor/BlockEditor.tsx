/**
 * Block Editor Component
 * Blockly-based visual code editor with drag-and-drop interface
 */

import React, { useEffect, useRef } from 'react';
import Blockly from 'blockly';
import { initializeBlockly, blocksToCode } from './BlocklyConfig';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { updateCodeBlocks, syncCode } from '@store/slices/editorSlice';
import './BlockEditor.css';

export const BlockEditor: React.FC = () => {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const dispatch = useDispatch();
  
  const { codeBlocks, codeText } = useSelector((state: RootState) => state.editor);

  useEffect(() => {
    if (!blocklyDiv.current || workspaceRef.current) return;

    // Initialize Blockly workspace
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: {
        kind: 'categoryToolbox',
        contents: [
          {
            kind: 'category',
            name: 'Actions',
            colour: '230',
            contents: [
              { kind: 'block', type: 'damage' },
              { kind: 'block', type: 'heal' },
              { kind: 'block', type: 'buff' }
            ]
          },
          {
            kind: 'category',
            name: 'Creatures',
            colour: '120',
            contents: [
              { kind: 'block', type: 'get_self' },
              { kind: 'block', type: 'get_enemy' },
              { kind: 'block', type: 'get_stat' }
            ]
          },
          {
            kind: 'category',
            name: 'Logic',
            colour: '210',
            contents: [
              { kind: 'block', type: 'controls_if' },
              { kind: 'block', type: 'logic_compare' }
            ]
          },
          {
            kind: 'category',
            name: 'Math',
            colour: '230',
            contents: [
              { kind: 'block', type: 'math_number' },
              { kind: 'block', type: 'math_arithmetic' },
              { kind: 'block', type: 'math_random_int' }
            ]
          }
        ]
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      trashcan: true
    });

    initializeBlockly(workspace);
    workspaceRef.current = workspace;

    // Load existing code if available
    if (codeBlocks) {
      try {
        const xml = Blockly.Xml.textToDom(codeBlocks);
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch (e) {
        console.error('Error loading blocks:', e);
      }
    }

    // Listen for changes
    workspace.addChangeListener(() => {
      const xml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(xml);
      const generatedCode = blocksToCode(xmlText);
      
      dispatch(syncCode({ blocks: xmlText, text: generatedCode }));
    });

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  // Update workspace when codeBlocks changes externally
  useEffect(() => {
    if (workspaceRef.current && codeBlocks) {
      try {
        const xml = Blockly.Xml.textToDom(codeBlocks);
        Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
      } catch (e) {
        // Ignore errors from external updates
      }
    }
  }, [codeBlocks]);

  return (
    <div className="block-editor">
      <div ref={blocklyDiv} className="blockly-workspace" />
    </div>
  );
};
