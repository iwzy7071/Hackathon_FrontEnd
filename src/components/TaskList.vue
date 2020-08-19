<template>
    <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>训练列表</a-breadcrumb-item>
        </a-breadcrumb>
        <a-modal v-model="add_task_visible" title="新增训练" @ok="finishAddTask">
            <a-form-model ref="dynamicValidateForm" :model="add_train">
                <a-form-model-item>
                    <label>模型类型</label>
                    <a-select default-value="DNN" style="margin-left: 10px;width: 50%" v-model="add_train.model">
                        <a-select-option value="DNN">
                            DNN
                        </a-select-option>
                        <a-select-option value="score">
                            打分卡
                        </a-select-option>
                        <a-select-option value="RNN">
                            时序神经网络
                        </a-select-option>
                        <a-select-option value="XGBoost">
                            XGBoost
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item v-if="add_train.model == 'DNN'">
                    <label>中间隐层的维度</label>
                    <a-input v-model="add_train.param" style="margin-left: 10px;width: 50%"/>
                </a-form-model-item>
                <a-form-model-item v-if="add_train.model == 'RNN'">
                    <label>中间层的数量</label>
                    <a-input v-model="add_train.param" style="margin-left: 10px;width: 50%"/>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <a-card>
            <a-button type="primary" style="float:right" @click="showAddTrain">新建任务</a-button>
            <a-layout-content :style="{marginTop:'5%'}">
                <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
                collapsed: false,
                taskList: [],
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
                selectedRowKeys: [],
                selectedTask: '',
                add_task_visible: false
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
            onSelectChange(selectedRowKeys) {
                if (selectedRowKeys.length > 1) {
                    this.selectedTask = selectedRowKeys[1];
                } else {
                    this.selectedTask = selectedRowKeys[0];
                }
                this.selectedRowKeys = [this.selectedTask];
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

            },
            showAddTask() {
                this.add_task_visible = true;
            }
        }
    };
</script>
