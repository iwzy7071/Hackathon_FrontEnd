<template>
    <a-layout style="border-color: #e7f6ff;">
        <a-layout-sider theme="light" style="margin-left: 2%">
            <a-menu mode="horizontal">
                <a-menu-item style="float: right" selectable="false" @click="submitConsoleScript">
                    <a-icon type="step-forward"/>
                </a-menu-item>
                <a-menu-item style="float: right" selectable="false">
                    <a-icon type="plus"/>
                </a-menu-item>
            </a-menu>
            <a-directory-tree multiple default-expand-all @select="selectFile"
                              :default-selected-keys="['0']"
            >
                <a-tree-node title="Files" :disabled="true">
                    <a-tree-node v-for="node in fileDirs" :key="node.key" :title="node.name" is-leaf/>
                </a-tree-node>
            </a-directory-tree>
        </a-layout-sider>
        <a-card style="margin-left: 1%;">
            <a-tabs type="editable-card" @edit="onEdit" size="small" default-active-key="activeKey"
                    @tabClick="changePanes">
                <a-tab-pane v-for="file in filePanes" :key="file.key" :tab="file.name">
                </a-tab-pane>
            </a-tabs>
            <div ref="container" style="height: 500px;"></div>
            <div v-infinite-scroll="handleConsoleOnLoad" :infinite-scroll-distance="1"
                 style="overflow: auto;padding: 8px 24px;height: 200px;}">
                <label>控制台输出：</label>
                <a-list size="small" :data-source="consoleInfo">
                    <a-list-item slot="renderItem" slot-scope="item">
                        {{item}}
                    </a-list-item>
                    <div v-if="consoleLoading" style="text-align: center">
                        <a-spin/>
                    </div>
                </a-list>
            </div>
        </a-card>
    </a-layout>
</template>
<script>
    import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';
    import infiniteScroll from 'vue-infinite-scroll';

    export default {
        directives: {infiniteScroll},
        data() {
            return {
                task: {},
                fileDirs: [],
                filePanes: [],
                codes: [],
                code: '',
                monacoEditor: {},
                consoleInfo: [],
                activeKey: 0,
                consoleLoading: false,
            };
        },
        beforeMount() {
            this.getTemplate();
        },
        mounted() {
            let $this = this;
            this.task = this.$store.getters.getTask;
            $this.getConsole();
            let container = $this.$refs.container;
            $this.monacoEditor = monaco.editor.create(container, {
                value: '',
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
            $this.monacoEditor.onDidChangeModelContent(function (event) {
                $this.code = $this.monacoEditor.getValue();
                $this.$emit('onCodeChange', $this.monacoEditor.getValue(), event);
            });
        },
        methods: {
            submitConsoleScript() {
                let param = new URLSearchParams();
                let $this = this;
                param.append('id', $this.task.task_id);
                param.append('script',$this.code);
                $this.$api.taskEditor.submitConsoleScript(param).then(function (response) {
                    let state = response.state;
                    if(state === false)
                        $this.$message.warn("运行脚本失败");
                    else
                        $this.$message.info("运行脚本成功");
                });
            },
            handleConsoleOnLoad() {
                this.consoleLoading = true;
                this.getConsole();
            },
            onEdit(targetKey, action) {
                this[action](targetKey);
            },
            changePanes(targetKey) {
                let $this = this;
                $this.codes[this.activeKey] = $this.code;
                $this.monacoEditor.setValue($this.codes[targetKey]);
                this.activeKey = targetKey;
            },
            remove(targetKey) {
                if (this.filePanes.length < 2)
                    return;
                let activeKey = this.activeKey;
                let lastIndex;
                this.filePanes.forEach((pane, i) => {
                    if (pane.key === targetKey) {
                        lastIndex = i - 1;
                    }
                });
                const panes = this.filePanes.filter(pane => pane.key !== targetKey);
                if (panes.length && activeKey === targetKey) {
                    if (lastIndex >= 0) {
                        activeKey = panes[lastIndex].key;
                    } else {
                        activeKey = panes[0].key;
                    }
                }
                this.filePanes = panes;
                this.activeKey = activeKey;
            },
            getConsole() {
                let param = new URLSearchParams();
                let $this = this;
                param.append('id', $this.task.task_id);
                $this.$api.taskEditor.getConsole(param).then(function (response) {
                    $this.consoleInfo = response.data;
                    $this.consoleLoading = false;
                });
            },
            selectFile(keys, event) {
                let key = keys[0];
                for (let index in this.filePanes) {
                    let file = this.filePanes[index];
                    if (file.key === key)
                        return;
                }
                this.filePanes.push({'name': event.node.title, 'key': keys[0]})
            },
            getTemplate() {
                let $this = this;
                let param = new URLSearchParams();
                param.append('id', $this.task.task_id);
                this.$api.taskEditor.getTemplate(param).then(function (response) {
                    let data = response.data;
                    for (let index in data) {
                        let item = data[index];
                        $this.fileDirs.push({'name': item.name, 'key': index});
                        $this.codes.push(item.code);
                    }
                    $this.filePanes.push($this.fileDirs[0]);
                    $this.monacoEditor.setValue($this.codes[0]);
                });
            },
        },
    };
</script>
