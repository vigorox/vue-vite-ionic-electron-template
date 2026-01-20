import { dialog } from 'electron';
import { exec } from 'child_process';
import sudo from 'sudo-prompt';
import { t } from './i18n';

/**
 * Setup Windows Firewall rule for UDP communication
 * @param appName - The name of the firewall rule
 * @param appTitle - The title to display in the permission dialog
 * @param appPath - The path to the application executable (default: process.execPath)
 */
export const setupFirewall = (
  appName: string,
  appTitle: string,
  appPath: string = process.execPath,
) => {
  const isWin = process.platform === 'win32';

  if (!isWin) {
    return;
  }

  const ruleName = appName; // Firewall rule name, can contain hyphens

  // 1. Check if the rule exists with normal privileges
  exec(
    `netsh advfirewall firewall show rule name="${ruleName}"`,
    async (err, stdout) => {
      // If rule not found
      if (err || !stdout.includes(ruleName)) {
        // 2. Show Electron native dialog to inform user
        const { response } = await dialog.showMessageBox({
          type: 'info',
          title: t('firewall.title'),
          message: t('firewall.message'),
          detail: t('firewall.detail'),
          buttons: [t('firewall.ok'), t('firewall.cancel')],
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
              console.error(t('firewall.permissionDeclined'), sudoError);
              // Fallback: If declined, can show "Connection features limited" in UI
            } else {
              console.log(t('firewall.ruleAdded'));
            }
          });
        }
      } else {
        console.log(t('firewall.ruleExists'));
      }
    },
  );
};
