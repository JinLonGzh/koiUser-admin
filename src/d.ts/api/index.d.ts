import {AdminInterface} from "@/d.ts/api/admin.d.ts";
import {MenuInterface} from "@/d.ts/api/menu";
import {ArticleInterface} from "@/d.ts/api/article";
import {CategoryInterface} from "@/d.ts/api/category";

export declare interface CommonResult {
    code: number;
    msg: string;

    [propName: string]: any;
}

interface PageInterface {
    pageNo: number;
    pageSize: number;
}

interface OptionInterface {
    id: number;
    name: string;
}

export declare interface ApiObject extends
    MenuInterface,
    AdminInterface,
    ArticleInterface,
    CategoryInterface
{}


