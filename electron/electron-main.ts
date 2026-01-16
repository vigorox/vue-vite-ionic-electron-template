import * as remoteMain from '@electron/remote/main';
import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
const isDevelopment = process.env.NODE_ENV !== 'production';

let isForceQuit = false;
let isConfirmingClose = false;

app.whenReady().then(() => {
  remoteMain.initialize();
  const win = new BrowserWindow({
    title: 'vue-vite-ionic-electron-template', // To use custom title, register "page-title-updated" and set preventDefault in it
    width: 1200,
    height: 700,
    minWidth: 300,
    minHeight: isDevelopment ? 300 : 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false, // Whether to throttle animations and timers when the page becomes background
      webSecurity: false,
    },
  });
  remoteMain.enable(win.webContents); // Enable remote module

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('dist/index.html');
  }

  // Fixed the issue that the title of the window might change when router changes
  win.on('page-title-updated', (e) => {
    e.preventDefault();
  });

  win.on('close', async function (e) {
    if (isForceQuit == false) {
      e.preventDefault(); // Prevent default close

      if (isConfirmingClose) {
        return;
      }

      win.webContents.send('confirm-close');

      isConfirmingClose = true;

      // Wait for renderer response
      const response = await new Promise((resolve) => {
        ipcMain.once('confirm-close-response', (event, userConfirmed) => {
          resolve(userConfirmed);
        });
      });

      isConfirmingClose = false;

      if (response) {
        isForceQuit = true;
        win.close();
      }
    }
  });

  // Hide menu bar
  win.menuBarVisible = false;

  // Open devTools by hotkey
  globalShortcut.register('CmdOrCtrl+F12', () => {
    if (win.isFocused()) {
      win.webContents.toggleDevTools();
    }
  });
});

const registerAutoUpdate = (win: BrowserWindow) => {
  const logger = require('electron-log');
  logger.transports.file.level = 'debug';
  autoUpdater.logger = logger;

  autoUpdater.autoDownload = false;

  autoUpdater.on('update-available', async (info) => {
    const r = await dialog.showMessageBox(win, {
      buttons: ['OK', 'Cancel'],
      title: ' ',
      message: `Update ${info.version} is available, do you want to download and update?`,
    });

    if (r.response === 0) {
      await dialog.showMessageBox(win, {
        title: ' ',
        message: 'New version is downloading in background',
      });
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-not-available', async (info) => {
    dialog.showMessageBox(win, {
      title: ' ',
      message: 'There is no update available',
    });
  });

  autoUpdater.on('error', async (info) => {
    dialog.showMessageBox(win, {
      title: ' ',
      message: 'There is no update available!',
    });
  });

  autoUpdater.on('update-downloaded', async (info) => {
    const r = await dialog.showMessageBox(win, {
      buttons: ['OK', 'Cancel'],
      title: ' ',
      message: `Update ${info.version} is downloaded, do you want to install and restart now?`,
    });

    if (r.response === 0) {
      isForceQuit = true;
      autoUpdater.quitAndInstall();
    }
  });

  // download-progress is never triggered
  // autoUpdater.on('download-progess', (progess) => {
  //   logger.debug('download-progress');
  //   win.webContents.send('download-progress', progess);
  // });

  ipcMain.on('check-update', () => {
    autoUpdater.checkForUpdates();
  });
};
