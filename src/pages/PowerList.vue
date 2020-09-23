<template>
    <a-layout style="padding: 0 24px 24px">
        <a-card style="margin-top: 5%;border-color: #e7f6ff">
            <a-breadcrumb>
                <a-breadcrumb-item>计算力列表</a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout-content>
                <a-spin :spinning="table_spinning">
                    <a-table :columns="powerColumn"
                             rowKey="id"
                             style="margin-top: 15px"
                             :data-source="powerList">
                        <div slot="action" href="javascript:" slot-scope="record">
                            <a-button type="dashed" @click="addSelected(record)" icon="plus"
                                      style="margin-right: 5%"/>
                            <a-button type="dashed" @click="minusSelected(record)" icon="minus"/>
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
        data() {
            return {
                powerList: [],
                powerColumn: [
                    {
                        title: 'ID',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: '设备',
                        dataIndex: 'device',
                        key: 'device',
                    },
                    {
                        title: '提供方',
                        dataIndex: 'provider',
                        key: 'provider',
                    },
                    {
                        title: '描述',
                        dataIndex: 'desc',
                        key: 'desc',
                    },
                    {
                        title: '地址',
                        dataIndex: 'addr',
                        key: 'addr',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: {customRender: 'action'},
                    },
                ],
                table_spinning: true,
            };
        },
        beforeMount() {
            this.getPowerList();
        },
        methods: {
            // 获取计算力列表
            getPowerList() {
                let $this = this;
                let param = new URLSearchParams();
                $this.$api.powerList.getPowerList(param).then(function (response) {
                    let data = response.data;
                    $this.powerList = data;
                    $this.table_spinning = false;
                });
            },
            // 添加计算力至列表
            addSelected(record) {
                let index = this.$store.state.powerList.indexOf(record);
                if (index === -1) {
                    this.$store.state.powerList.push(record);
                    this.$message.info("已添加计算力" + record.device + "至任务");
                }
            },
            // 从列表中移除计算力
            minusSelected(record) {
                let index = this.$store.state.powerList.indexOf(record);
                if (index !== -1) {
                    this.$store.state.powerList.splice(index, 1);
                    this.$message.info("已从任务中移除" + record.device + "计算力");
                }
            },
        }
    };
</script>
