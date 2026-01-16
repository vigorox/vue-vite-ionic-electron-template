<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ appTitle }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="showAppVersion()">
            <ion-icon :icon="informationCircle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <ion-item :button="true" @click="goToAboutPage()">
          <ion-label>Go to About Page</ion-label>
        </ion-item>
        <ion-item :button="true" @click="showLoading()">
          <ion-label>Show Loading</ion-label>
        </ion-item>
        <ion-item
          :button="true"
          @click="
            async () => {
              const r = await WebDlgUtils.confirm($t('Are_you_sure_you_want_to_exit?'));
              console.log(r, 'r');
            }
          "
        >
          <ion-label>Confirm Exit</ion-label>
        </ion-item>
      </ion-list>
      <div class="ion-text-center ion-margin-top">
        <ion-button color="primary" @click="goToAboutPage()" class="ion-margin">
          Go To About Page
        </ion-button>
        <ion-button color="secondary" @click="showLoading()" class="ion-margin">
          Show Loading
        </ion-button>
        <ion-button
          color="tertiary"
          @click="
            async () => {
              const r = await WebDlgUtils.confirm($t('Are_you_sure_you_want_to_exit?'));
              console.log(r, 'r');
            }
          "
          class="ion-margin"
        >
          Confirm Exit
        </ion-button>
      </div>
    </ion-content>

    <!-- Footer -->

    <ion-footer>
      <ion-toolbar>
        <!-- <ion-button @click="openLanguage()">
          <ion-icon :icon="globe" />
          Language
        </ion-button>
      -->
        <!-- <ion-button size="small" @click="openLanguage()">
          <div class="ion-tab-icon-button">
            <ion-icon :icon="globe"></ion-icon>
            <ion-label>Left Icon</ion-label>
          </div>
        </ion-button> -->

        <ion-icon-button
          :icon="globe"
          label="Settings"
          @click="openLanguage()"
        ></ion-icon-button>
      </ion-toolbar>
    </ion-footer>
    <!-- <ion-footer>
      <ion-toolbar>
        <div class="footer-center">
          <ion-button fill="clear">
            <ion-icon :icon="refresh"></ion-icon>
            Button
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer> -->
  </ion-page>
</template>

<style scoped>
.footer-center {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
}

.footer-button {
  margin: 0 auto !important;
}
</style>

<script lang="ts" setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  alertController,
  IonTabs,
  IonTab,
  IonTabBar,
  IonTabButton,
} from '@ionic/vue';
import ionIconButton from '@/components/ion-icon-button.vue';
import { globe, informationCircle, language, refresh, settings } from 'ionicons/icons';
import { appTitle } from '@/global';
import * as ElectronUtils from '@/utils/ElectronUtils';
import { ipcRenderer } from 'electron';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import * as WebDlgUtils from '@/utils/WebDlgUtils';
import { ref } from 'process';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const i18n = useI18n();
const t = i18n.t;

onMounted(() => {
  // mounted
  console.log('MainPage mounted');
});

onUnmounted(() => {
  // unmounted
  console.log('MainPage unmounted');
});

const checkUpdate = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const alert = await alertController.create({
      header: 'Info',
      message: 'Check update is not supported in development mode!',
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }
  ipcRenderer.send('check-update');
};

const showAppVersion = async () => {
  let electron_app_version = null;
  try {
    try {
      electron_app_version = ElectronUtils.readPackageJson().version;
    } catch (ex) {
      console.log(ex, 'ex');
      electron_app_version = null;
    }
  } catch (ex) {
    console.log(ex, 'ex');
    electron_app_version = null;
  }
  if (electron_app_version != null) {
    const alert = await alertController.create({
      header: 'App Version',
      message: electron_app_version,
      buttons: ['OK'],
    });
    await alert.present();
  }
};
const goToAboutPage = () => {
  router.push('/aboutPage/');
};

const showLoading = async () => {
  WebDlgUtils.showPreloader({});

  setTimeout(async () => {
    await WebDlgUtils.showPreloader({
      message: '1...',
    });
  }, 2000);

  setTimeout(async () => {
    await WebDlgUtils.showPreloader({
      message: '2...',
    });
  }, 4000);

  setTimeout(async () => {
    await WebDlgUtils.hidePreloader();
  }, 6000);
};

const openLanguage = async () => {
  debugger;
  // WebDlgUtils.showActionSheet({
  //   buttons: [
  //     {
  //       text: t('English'),
  //       cssClass: 'text-color-white',
  //       handler: () => {
  //         setLocale('en');
  //       },
  //     },
  //     {
  //       text: t('Simplified_Chinese'),
  //       handler: () => {
  //         setLocale('chs');
  //       },
  //     },
  //     {
  //       text: t('Traditional_Chinese'),
  //       handler: () => {
  //         setLocale('cht');
  //       },
  //     },
  //     {
  //       text: t('Cancel'),
  //       role: 'cancel',
  //     },
  //   ],
  //   header: t('Language'),
  // });

  const r = await WebDlgUtils.alertWithRadioButtons({
    header: t('Language'),
    inputs: [
      {
        name: 'lang',
        label: t('English'),
        value: 'en',
        checked: i18n.locale.value === 'en',
      },
      {
        name: 'lang',
        label: t('Simplified_Chinese'),
        value: 'chs',
        checked: i18n.locale.value === 'chs',
      },
      {
        name: 'lang',
        label: t('Traditional_Chinese'),
        value: 'cht',
        checked: i18n.locale.value === 'cht',
      },
    ],
  });
  console.log(r, 'r');
};

const setLocale = (locale: string) => {
  localStorage.locale = locale;
  i18n.locale.value = locale;
};
</script>
