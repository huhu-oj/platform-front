import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'mavon-editor/dist/css/index.css'

import "core-js/actual/array/group-by";
createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
