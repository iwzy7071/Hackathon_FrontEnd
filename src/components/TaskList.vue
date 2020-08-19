<template>
    <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>训练列表</a-breadcrumb-item>
        </a-breadcrumb>
        <a-modal v-model="add_task_visible" title="新建任务" @ok="finishAddTask">
            <a-form :form="launchTaskForm">
                <a-form-item label="任务名称">
                    <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入任务名称' }] }]"/>
                </a-form-item>
                <a-form-item label="任务描述">
                    <a-input v-decorator="['desc', { rules: [{ required: true, message: '请输入任务描述' }] }]"/>
                </a-form-item>
                <a-form-item label="上传训练脚本文件">
                    <div class="dropbox">
                        <a-upload-dragger name="file" :multiple="true"
                                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                          :headers="headers" @change="uploadChange">
                            <p class="ant-upload-drag-icon">
                                <a-icon type="inbox"/>
                            </p>
                            <p class="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                        </a-upload-dragger>
                    </div>
                </a-form-item>
                <a-form-item label="数据源列表">
                    <a-table
                            :columns="originColumn"
                            rowKey="id"
                            style="margin-top: 15px"
                            :data-source="originList">
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="primary" @click="deleteOrigin(record)">删除</a-button>
                        </div>
                    </a-table>
                </a-form-item>
                <a-form-item label="计算力列表">
                    <a-table
                            :columns="powerColumn"
                            rowKey="id"
                            style="margin-top: 15px"
                            :data-source="powerList">
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="primary" @click="deletePower(record)">删除</a-button>
                        </div>
                    </a-table>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-card>
            <a-button type="primary" style="float:right" @click="showAddTask">新建任务</a-button>
            <a-layout-content :style="{marginTop:'5%'}">
                <!--                <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"-->
                <a-table
                        :columns="TaskColumn"
                        rowKey="id"
                        style="margin-top: 15px"
                        :data-source="taskList">
                    <div slot="action" href="javascript:" slot-scope="record">
                        <a-button type="primary" @click="taskDetail(record)">详情</a-button>
                    </div>
                </a-table>
            </a-layout-content>
        </a-card>
    </a-layout>
</template>
<script>
    export default {
        data() {
            return {
                taskList: [],
                originList: [],
                powerList: [],
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
                TaskColumn: [
                    {
                        title: '任务ID',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: '任务名称',
                        dataIndex: 'name',
                        key: 'name',
                        ellipsis: true,
                    },
                    {
                        title: '创建方',
                        dataIndex: 'creator',
                        key: 'creator',
                        ellipsis: true,
                    },
                    {
                        title: '任务类型',
                        dataIndex: 'type',
                        key: 'type',
                        ellipsis: true,
                    },
                    {
                        title: '任务描述',
                        dataIndex: 'desc',
                        key: 'desc',
                        ellipsis: true,
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        ellipsis: true,
                    },
                    {
                        title: '完成时间',
                        dataIndex: 'deadTime',
                        key: 'deadTime',
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
                selectedRowKeys: [],
                selectedTask: '',
                add_task_visible: false,
                launchTaskForm: this.$form.createForm(this, {name: 'launchTaskForm'}),
                headers: {authorization: 'authorization-text',},
            };
        },
        mounted() {
            this.getTaskList();
        },
        methods: {
            getTaskList() {
                let $this = this;
                let param = new URLSearchParams();
                $this.$api.TaskList.getTaskList(param).then(function (response) {
                    let data = response.data;
                    $this.taskList = data;
                })
            },
            // onSelectChange(selectedRowKeys) {
            //     if (selectedRowKeys.length > 1) {
            //         this.selectedTask = selectedRowKeys[1];
            //     } else {
            //         this.selectedTask = selectedRowKeys[0];
            //     }
            //     this.selectedRowKeys = [this.selectedTask];
            // },
            taskDetail(record) {
                this.$router.push({
                    path: `/taskDetail/ + ${record.id}`,
                    query: {
                        data: record,
                    }
                });
            },
            finishAddTask() {
                let $this = this;
                this.launchTaskForm.validateFields((err, values) => {
                    if (!err) {
                        let param = new URLSearchParams();
                        param.append('name', values.name);
                        param.append('desc', values.desc);
                        $this.$api.TaskList.submitNewTask(param).then(function (response) {
                            let data = response.data;
                            $this.taskList = data;
                        })
                        this.add_task_visible = false;
                    }
                });
            },
            showAddTask() {
                this.add_task_visible = true;
                this.powerList = this.$store.getters.getPowerList;
                this.originList = this.$store.getters.getOriginList;
            },
            finishLaunchTask() {
                console.log(this.launchTaskForm);
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
            deletePower(record) {
                let index = this.powerList.indexOf(record);
                this.powerList.splice(index, 1);
            },
            deleteOrigin(record) {
                let index = this.originList.indexOf(record);
                this.originList.splice(index, 1);
            },
        }
    };
</script>
