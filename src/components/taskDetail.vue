<template>
    <a-card style="border-color: #e7f6ff;">
        <a-descriptions>
            <a-descriptions-item label="任务ID">{{task.task_id}}</a-descriptions-item>
            <a-descriptions-item label="任务名称">{{task.name}}</a-descriptions-item>
            <a-descriptions-item label="任务描述">{{task.desc}}</a-descriptions-item>
        </a-descriptions>
        <a-form>
            <a-form-item label="上传训练脚本文件">
                <div style="width: 50%;height: auto">
                    <a-upload-dragger name="file" :multiple="false" :fileList="uploadFiles"
                                      :customRequest="UploadTrainFileRequest">
                        <p class="ant-upload-drag-icon">
                            <a-icon type="inbox"/>
                        </p>
                        <p style="font-size: small">
                            点击或拖拽文件上传
                        </p>
                    </a-upload-dragger>
                </div>
            </a-form-item>
            <a-form-item>
                <img src="../../static/1.jpeg" style="width: 100%;height: auto"/>
            </a-form-item>
        </a-form>
        <a-descriptions>
            <a-descriptions-item label="数据源列表">
                <a-spin :spinning="table_spinning">
                    <a-table :columns="originColumn" rowKey="id" style="margin-top: 15px" :data-source="originList">
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="primary" @click="deleteOrigin(record)">删除</a-button>
                        </div>
                    </a-table>
                </a-spin>
            </a-descriptions-item>
            <a-descriptions-item>
                <a-carousel arrows dots-class="slick-dots slick-thumb">
                    <img src="/static/1.png"/>
                </a-carousel>
            </a-descriptions-item>
            <a-descriptions-item label="计算力列表">
                <a-spin :spinning="table_spinning">
                    <a-table :columns="powerColumn" rowKey="id" style="margin-top: 15px" :data-source="powerList">
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="primary" @click="deletePower(record)">删除</a-button>
                        </div>
                    </a-table>
                </a-spin>
            </a-descriptions-item>
        </a-descriptions>
        <a-button type="primary" style="float:right" @click="finishLaunchTask"
                  :disabled="launch_button">开始任务
        </a-button>
    </a-card>
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
                table_spinning: true,
            };
        },
        mounted() {
            this.task = this.$store.getters.getTask;
            this.originList = this.$store.getters.getOriginList;
            this.powerList = this.$store.getters.getPowerList;
            let $this = this;
            let param = new URLSearchParams();
            param.append('id', $this.task.task_id);
            $this.$api.TaskList.getTaskSelected(param).then(function (response) {
                let data = response.data;
                if ($this.originList.length === 0)
                    $this.originList = data.data_providers;
                if ($this.powerList.length === 0)
                    $this.powerList = data.computation_providers;
                $this.table_spinning = false;
            });
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
                $this.uploadFiles = [{'uid':'SHA131236841232','name':'SHA131236841232',status: 'done', response: '{"status": "success"}'}];
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
