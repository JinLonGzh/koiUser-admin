import {CommonResult, PageInterface} from "@/d.ts/api/index";

export declare interface ApiCategoryInterface {
    getCategoryOption: (req: CategoryQueryInterface) => Promise<CommonResult>;
    getCategoryList: (req: CategoryPageQueryInterface) => Promise<CommonResult>;
    addCategory: (req: CategoryAddInterface)=> Promise<CommonResult>;
    updateCategory: (req: CategoryUpdateInterface)=> Promise<CommonResult>;
    deleteCategory: (id: number)=> Promise<CommonResult>;
}

interface CategoryQueryInterface {
    keywords: string | null;
}

interface CategoryPageQueryInterface extends PageInterface{
    keywords: string | null;
}

interface CategoryAddInterface {
    categoryName: string;
}

interface CategoryUpdateInterface {
    id: number;
    categoryName: string;
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