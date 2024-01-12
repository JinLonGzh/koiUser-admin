import process from "@/modules/process";
import type { App } from "vue";

const $process = {
    install: (app: App) => {
        app.provide('$process', process);
    }
};

export { $process };