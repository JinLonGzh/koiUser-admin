import {CommonResult, PageInterface} from "@/d.ts/api/index";

export declare interface ApiTalkInterface {
    pageTalk: (req: TalkQueryInterface) => Promise<CommonResult>;
    updateTalkTop: (req: TalkTopInterface) => Promise<CommonResult>;
    deleteTalk: (id: number) => Promise<CommonResult>;
    getTalkDetail: (id: number) => Promise<CommonResult>;
    addTalk: (req: TalkAddInterface) => Promise<CommonResult>;
    updateTalk: (req: TalkUpdateInterface) => Promise<CommonResult>;
}

interface TalkQueryInterface extends PageInterface {
    status: number | null
}

interface TalkTopInterface {
    id: number;
    top: number;
}

interface TalkDataInterface {
    id: number;
    content: string;
    imageList?: string[];
    talkTop: number;
    status: number;
    viewCount: number;
    createTime: Record<string, unknown>;
    updateTime: Record<string, unknown>;
}

interface TalkAddInterface {
    content: string;
    images: string;
    talkTop: number;
    status: number;
}

interface TalkUpdateInterface {
    id: number;
    content: string;
    images: string;
    talkTop: number;
    status: number;
}