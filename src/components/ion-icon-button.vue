<template>
  <ion-button size="small">
    <div class="ion-icon-button" >
      <ion-icon :icon="icon"></ion-icon>
      <ion-label>{{ label }}</ion-label>
    </div>
  </ion-button>
</template>
<style scoped>
.ion-icon-button {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ion-icon-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px !important;
  padding: 0px !important;
}
.ion-icon-button ion-label {
  font-size: 0.75rem;
  margin-top: 6px;
}
.ion-icon-button ion-icon {
  font-size: 1.2rem;
}
</style>
<script setup lang="ts">
import { IonButton, IonIcon, IonLabel } from '@ionic/vue';

const props = defineProps<{
  icon: string,
  label: string,
}>();

</script>
