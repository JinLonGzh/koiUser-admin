export declare interface CommonResult {
    code: number;
    msg: string;

    [propName: string]: any;
}

// interface PageInterface {
//     pageNo: number;
//     pageSize: number;
// }

export declare interface ApiObject extends MenuInterface,
    AdminInterface {
}

/////////////////////////////// menu ///////////////////////////////

export declare interface MenuInterface {
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

/////////////////////////////// admin ///////////////////////////////

export declare interface AdminInterface {
    login: (req: string) => Promise<CommonResult>;
    refreshToken: (req: string | null) => Promise<CommonResult>;
}