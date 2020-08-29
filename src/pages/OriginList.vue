<template>
    <a-layout style="padding: 0 24px 24px">
        <a-card style="margin-top: 5%;border-color: #e7f6ff">
            <a-breadcrumb>
                <a-breadcrumb-item>数据源列表</a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout-content>
                <a-spin :spinning="table_spinning">
                    <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                             :columns="originColumn"
                             rowKey="id"
                             style="margin-top: 15px"
                             :data-source="originList">
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
                        ellipsis: true,
                    },
                    {
                        title: '源描述',
                        dataIndex: 'desc',
                        key: 'desc',
                        ellipsis: true,
                    },
                    {
                        title: '源提供者',
                        dataIndex: 'provider',
                        key: 'provider',
                        ellipsis: true,
                    },
                    {
                        title: '源地址',
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
            this.getOriginList();
        },
        methods: {
            getOriginList() {
                let $this = this;
                let param = new URLSearchParams();
                $this.$api.OriginList.getOriginList(param).then(function (response) {
                    let data = response.data;
                    $this.originList = data;
                    $this.selectedRowKeys = $this.$store.getters.getOriginList;
                    $this.originList.sort(function (a, b) {
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
                this.$store.commit('setOriginList', selectedRows);
            },
        }
    };
</script>
