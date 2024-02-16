import {CommonResult} from "@/d.ts/api/index.d.ts";

export declare interface ApiMenuInterface {
    listUserMenus: () => Promise<CommonResult>;
    listMenus: (req: MenuQueryReq) => Promise<CommonResult>;
    addMenu: (req: MenuAddReq) => Promise<CommonResult>;
    updateMenu: (req: MenuUpdateReq) => Promise<CommonResult>;
    deleteMenu: (id: number) => Promise<CommonResult>;
}


export interface MenuResp {
    id: number;
    name: string;
    permission: string;
    type: number;
    orderNum: number;
    parentId: number;
    path: string;
    component: string;
    icon: string;
    status: number;
    createTime: string;
    updateTime: string;
    children: Array<MenuResp>;
}

export interface MenuQueryReq {
    keywords?: string;
}

export interface MenuAddReq {
    name: string;
    permission: string;
    type: number;
    orderNum: number;
    parentId: number | null;
    path: string;
    component: string;
    icon: string;
}

export interface MenuUpdateReq {
    id: number;
    name: string;
    permission: string;
    type: number;
    orderNum: number;
    parentId: number | null;
    path: string;
    component: string;
    icon: string;
}