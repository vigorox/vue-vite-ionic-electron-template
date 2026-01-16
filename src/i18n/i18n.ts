import { createI18n } from 'vue-i18n';

const checkLocale = () => {
  let _locale: string = 'en';

  // 判斷 手機/瀏覽器 的語言，顯示對應的語言介面
  if (typeof localStorage.locale !== 'undefined') {
    _locale = localStorage.locale;
  } else {
    try {
      switch (window.navigator.language) {
        case 'zh-TW':
          _locale = 'cht';
          break;
        case 'zh-CN':
        case 'zh':
          _locale = 'chs';
          break;
        case 'zh-HK':
          _locale = 'cht';
          break;
        default:
          _locale = 'en';
          break;
      }
    } catch (ex) {
      console.log(ex);
      _locale = 'en';
    }
  }
  return _locale;
};

// Languages
/*
 * Do not use "import * as EnJson from './en.json'", this will skip key which include special characters.
 * For example,
 * {
 *  "Re-enter_Password": "Re-enter Password",
 * }
 * will be skipped because it contains an dash (-) character.
 */
import ChsJson from './chs.json';
import ChtJson from './cht.json';
import EnJson from './en.json';

// import { engLangJson as EnBasicJson } from 'lptr-base-ts';
// import { chtLangJson as ChtBasicJson } from 'lptr-base-ts';
// import { chsLangJson as ChsBasicJson } from 'lptr-base-ts';

const LangJson = {
  en: {
    //...EnBasicJson,
    ...EnJson,
  },
  cht: {
    //...ChtBasicJson,
    ...ChtJson,
  },
  chs: {
    //...ChsBasicJson,
    ...ChsJson,
  },
};

let locale = 'en';
locale = checkLocale();

const i18n = createI18n({
  locale: locale,
  messages: LangJson,
  legacy: false,
  fallbackLocale: 'en',
});

export default i18n;
