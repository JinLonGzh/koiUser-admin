import {ApiObject} from "@/d.ts/api";
import {del, get, post, put} from "@/utils/request.ts";
import {MenuInterface} from "@/d.ts/api/menu";
import {AdminInterface} from "@/d.ts/api/admin";
import {ArticleInterface} from "@/d.ts/api/article";
import {CategoryInterface} from "@/d.ts/api/category";


const menuInterface: MenuInterface = {
    listUserMenus: async () => {
        return await get("/system/menu/user");
    }
}

const adminInterface: AdminInterface = {
    login: async (req) => {
        return await post("/login", req);
    },
    refreshToken: async (req) => {
        return await post("/refreshToken", req);
    }
}

const articleInterface: ArticleInterface = {
    pageArticle: async (req) => {
        return await get("/blog/article/page", req);
    },
    updateArticleTop: async (req) => {
        return await put("/blog/article/top", req);
    },
    deleteArticle: async (id) => {
        return await del(`/blog/article/delete?id=${id}`)
    }
}

const categoryInterface: CategoryInterface = {
    getCategoryOption: async () => {
        return await get("/blog/category/option");
    }
}

const api: ApiObject = {
    ...menuInterface,
    ...adminInterface,
    ...articleInterface,
    ...categoryInterface
}

export default api;