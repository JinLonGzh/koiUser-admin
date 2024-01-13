import {CommonResult} from "@/d.ts/api/index";

export declare interface CategoryInterface {
    getCategoryOption: (req: CategoryQueryInterface) => Promise<CommonResult>;
}

interface CategoryQueryInterface {
    keywords: string | null;
}