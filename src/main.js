import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import money from 'v-money'
import i18nPlugin from './plugins/i18n/i18nPlugin'

createApp(App)
    .use(store)
    .use(router)
    .use(i18nPlugin, { locale: "br" })
    .use(money, { precision: 4 })
    .mount('#app')

router.push({ path: "about" });