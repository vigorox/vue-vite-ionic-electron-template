import * as remoteMain from '@electron/remote/main';
import { app, BrowserWindow, dialog, globalShortcut, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { exec } from 'child_process';
import sudo from 'sudo-prompt';
import { appName, appTitle } from '../src/app-runtime-config.json';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isWin = process.platform === 'win32';
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

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('dist/index.html');
    registerAutoUpdate(win);
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

  if (isDevelopment == false) {
    setupFirewall();
  }
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

const setupFirewall = () => {
  if (!isWin) {
    return;
  }

  const ruleName = appName; // Firewall rule name, can contain hyphens
  const appPath = process.execPath;

  // 1. Check if the rule exists with normal privileges
  exec(
    `netsh advfirewall firewall show rule name="${ruleName}"`,
    async (err, stdout) => {
      // If rule not found
      if (err || !stdout.includes(ruleName)) {
        // 2. Show Electron native dialog to inform user
        const { response } = await dialog.showMessageBox({
          type: 'info',
          title: 'Network Configuration',
          message:
            'To ensure UDP communication (scanning gateways) works correctly, we need to add a Windows Firewall exception.',
          detail:
            'Please click "Yes" on the following system prompt to grant permission.',
          buttons: ['OK', 'Cancel'],
          defaultId: 0,
          cancelId: 1,
        });

        // Execute permission request only if user clicks OK (index 0)
        if (response === 0) {
          const options = {
            name: appTitle, // Must be alphanumeric and spaces only
          };

          const command =
            `netsh advfirewall firewall delete rule name="${ruleName}" & ` +
            `netsh advfirewall firewall add rule name="${ruleName}" dir=in action=allow program="${appPath}" enable=yes protocol=UDP profile=any`;

          sudo.exec(command, options, (sudoError, sudoStdout, sudoStderr) => {
            if (sudoError) {
              console.error('Permission declined:', sudoError);
              // Fallback: If declined, can show "Connection features limited" in UI
            } else {
              console.log('Firewall rule added successfully.');
            }
          });
        }
      } else {
        console.log('Firewall rule already exists.');
      }
    },
  );
};
