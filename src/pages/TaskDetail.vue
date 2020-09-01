<template>
    <a-layout style="padding: 0 24px 24px;border-color: #e7f6ff" theme="light">
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="总览">
                <taskDetail style="height: 100%;width: 100%"/>
            </a-tab-pane>
            <a-tab-pane key="2" tab="IDE">
                <taskEditor/>
            </a-tab-pane>
            <a-tab-pane key="3" tab="训练监测">
                <taskMonitor/>
            </a-tab-pane>
        </a-tabs>
    </a-layout>
</template>
<script>
    import taskDetail from "../components/taskDetail";
    import taskEditor from "../components/taskEditor";
    import taskMonitor from "../components/taskMonitor";

    export default {
        components: {taskDetail, taskEditor, taskMonitor},
        data() {
            return {
            };
        },
    };
</script>
