import { createRouter, createWebHistory } from 'vue-router'
import Bridge from '~/pages/Bridge.vue'

const routes = [
    {
        path: '/',
        component: Bridge
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
