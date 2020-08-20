<template>
    <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>训练列表</a-breadcrumb-item>
            <a-breadcrumb-item>任务详情</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
            <a-descriptions title="任务概览">
                <a-descriptions-item label="任务ID">{{task.id}}</a-descriptions-item>
                <a-descriptions-item label="任务名称">{{task.name}}</a-descriptions-item>
                <a-descriptions-item label="任务描述">{{task.desc}}</a-descriptions-item>
            </a-descriptions>
            <a-form>
                <a-form-item label="上传训练脚本文件">
                    <div class="dropbox">
                        <a-upload-dragger name="file" :multiple="true"
                                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                          @change="uploadChange">
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
            <a-button type="primary" style="float:right" @click="NavigateMonitorTask" :disabled="monitor_button">训练监测
            </a-button>
            <a-button type="primary" style="float:right;margin-right: 2%" @click="finishLaunchTask"
                      :disabled="launch_button">开始任务
            </a-button>
        </a-layout-content>
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
                param.append('id', this.task.id);
                let powerList = [];
                let originList = [];
                for (let power in this.powerList) {
                    powerList.push(power.id);
                }
                for (let origin in this.originList) {
                    originList.push(origin.id);
                }
                param.append('powerList', powerList);
                param.append('originList', originList);
                $this.$api.TaskDetail.launchNewTask(param).then(function (response) {
                    let data = response.data;
                    console.log(data);
                    let state = data.state;
                    if (state === true) {
                        $this.$message.info("启动任务成功");
                    } else {
                        $this.$message.warning("启动任务失败");
                    }
                });
                this.monitor_button = false;
            },
            NavigateMonitorTask() {
                this.$router.push({
                    path: `/taskMonitor/ + ${this.task.id}`,
                    query: {
                        data: this.task.id,
                    }
                });
            }
        }
    };
</script>
