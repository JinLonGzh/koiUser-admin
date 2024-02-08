import {CommonResult} from "@/d.ts/api/index.d.ts";

export declare interface ApiMenuInterface {
    listUserMenus: () => Promise<CommonResult>;
    listMenus: (req: MenuQueryReq) => Promise<CommonResult>;
}

export interface MenuDataInterface {
    id: number;
    name: string;
    permission: string;
    type: number;
    orderNum: number;
    parentId: number;
    path: string;
    component: any;
    icon: string;
    createTime: Record<string, unknown>;
    children: Array<MenuDataInterface>;
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