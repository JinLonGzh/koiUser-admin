import {CommonResult, PageInterface} from "@/d.ts/api/index";

export declare interface ApiWebsiteConfigInterface {
    getConfigPage: (req: WebsiteConfigQueryInterface) => Promise<CommonResult>;
    addConfig: (req: WebsiteConfigAddInterface) => Promise<CommonResult>;
    updateConfig: (req: WebsiteConfigUpdateInterface) => Promise<CommonResult>;
    deleteConfig: (id: number) => Promise<CommonResult>;
}

interface WebsiteConfigQueryInterface extends PageInterface {
    configName: string | null,
    configType: number | null
}

interface WebsiteConfigAddInterface {
    configName: string,
    configKey: string
    configValue: string,
    configType: number,
}

interface WebsiteConfigUpdateInterface {
    id: number,
    configName: string,
    configKey: string
    configValue: string,
    configType: number,
}

interface WebsiteConfig {
    id: number;
    configName: string;
    configKey: string;
    configValue: string;
    configType: number;
    createTime: string;
    updateTime: string;
}