/**
 * Electron Preload Script
 * Provides secure bridge between renderer and main process
 */

import { contextBridge } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any IPC methods here if needed in the future
});
