<template>
  <ion-app>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </ion-app>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.5;
}
</style>

<script lang="ts" setup>
import { IonApp } from '@ionic/vue';
import * as ElectronUtils from '@/utils/ElectronUtils';
import * as WebDlgUtils from '@/utils/WebDlgUtils';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const t = useI18n().t;

onMounted(async () => {
  // mounted
  ElectronUtils.forceDeviceScaleFactorToOneOnWin32();
  ElectronUtils.setZoomFactor(1);

  const { ipcRenderer } = require('electron');

  ipcRenderer.on('confirm-close', async () => {
    await WebDlgUtils.hidePreloader();
    const userConfirmed = await WebDlgUtils.confirm(t('Are_you_sure_you_want_to_exit?')); // Implement this function

    // Send response back to main
    ipcRenderer.send('confirm-close-response', userConfirmed);
  });
});
</script>
