import {createRouter, createWebHistory} from "vue-router";

import Home from "../views/Home.vue";
import Page01 from "../views/Page01.vue";

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/page01',
        component: Page01,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;