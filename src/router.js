import Vue from 'vue'
import Router from 'vue-router'
import Contacts from './views/Contacts.vue'
import { auth } from './sensitivedata/firebase';
import Log from './views/Log.vue';
import Update from './views/UpdateContact.vue';

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '*',
            name: 'contacts',
            component: Contacts
        },
        {
            path: '/',
            name: 'contacts',
            component: Contacts

        },
        {
            path: '/log',
            name: 'log',
            component: Log
        },
        {
            path: '/add',
            name: 'add',
            component: () => import('./views/NewContact.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/update/:item/:itemkey',
            name: 'update',
            component: Update,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/LoginRegister.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    const currentUser = auth.currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !currentUser) {
        next('contacts');
    }
    else if (!requiresAuth && currentUser) {
        next();
    }
    else {
        next();
    }
});

export default router;
