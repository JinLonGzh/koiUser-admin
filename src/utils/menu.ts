import api from "@/api";
import router from "@/router/index.ts"
import {useStore} from "@/store";
import {MenuDataInterface} from "@/d.ts/api";

let menuLoaded = false;

export const generaMenu = async () => {
    console.log("加载菜单...");
    const store = useStore();
    if (!menuLoaded) {
        try {
            const { data } = await api.listUserMenus();
            let menuList: Array<MenuDataInterface> = data;
            menuList.forEach(item => {
                if (item.icon != null) {
                    item.icon = "iconfont " + item.icon;
                }
                if (item.children && item.children.length > 0) {
                    item.children.forEach(route => {
                        if (route) {
                            route.icon = "iconfont " + route.icon;
                        }
                    });
                }
            });
            // 添加侧边栏菜单
            store.saveUserMenuList(menuList);
            // 添加菜单到路由
            dealWithRoute(menuList);
            console.log("菜单加载完成...");
            menuLoaded = true;
        } catch (error) {
            console.error("加载菜单失败:", error);
        }
    }
};

const dealWithRoute = (data: Array<MenuDataInterface>) => {
    data.forEach((item) => {
        if (item.type === 1 && item.children && item.children.length > 0) {
            item.children.forEach((children) => {
                createRouterTemplate('Layout', children);
            })
        }
        if (item.type === 2 && !item.parentId) {
            createRouterTemplate('Layout', item);
        }
    });
}

function createRouterTemplate(parent: string, item: MenuDataInterface) {
    router.addRoute(parent,{
        path: item.path,
        name: item.name,
        component: () => import(`../views${item.component}`),
        meta: {
            title: item.name,
            requiresAuth: true,
        }
    });
}


// const dealWithRoute = (data: Array<MenuDataInterface>, parent = '') => {
//     for (const item of data) {
//         // 一级目录
//         if (item.type === 1 && item.children && item.children.length > 0) {
//             router.addRoute(parent,{
//                 path: item.path,
//                 name: item.name,
//                 component: Layout,
//                 children: [],
//                 meta: {
//                     title: item.name,
//                     requiresAuth: true
//                 }
//             });
//             dealWithRoute(item.children, item.name);
//         } else {
//             // 二级菜单
//             if (item.type === 2 && item.parentId) {
//                 router.addRoute(parent, {
//                     path: item.path,
//                     name: item.name,
//                     component: () => import(`../views${item.component}`),
//                     meta: {
//                         title: item.name,
//                         requiresAuth: true
//                     }
//                 });
//             }
//             // 一级菜单
//             if (item.type === 2 && item.parentId === null) {
//                 router.addRoute(parent, {
//                     path: item.path,
//                     // name: item.name,
//                     component: Layout,
//                     children: [
//                         {
//                             path: "/",
//                             name: item.name,
//                             component: () => import(`../views${item.component}`),
//                             meta: {
//                                 title: item.name,
//                                 requiresAuth: true
//                             }
//                         }
//                     ],
//                 });
//             }
//         }
//     }
// };

export const loadView = (view: string) => {
    // 路由懒加载
    // return (resolve) => require([`@/views${view}`], resolve);
    return () => import(`../views${view}`)
};