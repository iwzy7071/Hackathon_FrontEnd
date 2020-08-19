<template>
    <a-layout id="components-layout-demo-top" class="layout">
        <a-layout-content style="padding: 0 50px">
            <a-breadcrumb style="margin: 16px 0">
            </a-breadcrumb>
            <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
                <div class="stock-info-title">
                    <a :href="companyLink" target="_blank" class="stock-info-name">{{name}}({{symbol}})</a>
                </div>
                <br />
                <div style="padding-top:20px;" class="tables">
                    <a-table :columns="columns" :data-source="data" bordered :pagination="false">
                    </a-table>
                </div>
            </div>
        </a-layout-content>
    </a-layout>



</template>

<script>
    export default {
        data() {
            return {
                Detail: [],
                companyLink: 'https://xueqiu.com/S/SZ000069',
                name: '华侨城A',
                symbol: 'SZ000069',
                data: [],
                columns: [{
                        title: '公告日期',
                        dataIndex: 'ann_date',
                        width: '1/3',
                        align: 'center'
                    },
                    {
                        title: '截止日期',
                        align: 'center',
                        dataIndex: 'end_date',
                        width: '1/3',
                    },
                    {
                        title: '股东人数',
                        dataIndex: 'holder_num',
                        width: '1/3',
                        align: 'center'
                    },

                ]
            }
        },
        created: function () {
            this.getParams();
        },
        watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            '$route': 'getParams'
        },
        mounted() {
            this.getTable();
        },
        methods: {
            getParams: function () {
                var params = this.$route.query;
                this.companyLink = params.companyLink;
                this.name = params.name;
                this.symbol = params.symbol;
            },
            getTable: function () {
                let param = new URLSearchParams();
                param.append('symbol', this.symbol);
                this.$api.Detail.Holdernum(param).then(res => {
                    this.data = res.data.HolderNumList;
                })
            }
        }
    }
</script>
<style scoped>
    html {
        box-sizing: border-box;
    }


    .stock-info-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        zoom: 1;
        line-height: 1;
        float: left;
        padding-top: 5px;
        padding-right: 1000px;
    }

    .stock-info-title .stock-info-name {
        font-size: 20px;
        color: #0055a2;
        font-weight: 700;
        float: left;
    }

    .stock-info-title .table-operate {
        float: right;
        line-height: 20px;
        margin-bottom: 10px;
    }

    .stock-currency {
        padding-top: 15px;
        float: left;
        line-height: 20px;
    }
</style>