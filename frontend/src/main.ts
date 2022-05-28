import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import 'virtual:windi.css'
import 'vue-connect-wallet/dist/style.css'

import VueUniversalModal from 'vue-universal-modal'
import 'vue-universal-modal/dist/index.css'

createApp(App).use(router).use(createPinia()).use(VueUniversalModal, {
    teleportTarget: "#modals",
    modalComponent: "Modal"
}).mount('#app')
