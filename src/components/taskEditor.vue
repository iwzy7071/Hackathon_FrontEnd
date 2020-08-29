<template>
    <a-layout style="border-color: #e7f6ff;">
        <a-layout-sider theme="light">
            <a-menu v-model="current" mode="horizontal">
                <a-menu-item style="float: right" selectable="false">
                    <a-icon type="step-forward" />
                </a-menu-item>
                <a-menu-item style="float: right" selectable="false">
                    <a-icon type="plus" />
                </a-menu-item>
            </a-menu>
            <a-directory-tree multiple default-expand-all>
                <a-tree-node key="0" title="Files">
                    <a-tree-node key="1" title="hello.py" is-leaf/>
                    <a-tree-node key="2" title="soi.py" is-leaf/>
                </a-tree-node>
            </a-directory-tree>
        </a-layout-sider>
        <a-card style="margin-left: 1%;">
            <a-tabs type="card" @change="fileTabchange" size="small">
                <a-tab-pane key="1" tab="Tab 1"></a-tab-pane>
                <a-tab-pane key="2" tab="Tab 2"></a-tab-pane>
                <a-tab-pane key="3" tab="Tab 3"></a-tab-pane>
            </a-tabs>
            <div ref="container" style="height: 360px;"></div>
        </a-card>
    </a-layout>
</template>
<script>
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

    export default {
        data() {
            const panes = [
                {title: 'Tab 1', content: 'Content of Tab 1', key: '1'},
                {title: 'Tab 2', content: 'Content of Tab 2', key: '2'},
            ];
            return {
                task: {},
                monacoEditor: {},
                activeKey: panes[0].key,
                panes,
                newTabIndex: 0,
            };
        },
        mounted() {
            this.task = this.$route.query.data;
            this.monacoEditor = monaco.editor.create(this.$refs.container, {
                value: 'import numpy as np',
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                automaticLayout: false, glyphMargin: true,
                useTabStops: false,
                autoIndent: false,
                selectOnLineNumbers: true,
                language: 'python',
            });
        },
        methods: {
            fileTabchange() {
                console.log("change");
            }
        },
    };
</script>
