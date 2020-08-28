<template>
    <a-layout style="padding: 0 24px 24px">
        <a-modal v-model="add_task_visible" title="新建任务" @ok="finishAddTask">
            <a-form :form="launchTaskForm">
                <a-form-item label="任务名称">
                    <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入任务名称' }] }]"/>
                </a-form-item>
                <a-form-item label="任务描述">
                    <a-input v-decorator="['desc', { rules: [{ required: true, message: '请输入任务描述' }] }]"/>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-card style="margin: 16px 0;">
            <a-button type="primary" style="float:right" @click="showAddTask">新建任务</a-button>
            <a-breadcrumb>
                <a-breadcrumb-item>任务列表</a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout-content :style="{marginTop:'5%'}">
                <a-spin :spinning="task_spinning">
                    <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                             :columns="TaskColumn"
                             rowKey="task_id"
                             style="margin-top: 15px"
                             :data-source="taskList">
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="primary" @click="taskDetail(record)">详情</a-button>
                        </div>
                    </a-table>
                </a-spin>
            </a-layout-content>
        </a-card>
    </a-layout>
</template>
<script>
    export default {
        inject: ['reload'],
        data() {
            return {
                taskList: [],
                originList: [],
                powerList: [],
                TaskColumn: [
                    {
                        title: '任务ID',
                        dataIndex: 'task_id',
                        key: 'task_id',
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
                        dataIndex: 'start_time',
                        key: 'start_time',
                        ellipsis: true,
                    },
                    {
                        title: '完成时间',
                        dataIndex: 'finish_time',
                        key: 'finish_time',
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
                task_spinning: true,
            };
        },
        beforeMount() {
            this.getTaskList();
        },
        methods: {
            getTaskList() {
                let $this = this;
                let param = new URLSearchParams();
                $this.$api.TaskList.getTaskList(param).then(function (response) {
                    let data = response.data;
                    $this.taskList = data;
                    $this.task_spinning = false;
                })
            },
            getTaskSelected(id) {
                let param = new URLSearchParams();
                let $this = this;
                param.append('id', id);
                this.$api.TaskList.getTaskSelected(param).then(function (response) {
                    let data = response.data;
                    $this.$store.commit('setOriginList', data.data_providers);
                    $this.$store.commit('setPowerList', data.comp_providers);
                });
            },
            onSelectChange(selectedRowKeys) {
                if (selectedRowKeys.length > 1) {
                    this.selectedTask = selectedRowKeys[1];
                } else {
                    this.selectedTask = selectedRowKeys[0];
                }
                this.selectedRowKeys = [this.selectedTask];
                this.getTaskSelected(this.selectedTask);
            },
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
                            let state = data.state;
                            let id = data.id;
                            if (state === true) {
                                $this.$message.info("创建任务" + id + "成功");
                            } else {
                                $this.$message.warning("创建任务失败");
                            }
                        })
                        $this.add_task_visible = false;
                        $this.reload();
                    }
                });
            },
            showAddTask() {
                this.add_task_visible = true;
            }
        }
    };
</script>
