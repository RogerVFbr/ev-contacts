import Vue from 'vue'
import App from './App.vue'
import router from './router'
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;
import 'popper.js';
import 'bootstrap';
import './assets/app.scss';


import './sensitivedata/firebase'
import { rtdbPlugin } from 'vuefire'
Vue.use(rtdbPlugin);

import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfo, faEdit, faTrash, faSpinner, faMapSigns, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faInfo, faEdit, faTrash, faSpinner, faMapSigns, faPlus);
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.component('Navbar', require('./components/Navbar.vue').default);

import { auth } from './sensitivedata/firebase';


Vue.config.productionTip = false

let app;
auth.onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            render: h => h(App),

        }).$mount('#app')
    }
});


