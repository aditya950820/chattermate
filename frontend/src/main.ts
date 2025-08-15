import './assets/styles/main.css'
import '@/assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import router from './router'
import { initializeFirebase } from './services/firebase'
import 'floating-vue/dist/style.css'
import FloatingVue from 'floating-vue'

/* Font Awesome imports */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

/* Add icons to the library */
library.add(fas, far, fab)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('apexchart', VueApexCharts)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(FloatingVue)

initializeFirebase()

app.mount('#app')
