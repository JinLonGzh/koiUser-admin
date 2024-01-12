import {PopupInterface, ProcessInterface} from "@/d.ts/modules/process";
import {ElMessage} from "element-plus";
import {reactive, ref} from "vue";

const Popup: PopupInterface = {

    // 轻提示
    tipSentry: ref(false),
    tipList: reactive({
        msg: "",
        type: 0
    }),
    tipShow: {
        success: (msg) => {
            ElMessage.success(msg);
        },
        info: (msg) => {
            ElMessage.info(msg);
        },
        warn: (msg) => {
            ElMessage.warning(msg);
        },
        error: (msg) => {
            ElMessage.error(msg);
        }
    }

}

const Process: ProcessInterface = {
    ...Popup,
}

export default Process;