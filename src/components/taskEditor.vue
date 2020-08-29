<template>
    <a-card style="border-color: #e7f6ff">
        <div style="width: 20%;float: left;height: 100%">
            <div>File <a-button size="small" icon="step-forward"></a-button>
            </div>
            <a-directory-tree multiple>
                <a-tree-node key="1" title="hello.py" is-leaf/>
                <a-tree-node key="2" title="soi.py" is-leaf/>
            </a-directory-tree>
        </div>
        <a-tabs type="card" @change="fileTabchange" size="small" style="width:80%;float: top">
            <a-tab-pane key="1" tab="Tab 1"></a-tab-pane>
            <a-tab-pane key="2" tab="Tab 2"></a-tab-pane>
            <a-tab-pane key="3" tab="Tab 3"></a-tab-pane>
        </a-tabs>
        <div ref="container" style="height: 360px;padding-left: 20%;"></div>
    </a-card>
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
                value: '内容',
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
                automaticLayout: false,
                glyphMargin: true,
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
