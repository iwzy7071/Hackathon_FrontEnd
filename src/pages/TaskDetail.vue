<template>
    <a-layout style="padding: 0 24px 24px;border-color: #e7f6ff">
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="总览">
                <taskDetail/>
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
                collapsed: false,
                originColumn: [
                    {
                        title: '源ID',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: '源描述',
                        dataIndex: 'desc',
                        key: 'desc',
                        ellipsis: true,
                    },
                    {
                        title: '源地址',
                        dataIndex: 'addr',
                        key: 'addr',
                        ellipsis: true,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: {customRender: 'action'},
                    },
                ],
                powerColumn: [
                    {
                        title: 'ID',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: '描述',
                        dataIndex: 'desc',
                        key: 'desc',
                        ellipsis: true,
                    },
                    {
                        title: '地址',
                        dataIndex: 'addr',
                        key: 'addr',
                        ellipsis: true,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: {customRender: 'action'},
                    },
                ],
                task: {},
                train: {},
                uploadHeader: '',
                originList: [],
                powerList: [],
                uploadFiles: [],
                monitor_button: true,
                launch_button: false,
            };
        },
        mounted() {
            this.task = this.$route.query.data;
            this.originList = this.$store.getters.getOriginList;
            this.powerList = this.$store.getters.getPowerList;
        },
        methods: {
            deletePower(record) {
                let index = this.powerList.indexOf(record);
                this.powerList.splice(index, 1);
            },
            deleteOrigin(record) {
                let index = this.originList.indexOf(record);
                this.originList.splice(index, 1);
            },
            uploadChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    this.$message.success(`${info.file.name} 文件上传成功。`);
                } else if (status === 'error') {
                    this.$message.error(`${info.file.name} 文件上传失败。`);
                }
            },
            finishLaunchTask() {
                let $this = this;
                let param = new URLSearchParams();
                if ($this.uploadFiles.length === 0) {
                    $this.$message.warning("请先上传训练脚本文件");
                    return;
                }
                param.append('id', this.task.id);
                let powerList = [];
                let originList = [];
                for (let power in this.powerList) {
                    powerList.push(power.id);
                }
                for (let origin in this.originList) {
                    originList.push(origin.id);
                }
                param.append('computation_providers', powerList);
                param.append('data_sources', originList);
                param.append('file', $this.uploadFiles[0].uid);
                $this.$api.TaskDetail.launchNewTask(param).then(function (response) {
                    let data = response.data;
                    let state = data.state;
                    if (state === true) {
                        $this.$message.info("启动任务成功");
                    } else {
                        $this.$message.warning("启动任务失败");
                    }
                });
                this.monitor_button = false;
            },
            UploadTrainFileRequest(data) {
                let $this = this;
                let formData = new FormData();
                formData.append('file', data.file);
                formData.append('id', $this.task.id);
                $this.$api.TaskDetail.uploadFile(formData).then(function (response) {
                    if (response.code === 0) {
                        let file = $this.fileFormatter(response.data);
                        $this.uploadFiles = [file];
                    } else {
                        $this.$message.error("上传文件失败");
                    }
                });
            },
            fileFormatter(data) {
                let file = {uid: data.uuid, name: data.name, status: 'done', response: '{"status": "success"}',};
                return file;
            },
            tabChange(key) {
                let $this = this;
                console.log(key);
                if (key === 1) {
                    $this.$router.push({
                        path: `/taskDetail/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                } else if (key === 3) {
                    $this.$router.replace({
                        path: `/taskMonitor/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                } else {
                    $this.$router.replace({
                        path: `/taskEditor/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                }
            },
        },
    };
</script>
