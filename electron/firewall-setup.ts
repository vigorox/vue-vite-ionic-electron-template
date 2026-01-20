import { exec } from 'child_process';
import sudo from 'sudo-prompt';
import { dialog } from 'electron';
import { promisify } from 'util';
import { t } from './i18n'; // 導入您的 i18n 翻譯函數

// 將 exec 轉換為 Promise 版本
const execAsync = promisify(exec);

/**
 * Setup Windows Firewall rule for UDP communication (Async version with i18n)
 */
export const setupFirewall = async (
  appName: string,
  appTitle: string,
  appPath: string = process.execPath,
) => {
  const isWin = process.platform === 'win32';
  if (!isWin) return;

  const ruleName = appName;

  try {
    // 1. 檢查規則是否存在
    // netsh 如果找不到規則會回傳非 0 狀態碼，觸發 catch
    const { stdout } = await execAsync(
      `netsh advfirewall firewall show rule name="${ruleName}"`,
    );

    // 有些情況 netsh 不報錯但 stdout 不包含正確名稱，做個二重檢查
    if (!stdout.includes(ruleName)) {
      throw new Error('Rule not found in stdout');
    }

    console.log(t('firewall.ruleExists'));
  } catch (err) {
    // 2. 進入這裡代表規則不存在，請求權限
    console.log('Firewall rule not found, requesting permission...');

    // 顯示 Electron 原生對話框
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: t('firewall.title'),
      message: t('firewall.message'),
      detail: t('firewall.detail'),
      buttons: [t('firewall.ok'), t('firewall.cancel')],
      defaultId: 0,
      cancelId: 1,
    });

    // 如果用戶點擊「確定」(Index 0)
    if (response === 0) {
      const options = {
        name: appTitle, // 注意：sudo-prompt 的 name 建議只使用英數字與空格
      };

      const command =
        `netsh advfirewall firewall delete rule name="${ruleName}" & ` +
        `netsh advfirewall firewall add rule name="${ruleName}" dir=in action=allow program="${appPath}" enable=yes protocol=UDP profile=any`;

      try {
        // 3. 封裝 sudo.exec 為 Promise
        await new Promise((resolve, reject) => {
          sudo.exec(command, options, (sudoError, stdout, stderr) => {
            if (sudoError) {
              reject(sudoError);
            } else {
              resolve(stdout);
            }
          });
        });

        console.log(t('firewall.ruleAdded'));
      } catch (sudoError) {
        // 用戶拒絕權限或執行出錯
        console.error(t('firewall.permissionDeclined'), sudoError);
      }
    }
  }
};
