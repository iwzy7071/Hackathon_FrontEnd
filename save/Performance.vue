<template>
    <a-layout id="components-layout-demo-top" class="layout">
        <a-layout-content style="padding: 0 50px">
            <a-breadcrumb style="margin: 16px 0">
            </a-breadcrumb>
            <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
                <div class="stock-info-title">
                    <a :href="companyLink" target="_blank" class="stock-info-name">{{name}}({{symbol}})</a>
                </div>
                <div>
                    <p></p>
                </div>
                <div class="tables">
                    <a-table v-if="page==1" :columns="columns" :data-source="data" bordered :showHeader='false'
                             :pagination='false'>
                    </a-table>
                </div>
            </div>
        </a-layout-content>
    </a-layout>
</template>
<script>
    const columns = [{
        title: '名称',
        dataIndex: 'title',
        width: '20%',
        align: 'center'
    },
        {
            title: '内容',
            dataIndex: 'string',
            align: 'center'
        },
    ];
    export default {
        name: "Pledges",
        data() {
            return {
                page: 1,
                columns,
                data: [],
                companyLink: 'https://xueqiu.com/S/SZ000069',
                name: '华侨城A',
                symbol: 'SZ000069',
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
                param.append('ts_code', this.symbol);
                this.$api.OtherDetail.Performance(param).then(res => {
                    this.data = res.data.prediction;
                })
            }
        }
    }
</script>

<style scoped>
    html {
        box-sizing: border-box;
    }

    #components-layout-demo-top .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 24px 16px 0;
        float: left;
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

    .tables {
        padding-top: 30px;
    }

</style>