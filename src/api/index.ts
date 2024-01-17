import {ApiObject} from "@/d.ts/api";
import {del, get, post, put} from "@/utils/request.ts";
import {ApiMenuInterface} from "@/d.ts/api/menu";
import {ApiAdminInterface} from "@/d.ts/api/admin";
import {ApiArticleInterface} from "@/d.ts/api/article";
import {ApiCategoryInterface} from "@/d.ts/api/category";
import {ApiTalkInterface} from "@/d.ts/api/talk";


const apiMenuInterface: ApiMenuInterface = {
    listUserMenus: async () => {
        return await get("/system/menu/user");
    }
}

const apiAdminInterface: ApiAdminInterface = {
    login: async (req) => {
        return await post("/login", req);
    },
    refreshToken: async (req) => {
        return await post("/refreshToken", req);
    }
}

const apiArticleInterface: ApiArticleInterface = {
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

const apiCategoryInterface: ApiCategoryInterface = {
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

const apiTalkInterface: ApiTalkInterface = {
    pageTalk: async (req) => {
        return await get("/blog/talk/page", req);
    },
    addTalk: async (req) => {
        return await post("/blog/talk/add", req);
    },
    deleteTalk: async (id) => {
        return await del(`/blog/talk/delete?id=${id}`);
    },
    getTalkDetail: async (id) => {
        return await get(`/blog/talk/detail?id=${id}`);
    },
    updateTalk: async (req) => {
        return await post("/blog/talk/update", req);
    },
    updateTalkTop: async (req) => {
        return await post("/blog/talk/top", req);
    }

}


const api: ApiObject = {
    ...apiMenuInterface,
    ...apiAdminInterface,
    ...apiArticleInterface,
    ...apiCategoryInterface,
    ...apiTalkInterface
}

export default api;