<template>
    <a-layout style="border-color: #e7f6ff;">
        <a-card style="border-color: #e7f6ff;margin-top: 1%">
            <h4>LOG</h4>
            <div ref="container" style="height: 275px;"></div>
        </a-card>
    </a-layout>
</template>
<script>
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

    export default {
        data() {
            return {
                monacoEditor: {},
            };
        },
        beforeMount() {
        },
        mounted() {
            let $this = this;
            let container = $this.$refs.container;
            let param = new URLSearchParams();
            param.append('id', $this.$store.state.task.task_id);
            $this.$api.taskEditor.getConsole(param).then(function (response) {
                let consoleInfo = response.data;
                consoleInfo = consoleInfo.join("\n");
                $this.monacoEditor = monaco.editor.create(container, {
                    value: consoleInfo,
                    roundedSelection: false,
                    readOnly: true,
                    cursorStyle: 'line',
                    automaticLayout: false,
                    glyphMargin: true,
                    useTabStops: false,
                    autoIndent: false,
                    selectOnLineNumbers: true,
                    language: 'shell',
                });
            });
        },
        methods: {},
    };
</script>
