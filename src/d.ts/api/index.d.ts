import {ApiAdminInterface} from "@/d.ts/api/admin.d.ts";
import {ApiMenuInterface} from "@/d.ts/api/menu";
import {ApiArticleInterface} from "@/d.ts/api/article";
import {ApiCategoryInterface} from "@/d.ts/api/category";
import {ApiTalkInterface} from "@/d.ts/api/talk";

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
    ApiMenuInterface,
    ApiAdminInterface,
    ApiArticleInterface,
    ApiCategoryInterface,
    ApiTalkInterface
{}


