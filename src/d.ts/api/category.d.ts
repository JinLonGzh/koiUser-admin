import {CommonResult, PageInterface} from "@/d.ts/api/index";

export declare interface CategoryInterface {
    getCategoryOption: (req: CategoryQueryInterface) => Promise<CommonResult>;
    getCategoryList: (req: CategoryPageQueryInterface) => Promise<CommonResult>;
}

interface CategoryQueryInterface {
    keywords: string | null;
}

interface CategoryPageQueryInterface extends PageInterface{
    keywords: string | null;
}

interface CategoryDataInterface {
    id: number;
    categoryName: string;
    publicArticleCount: number;
    secretArticleCount: number;
    draftArticleCount: number;
    createTime: Record<string, unknown>;
    updateTime: Record<string, unknown>;
}