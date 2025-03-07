import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
import 'vue-toastification/dist/index.css';

// Importation de FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

// ajoute toutes les icônes de FontAwesome à la bibliothèque
library.add(fas);

const app = createApp(App)

// Ajoute toutes les icônes de FontAwesome à l'application
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia())
app.use(router)
app.use(Toast, {
    position: "bottom-center",
    timeout: 3000,
    closeOnClick: false,
    pauseOnHover: true,
    closeButton: false,
    icon: true,
});

app.mount('#app')
