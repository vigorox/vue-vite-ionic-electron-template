import { BrowserWindow, dialog, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { t } from './i18n';

interface RegisterAutoUpdateOptions {
  win: BrowserWindow;
  onForceQuit: () => void;
}

/**
 * Register auto-updater events and handlers
 */
export const registerAutoUpdate = ({
  win,
  onForceQuit,
}: RegisterAutoUpdateOptions) => {
  const logger = require('electron-log');
  logger.transports.file.level = 'debug';
  autoUpdater.logger = logger;

  autoUpdater.autoDownload = false;

  autoUpdater.on('update-available', async (info) => {
    const r = await dialog.showMessageBox(win, {
      buttons: [t('update.yes'), t('update.no')],
      title: t('update.available'),
      message: t('update.availableMessage'),
    });

    if (r.response === 0) {
      await dialog.showMessageBox(win, {
        title: t('update.downloading'),
        message: t('update.downloading'),
      });
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-not-available', async (info) => {
    dialog.showMessageBox(win, {
      title: t('update.notAvailable'),
      message: t('update.notAvailableMessage'),
    });
  });

  autoUpdater.on('error', async (info) => {
    dialog.showMessageBox(win, {
      title: t('update.error'),
      message: t('update.notAvailableMessage'),
    });
  });

  autoUpdater.on('update-downloaded', async (info) => {
    const r = await dialog.showMessageBox(win, {
      buttons: [t('update.yes'), t('update.no')],
      title: t('update.downloaded'),
      message: t('update.downloadedMessage'),
    });

    if (r.response === 0) {
      onForceQuit();
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
