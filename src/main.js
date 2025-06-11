import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './plugins/i18n';
import BootstrapVueNext from 'bootstrap-vue-next';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import './assets/font-awesome-4.7.0/css/font-awesome.css'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import 'bootstrap/dist/css/bootstrap.css';

import "@/assets/css/materialdesignicons.min.css";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@/assets/scss/style.scss';
import { registerScrollSpy } from "vue3-scroll-spy";
import ScrollSpy from 'vue3-scroll-spy';
import VueScrollTo from 'vue-scrollto';
import VueParticles from 'vue-particles';
import Vue3Youtube from 'vue3-youtube';
import VueFeather from 'vue-feather';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
const options = {
    confirmButtonColor: '#41b882',
    cancelButtonColor: '#ff7674',
  };
  
// Create the Vue application
const app = createApp(App);

// Use the plugins
app.component('QuillEditor', QuillEditor)

app.use(store);
app.use(router);
app.use(VueParticles);
app.use(ToastPlugin);
app.use(BootstrapVueNext);
app.use(Vue3Youtube);
app.use(i18n); // Apply i18n
app.use(registerScrollSpy);
app.use(ScrollSpy);
app.use(VueScrollTo);
app.component(VueFeather.name, VueFeather);
app.use(VueSweetalert2, options);
// Mount the app to the DOM
app.mount('#app');
