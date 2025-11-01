/**
 * Electron Main Process
 * Handles application lifecycle and window management
 */

import { app, BrowserWindow } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Resolve preload script by checking common build and source locations
  const preloadCandidates = [
    path.join(__dirname, 'preload.js'),
    ...(process.resourcesPath ? [path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'main', 'preload.js')] : []),
    path.join(app.getAppPath(), 'dist', 'main', 'preload.js'),
    path.join(app.getAppPath(), 'src', 'main', 'preload.js')
  ];

  const preloadPath = preloadCandidates.find((candidate) => fs.existsSync(candidate));

  if (!preloadPath) {
    throw new Error('Unable to locate preload script. Ensure dist/main/preload.js is included in the build.');
  }

  // Resolve index.html by checking common build and source locations
  const indexPathCandidates = [
    path.join(__dirname, '..', 'index.html'),
    ...(process.resourcesPath ? [path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'renderer', 'index.html')] : []),
    path.join(app.getAppPath(), 'dist', 'renderer', 'index.html'),
    path.join(app.getAppPath(), 'src', 'renderer', 'index.html')
  ];

  const indexPath = indexPathCandidates.find((candidate) => fs.existsSync(candidate));

  if (!indexPath) {
    const errorMsg = 'Unable to locate index.html. Ensure dist/renderer/index.html is included in the build.';
    throw new Error(errorMsg);
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath
    },
    title: 'CodeCreature'
  });

  // Load the application
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Loading index.html from:', indexPath);
    mainWindow.loadFile(indexPath).catch((error) => {
      console.error('Failed to load index.html:', error);
    });
  }

  // Log all errors and events
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page finished loading');
    // Check if script loaded (development only)
    if (process.env.NODE_ENV !== 'production') {
      mainWindow.webContents.executeJavaScript(`
        console.log('Document ready state:', document.readyState);
        console.log('Scripts loaded:', Array.from(document.scripts).map(s => s.src));
        console.log('Root element:', document.getElementById('root') ? 'Found' : 'NOT FOUND');
      `).catch(err => console.error('Execute JS error:', err));
    }
  });

  mainWindow.webContents.on('console-message', (event, level, message) => {
    // Only forward renderer logs in development, or for warnings/errors in production
    // Level values: 0=verbose, 1=info, 2=warning, 3=error
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const isImportantLevel = level >= 2; // Warning (2) or Error (3)
    
    if (isDevelopment || isImportantLevel) {
      console.log(`[Renderer ${level}]:`, message);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
