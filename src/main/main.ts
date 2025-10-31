/**
 * Electron Main Process
 * Handles application lifecycle and window management
 */

import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Get the correct path for preload script
  // When packaged with asarUnpack, preload is in app.asar.unpacked
  // When not packaged, it's in __dirname
  let preloadPath: string;
  if (app.isPackaged) {
    // In production, check if unpacked first, then fallback to asar
    const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'dist', 'main', 'preload.js');
    const asarPath = path.join(__dirname, 'preload.js');
    // Try unpacked first (if asarUnpack is used), otherwise use asar path
    preloadPath = fs.existsSync(unpackedPath) ? unpackedPath : asarPath;
  } else {
    preloadPath = path.join(__dirname, 'preload.js');
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
    // In production, handle packaged and unpackaged paths
    let indexPath: string;
    if (app.isPackaged) {
      // When packaged, use app.getAppPath() which points to app.asar/dist
      indexPath = path.join(app.getAppPath(), 'index.html');
    } else {
      // In development build, __dirname is dist/main, so index.html is at ../index.html
      indexPath = path.join(__dirname, '../index.html');
    }
    console.log('Loading index.html from:', indexPath);
    mainWindow.loadFile(indexPath).catch((error) => {
      console.error('Failed to load index.html:', error);
      // Fallback: try relative path from __dirname
      const fallbackPath = path.join(__dirname, '../index.html');
      console.log('Trying fallback path:', fallbackPath);
      mainWindow.loadFile(fallbackPath).catch((err) => {
        console.error('Failed to load from fallback path:', err);
      });
    });
  }

  // Open DevTools temporarily for debugging (remove in final release)
  mainWindow.webContents.openDevTools();

  // Log errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
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
