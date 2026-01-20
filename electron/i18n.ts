import { app } from 'electron';

type Locale = 'en' | 'zh-TW' | 'zh-CN';

interface Translations {
  [key: string]: {
    [locale in Locale]: string;
  };
}

const translations: Translations = {
  // Firewall messages
  'firewall.title': {
    en: 'Network Configuration',
    'zh-TW': '網路設定',
    'zh-CN': '网络配置',
  },
  'firewall.message': {
    en: 'To ensure UDP communication (scanning gateways) works correctly, we need to add a Windows Firewall exception.',
    'zh-TW': '為確保 UDP 通訊（掃描閘道）正常運作，需要加入 Windows 防火牆例外。',
    'zh-CN': '为确保 UDP 通信（扫描网关）正常工作，需要添加 Windows 防火墙例外。',
  },
  'firewall.detail': {
    en: 'Please click "Yes" on the following system prompt to grant permission.',
    'zh-TW': '請在接下來的系統提示中點擊「是」以授予權限。',
    'zh-CN': '请在接下来的系统提示中点击"是"以授予权限。',
  },
  'firewall.ok': {
    en: 'OK',
    'zh-TW': '確定',
    'zh-CN': '确定',
  },
  'firewall.cancel': {
    en: 'Cancel',
    'zh-TW': '取消',
    'zh-CN': '取消',
  },
  'firewall.ruleExists': {
    en: 'Firewall rule already exists.',
    'zh-TW': '防火牆規則已存在。',
    'zh-CN': '防火墙规则已存在。',
  },
  'firewall.ruleAdded': {
    en: 'Firewall rule added successfully.',
    'zh-TW': '防火牆規則已成功加入。',
    'zh-CN': '防火墙规则添加成功。',
  },
  'firewall.permissionDeclined': {
    en: 'Permission declined:',
    'zh-TW': '權限被拒絕：',
    'zh-CN': '权限被拒绝：',
  },
  // Auto update messages
  'update.checking': {
    en: 'Checking for update...',
    'zh-TW': '正在檢查更新...',
    'zh-CN': '正在检查更新...',
  },
  'update.available': {
    en: 'Update available!',
    'zh-TW': '有可用更新！',
    'zh-CN': '有可用更新！',
  },
  'update.availableMessage': {
    en: 'A new version is available. Do you want to update now?',
    'zh-TW': '有新版本可用。您要現在更新嗎？',
    'zh-CN': '有新版本可用。您要现在更新吗？',
  },
  'update.notAvailable': {
    en: 'No update available',
    'zh-TW': '沒有可用更新',
    'zh-CN': '没有可用更新',
  },
  'update.notAvailableMessage': {
    en: 'You are running the latest version.',
    'zh-TW': '您正在使用最新版本。',
    'zh-CN': '您正在使用最新版本。',
  },
  'update.error': {
    en: 'Update error',
    'zh-TW': '更新錯誤',
    'zh-CN': '更新错误',
  },
  'update.downloading': {
    en: 'Downloading update...',
    'zh-TW': '正在下載更新...',
    'zh-CN': '正在下载更新...',
  },
  'update.downloaded': {
    en: 'Update downloaded',
    'zh-TW': '更新已下載',
    'zh-CN': '更新已下载',
  },
  'update.downloadedMessage': {
    en: 'The update has been downloaded. The application will restart to install the update.',
    'zh-TW': '更新已下載完成。應用程式將重新啟動以安裝更新。',
    'zh-CN': '更新已下载完成。应用程序将重新启动以安装更新。',
  },
  'update.yes': {
    en: 'Yes',
    'zh-TW': '是',
    'zh-CN': '是',
  },
  'update.no': {
    en: 'No',
    'zh-TW': '否',
    'zh-CN': '否',
  },
};

let currentLocale: Locale = 'en';

/**
 * Initialize i18n with system locale
 */
export function initI18n(): void {
  const systemLocale = app.getLocale();

  if (systemLocale.startsWith('zh')) {
    if (systemLocale === 'zh-TW' || systemLocale === 'zh-Hant') {
      currentLocale = 'zh-TW';
    } else {
      currentLocale = 'zh-CN';
    }
  } else {
    currentLocale = 'en';
  }

  console.log(`Electron i18n initialized with locale: ${currentLocale}`);
}

/**
 * Set current locale
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/**
 * Get current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Translate a key to current locale
 */
export function t(key: string): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  return translation[currentLocale] || translation['en'] || key;
}

/**
 * Export for use in other modules
 */
export default {
  initI18n,
  setLocale,
  getLocale,
  t,
};
