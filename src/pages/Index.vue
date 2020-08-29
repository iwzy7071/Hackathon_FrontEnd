<template>
    <a-layout style="min-height: 100%">
        <a-menu mode="horizontal" :style="{'lineHeight': '64px','width':'100%'}"  theme="dark">
            <a-menu-item style="font-size:large;padding-left: 5%" selectable="false">云间联邦数智平台</a-menu-item>
            <a-menu-item :style="{float:'Right'}" selectable="false">退出</a-menu-item>
            <a-menu-item :style="{float:'Right'}" selectable="false">admin</a-menu-item>
        </a-menu>
        <a-layout>
            <a-layout-sider style="background: #fff;margin-top: 1%">
                <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }" :default-selected-keys="['0']">
                    <a-menu-item style="margin-top: 30%" key="0">
                        <router-link to="/taskList">任务列表</router-link>
                    </a-menu-item>
                    <a-menu-item key="1">
                        <router-link to="/originList">
                            数据源
                        </router-link>
                    </a-menu-item>
                    <a-menu-item key="2">
                        <router-link to="/powerList">
                            计算力
                        </router-link>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <router-view></router-view>
        </a-layout>
    </a-layout>
</template>
<script>
    export default {
        data() {
            return {
                collapsed: false,
            };
        },
    };
</script>
