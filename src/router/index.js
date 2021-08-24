import { createRouter, createWebHistory } from 'vue-router'
import AppContaine from "../components/AppContainer.vue"
import AboutViews from './about/index'
import About from "../views/About.vue"
import UsuarioViews from "./usuarios/index"

const routes = [{
        path: '/',
        name: 'Main',
        component: AppContaine,
        children: [
            AboutViews,
            UsuarioViews
        ]
    },
    {
        path: '/about2',
        name: 'About2',
        component: About,


    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router