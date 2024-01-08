import {AdminInterface, ApiObject, MenuInterface} from "@/d.ts/api";
import {get, post} from "@/utils/request.ts";



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

const api: ApiObject = {
    ...menuInterface,
    ...adminInterface,
}

export default api;