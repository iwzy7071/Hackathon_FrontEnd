<template>
    <a-layout style="padding: 0 24px 24px">
        <a-card style="margin-top: 5%;border-color: #e7f6ff">
            <a-breadcrumb>
                <a-breadcrumb-item>计算力列表</a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout-content>
                <a-spin :spinning="table_spinning">
                    <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                             :columns="powerColumn"
                             rowKey="id"
                             style="margin-top: 15px"
                             :data-source="powerList">
                    </a-table>
                </a-spin>
            </a-layout-content>
        </a-card>
    </a-layout>
</template>
<script>
    export default {
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
                        ellipsis: true,
                    },
                    {
                        title: '提供方',
                        dataIndex: 'provider',
                        key: 'provider',
                        ellipsis: true,
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
                ],
                selectedRowKeys: [],
                table_spinning: true,
            };
        },
        beforeMount() {
            this.getPowerList();
        },
        methods: {
            getPowerList() {
                let $this = this;
                let param = new URLSearchParams();
                $this.$api.powerList.getPowerList(param).then(function (response) {
                    let data = response.data;
                    $this.powerList = data;
                    $this.selectedRowKeys = $this.$store.getters.getPowerList;
                    $this.powerList.sort(function (a, b) {
                        if (a.id in $this.selectedRowKeys && b.id in $this.selectedRowKeys)
                            return a.id < b.id;
                        if (a.id in $this.selectedRowKeys)
                            return true;
                        if (b.id in $this.selectedRowKeys)
                            return false;
                        return a.id < b.id;
                    });
                    $this.table_spinning = false;
                });
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.$store.commit('setPowerList', selectedRows);
            },
        }
    };
</script>
