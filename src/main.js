import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// ✅ Quasar Imports
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/en-US'

// ✅ Register individual components
import {
  QIcon,
  QInput,
  QBadge,
  QTd,
  QTable,
  QImg,
  QCard,
  QCardSection,
  QForm,
  QBtn,
  QDialog,
} from 'quasar'

// ✅ Quasar Styles
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

// ✅ Pinia store
import { createPinia } from 'pinia'

loadFonts()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Quasar, {
  plugins: { Notify },
  lang: quasarLang,
  components: {
    QIcon,
    QInput,
    QBadge,
    QTd,
    QTable,
    QImg,
    QCard,
    QCardSection,
    QForm,
    QBtn,
    QDialog,
  },
})
app.mount('#app')
