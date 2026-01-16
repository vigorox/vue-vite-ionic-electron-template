import { createPinia } from 'pinia';
import { createApp } from 'vue';

import router from '@/router';
import App from './App.vue';
import i18n from './i18n/i18n';

// Ionic Vue
import { IonicVue } from '@ionic/vue';

// Ionic CSS
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
// import '@ionic/vue/css/structure.css';
// import '@ionic/vue/css/typography.css';
// import '@ionic/vue/css/utilities.css';

// iOS Theme
// import '@ionic/vue/css/palettes/dark.system.css'; // Comment out for light theme

// FontAwesome 5
import '@/assets/fontawesome-5.15.3/css/brands.min.css';
import '@/assets/fontawesome-5.15.3/css/fontawesome.min.css';
import '@/assets/fontawesome-5.15.3/css/solid.min.css';

// Custom Ionic Theme
import '@/assets/css/ionic.css';

// Style
import '@/assets/css/style.css';

const app = createApp(App);

app.use(createPinia());
app.use(IonicVue, {
  mode: 'ios'
});
app.use(router);
app.use(i18n);

app.mount('#app');
