/**
 * @type {import('electron-builder').Configuration}
 */
const appId = 'YourAppID';
const productName = 'Vue Vite Quasar Electron Template';
const companyFullName = 'Lite-Puter';
const outputPath = `release/\${version}`;
const winIconPath = 'icons/app.ico';
const macIconPath = 'icons/app.icns';
// const updateUrl = 'https://your-update-server.com/this-app-updates/';

const artifactProductName = productName.replace(/\s+/g, '-');
const exeName = productName.toLowerCase().replace(/\s+/g, '-');

module.exports = {
  productName: productName,
  appId: appId,
  asar: true,
  electronLanguages: ['en-US', 'zh-TW', 'zh-CN', 'ja', 'es'],
  directories: {
    output: outputPath,
  },
  files: ['dist/**/*', 'dist-electron/**/*'],

  win: {
    executableName: exeName,
    artifactName: `${artifactProductName}-Windows-\${version}-Setup.\${ext}`,
    icon: winIconPath,
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
  },

  mac: {
    artifactName: `${artifactProductName}-Mac-\${version}-Installer.\${ext}`,
    icon: macIconPath,
    target: ['dmg'],
  },

  linux: {
    artifactName: `${artifactProductName}-Linux-\${version}.\${ext}`,
    target: ['AppImage'],
  },

  nsis: {
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
    oneClick: false,
    perMachine: false,
  },

  // publish: {
  //   provider: 'generic',
  //   url: updateUrl,
  // },

  extraMetadata: {
    author: companyFullName,
    name: exeName,
  },
};
