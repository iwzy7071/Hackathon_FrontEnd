<template>
    <a-card style="border-color: #e7f6ff;">
        <a-skeleton active v-if="spinning"/>
        <a-descriptions title="任务概述" v-if="!spinning">
            <a-descriptions-item label="任务ID">{{this.$store.state.task.task_id}}</a-descriptions-item>
            <a-descriptions-item v-if="this.$store.state.task.status === 0" label="状态">未开始</a-descriptions-item>
            <a-descriptions-item v-if="this.$store.state.task.status === 1" label="状态">进行中</a-descriptions-item>
            <a-descriptions-item v-if="this.$store.state.task.status === 2" label="状态">已完成</a-descriptions-item>
            <a-descriptions-item v-if="this.$store.state.task.status === 3" label="状态">已终止</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{this.$store.state.task.start_time}}</a-descriptions-item>
            <a-descriptions-item label="任务名称">{{this.$store.state.task.name}}</a-descriptions-item>
            <a-descriptions-item label="数据源数量">{{this.$store.state.originList.length}}</a-descriptions-item>
            <a-descriptions-item label="完成时间">{{this.$store.state.task.finish_time}}</a-descriptions-item>
            <a-descriptions-item label="任务描述">{{this.$store.state.task.desc}}</a-descriptions-item>
            <a-descriptions-item label="计算力数量">{{this.$store.state.powerList.length}}</a-descriptions-item>
            <a-descriptions-item label="总时长">{{this.$store.state.task.total_time}}</a-descriptions-item>
        </a-descriptions>
    </a-card>
    <!--    <task-selected/>-->
    <!--    <task-selected-button/>-->
    <!--        <a-form>-->
    <!--            <a-form-item label="上传训练脚本文件">-->
    <!--                <div style="width: 50%;height: auto">-->
    <!--                    <a-upload-dragger name="file" :multiple="false" :fileList="uploadFiles"-->
    <!--                                      :customRequest="UploadTrainFileRequest">-->
    <!--                        <p class="ant-upload-drag-icon">-->
    <!--                            <a-icon type="inbox"/>-->
    <!--                        </p>-->
    <!--                        <p style="font-size: small">-->
    <!--                            点击或拖拽文件上传-->
    <!--                        </p>-->
    <!--                    </a-upload-dragger>-->
    <!--                </div>-->
    <!--            </a-form-item>-->
    <!--            <a-form-item>-->
    <!--                <img src="../../static/1.jpeg" style="width: 100%;height: auto"/>-->
    <!--            </a-form-item>-->
    <!--        </a-form>-->
    <!--        <a-button type="primary" style="float:right" @click="finishLaunchTask"-->
    <!--                  :disabled="launch_button">开始任务-->
    <!--        </a-button>-->
</template>
<script>
    export default {
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
                        title: '名称',
                        dataIndex: 'name',
                        key: 'name',
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
                        title: '提供方',
                        dataIndex: 'provider',
                        key: 'provider',
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
                spinning: true,
            };
        },
        mounted() {
            let $this = this;
            if ($this.$store.state.originList.length === 0 && $this.$store.state.powerList.length === 0) {
                let param = new URLSearchParams();
                param.append('id', $this.$store.state.task.task_id);
                $this.$api.TaskList.getTaskSelected(param).then(function (response) {
                    let data = response.data;
                    $this.$store.state.originList = data.data_providers;
                    $this.$store.state.powerList = data.computation_providers;
                    $this.spinning = false;
                });
            }else{
                $this.spinning = false;
            }
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
                param.append('id', $this.task.task_id);
                let powerList = [];
                let originList = [];
                for (let index in $this.powerList) {
                    powerList.push($this.powerList[index].id);
                }
                for (let index in $this.originList) {
                    originList.push($this.originList[index].id);
                }
                param.append('computation_providers', powerList.toString());
                param.append('data_sources', originList.toString());
                param.append('file_id', $this.uploadFiles[0].uid.toString());
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
                $this.$message.info("上传文件成功");
                $this.uploadFiles = [{
                    'uid': 'SHA131236841232',
                    'name': 'SHA131236841232',
                    status: 'done',
                    response: '{"status": "success"}'
                }];
                console.log(data);
                // let formData = new FormData();
                // formData.append('file', data.file);
                // formData.append('id', $this.task.task_id);
                // $this.$api.TaskDetail.uploadFile(formData).then(function (response) {
                //     if (response.code === 0) {
                //         let file = $this.fileFormatter(response.data);
                //         $this.uploadFiles = [file];
                //     } else {
                //         $this.$message.error("上传文件失败");
                //     }
                // });
            },
            fileFormatter(data) {
                let file = {uid: data.uuid, name: data.name, status: 'done', response: '{"status": "success"}',};
                return file;
            },
        },
    };
</script>
