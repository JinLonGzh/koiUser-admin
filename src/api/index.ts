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
        return await del(`/blog/article/delete?id=${id}`);
    },
    getArticleDetail: async (id) => {
        return await get(`/blog/article/detail?id=${id}`);
    },
    addArticle: async (req) => {
        return await post("/blog/article/add", req);
    },
    updateArticle: async (req) => {
        return await post("/blog/article/update", req);
    }
}

const categoryInterface: CategoryInterface = {
    getCategoryOption: async (req) => {
        return await get("/blog/category/option", req);
    },
    getCategoryList: async (req) => {
        return await get("/blog/category/page", req);
    },
    addCategory: async (req) => {
        return await post("/blog/category/add", req);
    },
    updateCategory: async (req) => {
        return await post("/blog/category/update", req);
    },
    deleteCategory: async (id) => {
        return await del(`/blog/category/delete?id=${id}`);
    }
}

const api: ApiObject = {
    ...menuInterface,
    ...adminInterface,
    ...articleInterface,
    ...categoryInterface
}

export default api;