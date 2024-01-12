import {UnwrapNestedRefs} from "vue";


export declare interface ProcessInterface extends PopupInterface
{}

export declare interface PopupInterface {

    tipSentry: Ref<boolean>;
    tipList: UnwrapNestedRefs<{msg: string, type: number}>;
    tipShow: TipShowInterface;


}

interface TipShowInterface {
    success: (msg: string) => void;
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
}