import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'virtual:windi.css'
import 'vue-connect-wallet/dist/style.css'

createApp(App).use(router).use(createPinia()).mount('#app')
