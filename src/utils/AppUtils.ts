import { appName, companyName, isDevelopment } from '@/global';
import i18n from '@/i18n/i18n';
import * as ElectronUtils from '@/utils/ElectronUtils';
import path from 'path';

//@ts-ignore
const t = i18n.global.t;

export const getAppDataFolder = () => {
  if (isDevelopment) {
    return path.join('./', 'dev-app-data');
  } else {
    return ElectronUtils.getAppDataFolder(companyName, appName);
  }
};
