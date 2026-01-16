<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Template Page</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="() => {}">
            <ion-icon :icon="informationCircle"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="ion-text-center ion-margin-top">
        <ion-button color="primary" @click="() => {}" class="ion-margin">
          Go To About Page
        </ion-button>
        <ion-button color="secondary" @click="() => {}" class="ion-margin">
          Show Loading
        </ion-button>
      </div>
    </ion-content>

    <!-- Footer -->
    <ion-footer>
      <ion-toolbar>
        <div class="ion-text-center">
          <ion-button fill="clear" size="large">
            <ion-icon :icon="refresh"></ion-icon>
            <div>Button</div>
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

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
  IonFooter
} from '@ionic/vue';
import { informationCircle, refresh } from 'ionicons/icons';
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  // mounted
  console.log('TemplatePage mounted');
});

onUnmounted(() => {
  // unmounted
  console.log('TemplatePage unmounted');
});
</script>
