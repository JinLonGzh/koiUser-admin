import api from "@/api";
import router from "@/router/index.ts"
import {useStore} from "@/store";
import {MenuDataInterface} from "@/d.ts/api";
import Layout from "@/components/layout/index.vue";

export const generaMenu = () => {
    const store = useStore();
    api.listUserMenus().then(({data}) => {
        let menuList: Array<MenuDataInterface> = data;
        menuList.forEach(item => {
            if (item.icon != null) {
                item.icon = "iconfont " + item.icon;
            }
            if (item.type === 1) {
                item.component = Layout;
            }
            if (item.type === 3) {
                item.component = loadView(item.component);
            }
            if (item.children && item.children.length > 0) {
                item.children.forEach(route => {
                    if (route) {
                        route.icon = "iconfont " + route.icon;
                        route.component = loadView(route.component);
                    }
                });
            }
        })
        // 添加侧边栏菜单
        store.saveUserMenuList(menuList);
        // 添加菜单到路由
        // const routes: Array<RouteRecordRaw> = menuList.map((item) => {
        //     const route: RouteRecordRaw = {
        //         path: item.path,
        //         component: item.component,
        //         children: item.children?.map((childRoute) => ({
        //             path: childRoute.path,
        //             component: childRoute.component,
        //         })),
        //     };
        //
        //     return route;
        // });
        //
        // console.log(routes)
        //
        // routes.forEach((route) => {
        //     router.addRoute("/index", route);
        // });
        dealWithRoute(menuList);
    })
}

const dealWithRoute = (data: Array<MenuDataInterface>, parent = 'index') => {
    for (const item of data) {
        // 多级菜单
        if (item.children && item.children.length > 0) {
            router.addRoute(parent, {
                path: item.path,
                name: item.path.split('/')[1],
                component: Layout,
                meta: {
                    title: item.name,
                    // requiresAuth: true
                }
            })
            dealWithRoute(item.children, item.path.split('/')[1])

        } else {  // 一级菜单
            router.addRoute(parent, {
                path: item.path,
                name: item.name,
                component: item.component,
                meta: {
                    title: item.name,
                    // requiresAuth: true
                }
            });
        }
    }
};

export const loadView = (view: string) => {
    // 路由懒加载
    // return (resolve) => require([`@/views${view}`], resolve);
    return import((`../views${view}`))
};