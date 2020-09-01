import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from "../pages/Index";
import TaskList from "../pages/TaskList";
import OriginList from "../pages/OriginList";
import PowerList from "../pages/PowerList";
import TaskDetail from "../pages/TaskDetail";
Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        children: [
            {
                path: '/taskList',
                name: '任务列表',
                component: TaskList,
                meta: {title: '任务列表'}
            },
            {
                path: '/',
                name: '任务列表',
                component: TaskList,
                meta: {title: '任务列表'}
            },
            {
                path: '/taskDetail/:id',
                name: '任务详情',
                component: TaskDetail,
                meta: {title: '任务详情'}
            },
            {
                path: '/powerList',
                name: '计算力列表',
                component: PowerList,
                meta: {title: '计算力列表'}
            },
            {
                path: '/originList',
                name: '数据源列表',
                component: OriginList,
                meta: {title: '数据源列表'}
            },
        ],
        meta: {title: '首页'}
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
});
export default router;
