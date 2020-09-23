<template>
    <a-layout style="padding: 0 24px 24px">
        <a-card style="margin-top: 5%;border-color: #e7f6ff">
            <a-breadcrumb>
                <a-breadcrumb-item>数据源列表</a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout-content>
                <a-spin :spinning="table_spinning">
                    <a-table :columns="originColumn"
                             rowKey="id"
                             style="margin-top: 15px"
                             :data-source="originList">
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
                originList: [],
                originColumn: [
                    {
                        title: '源ID',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: '源名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '源描述',
                        dataIndex: 'desc',
                        key: 'desc',
                    },
                    {
                        title: '源提供者',
                        dataIndex: 'provider',
                        key: 'provider',
                    },
                    {
                        title: '源地址',
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
            this.getOriginList();
        },
        methods: {
            // 获取数据源列表
            getOriginList() {
                let $this = this;
                let param = new URLSearchParams();
                $this.$api.OriginList.getOriginList(param).then(function (response) {
                    let data = response.data;
                    $this.originList = data;
                    $this.table_spinning = false;
                });
            },
            // 添加数据源至列表
            addSelected(record) {
                let index = this.$store.state.originList.indexOf(record);
                if (index === -1) {
                    this.$store.state.originList.push(record);
                    this.$message.info("已添加数据源" + record.name + "至任务");
                }
            },
            // 从列表中移除数据源
            minusSelected(record) {
                let index = this.$store.state.originList.indexOf(record);
                if (index !== -1) {
                    this.$store.state.originList.splice(index, 1);
                    this.$message.info("已从任务中移除" + record.name + "数据源");
                }
            },
        }
    };
</script>
