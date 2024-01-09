import {RouteRecordRaw, createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {generaMenu} from "@/utils/menu.ts";


const routes: Array<RouteRecordRaw> = [
    {
        path: "/login",
        name: "登录",
        component: () => import("../views/login/Login.vue")
    },
    {
        path: "/",
        name: "Layout",
        component: () => import("../components/layout/index.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})



let status = true;

router.beforeEach(async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    if (status) {
        status = false;
        await generaMenu();
        return next(to.path);
    }
    next();
})

// export function resetRouter() {
//     const newRouter = createRouter();
//     router.matcher = newRouter.matcher;
// }

export default router