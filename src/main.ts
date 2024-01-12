import { createApp } from 'vue'
import "@/assets/scss/index.scss"
import 'element-plus/theme-chalk/src/index.scss'
import App from './App.vue'
import router from "@/router";
import {createPinia} from "pinia";
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import {$process} from "@/plugins";

const app = createApp(App)

const plugins = [$process];
plugins.forEach(plugin => {
    app.use(plugin);
});

app.use(router)
app.use(createPinia())
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')

