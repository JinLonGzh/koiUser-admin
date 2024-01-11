import {CommonResult, PageInterface} from "@/d.ts/api/index";

export declare interface ArticleInterface {
    pageArticle: (req: ArticleQueryInterface) => Promise<CommonResult>;
    updateArticleTop: (req: ArticleTopInterface) => Promise<CommonResult>;
    deleteArticle: (id: number) => Promise<CommonResult>;
}

interface ArticleQueryInterface extends PageInterface {
    keywords: string | null,
    categoryId: number | null,
    status: number | null
}

interface ArticleTopInterface {
    id: number;
    top: number;
}

interface ArticleDataInterface {
    id: number;
    articleTitle: string;
    categoryId: number;
    categoryName: string;
    articleCover: string;
    articleTop: number;
    status: number;
    viewCount: number;
    createTime: Record<string, unknown>;
    updateTime: Record<string, unknown>;
}