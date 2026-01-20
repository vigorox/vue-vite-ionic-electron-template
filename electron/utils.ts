import { BrowserWindow, ipcMain } from 'electron';

interface HandleWindowCloseOptions {
  win: BrowserWindow;
  e: Electron.Event;
  isForceQuit: boolean;
  isConfirmingClose: boolean;
  setForceQuit: (value: boolean) => void;
  setConfirmingClose: (value: boolean) => void;
}

/**
 * Handle window close event with confirmation
 */
export const handleWindowClose = async ({
  win,
  e,
  isForceQuit,
  isConfirmingClose,
  setForceQuit,
  setConfirmingClose,
}: HandleWindowCloseOptions) => {
  if (isForceQuit == false) {
    e.preventDefault(); // Prevent default close

    if (isConfirmingClose) {
      return;
    }

    win.webContents.send('confirm-close');

    setConfirmingClose(true);

    // Wait for renderer response
    const response = await new Promise((resolve) => {
      ipcMain.once('confirm-close-response', (event, userConfirmed) => {
        resolve(userConfirmed);
      });
    });

    setConfirmingClose(false);

    if (response) {
      setForceQuit(true);
      win.close();
    }
  }
};
