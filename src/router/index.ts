import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";


const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "登录",
        component: () => import("../views/login/Login.vue")
    },
    {
        path: "",
        name: "index",
        component: () => import("../components/layout/index.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// export function resetRouter() {
//     const newRouter = createRouter();
//     router.matcher = newRouter.matcher;
// }

export default router