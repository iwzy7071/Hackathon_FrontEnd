import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios from 'axios'
import api from './api'

Vue.prototype.$api = api;

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(require('vue-cookies'));
Vue.use(require('vue-script2'));
Vue.use(Antd);



new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

