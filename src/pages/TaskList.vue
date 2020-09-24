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
        <a-card style="margin-top: 5%;border-color: #e7f6ff">
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
                        <div slot="status" href="javascript:" slot-scope="text">
                            <span v-if="text === 0">未开始</span>
                            <a v-else-if="text === 1">进行中</a>
                            <span v-else-if="text === 2">已完成</span>
                            <span v-else-if="text === 3">已终止</span>
                        </div>
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="primary" @click="taskDetail(record)">详情</a-button>
                        </div>
                    </a-table>
                </a-spin>
            </a-layout-content>
        </a-card>
        <task-selected/>
        <task-selected-button/>
    </a-layout>
</template>
<script>
    import taskSelected from "../components/taskSelected";
    import taskSelectedButton from "../components/taskSelectedButton";

    export default {
        components: {taskSelected, taskSelectedButton},
        inject: ['reload'],
        data() {
            return {
                taskList: [],
                originList: [],
                powerList: [],
                TaskColumn: [
                    {
                        title: 'ID',
                        dataIndex: 'task_id',
                        key: 'task_id',
                    },
                    {
                        title: '名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '描述',
                        dataIndex: 'desc',
                        key: 'desc',
                    },
                    {
                        title: '发布时间',
                        dataIndex: 'start_time',
                        key: 'start_time',
                    },
                    {
                        title: '完成时间',
                        dataIndex: 'finish_time',
                        key: 'finish_time',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        key: 'status',
                        scopedSlots: {customRender: 'status'},
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: {customRender: 'action'},
                    },
                ],
                selectedRowKeys: [],
                selectedTask: undefined,
                add_task_visible: false,
                launchTaskForm: this.$form.createForm(this, {name: 'launchTaskForm'}),
                headers: {authorization: 'authorization-text',},
                task_visible: false,
                task_spinning: true,
            };
        },
        beforeMount() {
            this.getTaskList();
        },
        mounted() {
            this.selectedRowKeys = this.$store.getters.getTaskSelected;
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
                    $this.$store.state.originList = data.data_providers;
                    $this.$store.state.powerList = data.computation_providers;
                    $this.$message.info("已获取任务" + id + "所选数据源和计算力列表");
                });
            },
            onSelectChange(selectedRowKeys) {
                if (selectedRowKeys.length > 1) {
                    this.selectedTask = selectedRowKeys[1];
                } else if (selectedRowKeys.length === 0) {
                    this.selectedTask = undefined;
                    this.$store.commit('setOriginList', []);
                    this.$store.commit('setPowerList', []);
                } else {
                    this.selectedTask = selectedRowKeys[0];
                }
                this.selectedRowKeys = [this.selectedTask];
                this.$store.commit('setTaskSelected', this.selectedRowKeys);
                this.getTaskSelected(this.selectedTask);
            },
            taskDetail(record) {
                this.$store.state.task = record;
                this.$router.push({path: `/taskDetail`});
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
