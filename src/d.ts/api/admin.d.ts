import {CommonResult} from "@/d.ts/api/index.d.ts";

export declare interface AdminInterface {
    login: (req: string) => Promise<CommonResult>;
    refreshToken: (req: string | null) => Promise<CommonResult>;
}