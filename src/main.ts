import { createPinia } from 'pinia';
import { createApp } from 'vue';

import registerComponent from './plugins/registerComponent';

import App from './App.vue';
import router from './router';

import './scss/main.scss';

const pinia = createPinia();
const app = createApp(App);

registerComponent(app);

app.use(pinia);
app.use(router);

app.mount('#app');
