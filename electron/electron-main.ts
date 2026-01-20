import * as remoteMain from '@electron/remote/main';
import { app, BrowserWindow, globalShortcut } from 'electron';
import { appName, appTitle } from '../src/app-runtime-config.json';
import { initI18n } from './i18n';
import { registerAutoUpdate } from './auto-updater';
import { setupFirewall } from './firewall-setup';
import { handleWindowClose } from './utils';

// In electron-main, process.env.NODE_ENV is undefined, so we use app.isPackaged to determine the environment
// const isDevelopment = process.env.NODE_ENV !== 'production';
const isDevelopment = !app.isPackaged;
let isForceQuit = false;
let isConfirmingClose = false;

app.whenReady().then(async () => {
  initI18n();

  if (isDevelopment == false) {
    await setupFirewall(appName, appTitle);
  }

  const win = initRemoteMain();

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('dist/index.html');
    registerAutoUpdate({
      win,
      onForceQuit: () => {
        isForceQuit = true;
      },
    });
  }

  registerEvents(win);
  registerHotkeys(win);
});

const initRemoteMain = (): BrowserWindow => {
  remoteMain.initialize();
  const win = new BrowserWindow({
    title: appTitle, // To use custom title, register "page-title-updated" and set preventDefault in it
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
  win.menuBarVisible = false;

  // Fixed the issue that the title of the window might change when router changes
  win.on('page-title-updated', (e) => {
    e.preventDefault();
  });
  return win;
};

const registerEvents = (win: BrowserWindow) => {
  win.on('close', (e) =>
    handleWindowClose({
      win,
      e,
      isForceQuit,
      isConfirmingClose,
      setForceQuit: (value) => (isForceQuit = value),
      setConfirmingClose: (value) => (isConfirmingClose = value),
    }),
  );
};

const registerHotkeys = (win: BrowserWindow) => {
  // Open devTools by hotkey
  globalShortcut.register('CmdOrCtrl+F12', () => {
    if (win.isFocused()) {
      win.webContents.toggleDevTools();
    }
  });
};
