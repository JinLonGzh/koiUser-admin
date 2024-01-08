import type {UrlReqType} from "@/config/constant";
import type {CommonResult} from "@/d.ts/api";


export declare type AddHeaderType = (existent?: any) => any;

export declare type BuildGetUrlType = (baseUrl: string, req: any) => string;

export declare type BuildMixGetUrlType = (baseUrl: string, req: MixGetUrlReqInterface) => string;
interface MixGetUrlReqInterface {
    path: Array<any>;
    param: any;
}

export declare type GetType = (url: string, req?: any, type?: UrlReqType) => Promise<CommonResult>;

export declare type PostType = (url: string, req?: any) => Promise<CommonResult>;

export declare type PutType = (url: string, req?: any) => Promise<CommonResult>;

export declare type DelType = (url: string, req?: any, type?: UrlReqType) => Promise<CommonResult>;