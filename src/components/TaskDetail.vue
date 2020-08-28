<template>
    <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>训练列表</a-breadcrumb-item>
            <a-breadcrumb-item>任务详情</a-breadcrumb-item>
        </a-breadcrumb>
        <a-tabs default-active-key="1" @change="tabChange">
            <a-tab-pane key="1" tab="总览"></a-tab-pane>
            <a-tab-pane key="2" tab="IDE"></a-tab-pane>
            <a-tab-pane key="3" tab="训练监测"></a-tab-pane>
        </a-tabs>
        <a-card>
            <a-descriptions>
                <a-descriptions-item label="任务ID">{{task.task_id}}</a-descriptions-item>
                <a-descriptions-item label="任务名称">{{task.name}}</a-descriptions-item>
                <a-descriptions-item label="任务描述">{{task.desc}}</a-descriptions-item>
            </a-descriptions>
            <a-form>
                <a-form-item label="上传训练脚本文件">
                    <div class="dropbox">
                        <a-upload-dragger name="file" :multiple="false" :fileList="uploadFiles"
                                          :customRequest="UploadTrainFileRequest">
                            <p class="ant-upload-drag-icon">
                                <a-icon type="inbox"/>
                            </p>
                            <p class="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                        </a-upload-dragger>
                    </div>
                </a-form-item>
            </a-form>
            <a-descriptions>
                <a-descriptions-item label="数据源列表">
                    <a-table :columns="originColumn" rowKey="id" style="margin-top: 15px" :data-source="originList">
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="primary" @click="deleteOrigin(record)">删除</a-button>
                        </div>
                    </a-table>
                </a-descriptions-item>
                <a-descriptions-item>
                    <a-carousel arrows dots-class="slick-dots slick-thumb">
                        <img src="/static/1.png"/>
                    </a-carousel>
                </a-descriptions-item>
                <a-descriptions-item label="计算力列表">
                    <a-table :columns="powerColumn" rowKey="id" style="margin-top: 15px" :data-source="powerList">
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="primary" @click="deletePower(record)">删除</a-button>
                        </div>
                    </a-table>
                </a-descriptions-item>
            </a-descriptions>
            <a-button type="primary" style="float:right" @click="finishLaunchTask"
                      :disabled="launch_button">开始任务
            </a-button>
        </a-card>
    </a-layout>
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
                if (key === 1) {
                    $this.$router.push({
                        path: `/taskDetail/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                } else if (key === 2) {
                    $this.$router.push({
                        path: `/taskEditor/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                } else {
                    $this.$router.push({
                        path: `/taskMonitor/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                }
            },
        },
    };
</script>
