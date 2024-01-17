import {CommonResult} from "@/d.ts/api/index.d.ts";

export declare interface ApiMenuInterface {
    listUserMenus: () => Promise<CommonResult>;
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