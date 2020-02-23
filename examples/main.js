/**
 * Created by ty on 18/1/31.
 */
"use strict";
import 'babel-polyfill'

/* 引入Vue相关 */
import Vue from 'vue'
// import VueRouter from 'vue-router';
// import Routers from './router';
import TransverseTreeTable from '../src/index.js';

//引入项目样式
import './assets/normalize.scss';
import './assets/common.scss';
import './assets/proj.scss';

import App from './app.vue';


/* 加载vue状态管理器 */
// import store from './vuex'

Vue.component('TransverseTreeTable', TransverseTreeTable);

// Vue.use(VueRouter);

// 路由配置
// const RouterConfig = {
//     routes: Routers
// };

// const router = new VueRouter(RouterConfig);

new Vue({
    el: '#appExample',
    // router: router,
    // store,
    render: h => h(App)
});
