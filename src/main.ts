import 'primeicons/primeicons.css'
import { createApp } from 'vue'
import App from './application/App.vue'
import router from './application/router'
import { setAxiosRouter } from './application/configs/axios'
import './application/assets/main.css'
import './application/assets/style.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createPinia } from 'pinia'
import { i18n } from './application/i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { installToastService } from './application/services/toastService'
import { useAuthStore } from './application/stores/auth.store'
import StyleClass from 'primevue/styleclass'
import Tooltip from 'primevue/tooltip'

import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';

import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { 
  Select, InputIcon, IconField, SelectButton, 
  RadioButton, Drawer, Skeleton, Avatar,
  Dialog, Button, InputText, Password, 
  AutoComplete, InputNumber, Carousel
} from 'primevue'

const app = createApp(App)


app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Tag', Tag)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
});

app.component('Select', Select)
app.component('InputIcon', InputIcon)
app.component('IconField', IconField)
app.component('SelectButton', SelectButton)
app.component('RadioButton', RadioButton)
app.component('Drawer', Drawer)
app.component('Skeleton', Skeleton)
app.component('Avatar', Avatar)
app.component('Dialog', Dialog)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('AutoComplete', AutoComplete)
app.component('InputNumber', InputNumber)
app.component('Carousel', Carousel)

app.directive('styleclass', StyleClass)
app.directive('tooltip', Tooltip)

app.use(ToastService);

app.component("Toast", Toast);
app.use(createPinia());
app.use(i18n);
app.use(VueQueryPlugin);

installToastService(app);
const authStore = useAuthStore();

authStore.hydrate();
app.use(router);
setAxiosRouter(router);
app.mount('#app')
