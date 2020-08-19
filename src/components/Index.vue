<template>
    <a-layout id="components-layout-demo-top-side-2">
        <a-menu theme="light" mode="horizontal" :style="{ lineHeight: '64px',width:'100%' }">
            <a-menu-item>联邦数智平台</a-menu-item>
            <a-menu-item :style="{float:'Right'}">退出</a-menu-item>
            <a-menu-item :style="{float:'Right'}">admin</a-menu-item>
        </a-menu>
        <a-layout>
            <a-layout-sider style="background: #fff;margin-top: 1%">
                <a-menu mode="inline" :style="{ height: '100%', borderRight: 0 }">
                    <a-menu-item>
                        <router-link to="/taskList">任务列表</router-link>
                    </a-menu-item>
                    <a-menu-item>
                        <router-link to="/originList">
                            数据源
                        </router-link>
                    </a-menu-item>
                    <a-menu-item>
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
