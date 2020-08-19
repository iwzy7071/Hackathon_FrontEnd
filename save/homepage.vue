<template>
    <a-layout id="components-layout-demo-top-side-2">
        <a-modal v-model="is_selection_visible" title="| 选择行业" @ok="confirmSelection" ok-text="确定" cancel-text="取消">
            <a-select :default-value="markets[0]" @change="handleSelectionChange" label-in-value style="width: 120px">
                <a-select-option v-for="(market, index) in markets" :key="index">
                    {{ market }}
                </a-select-option>
            </a-select>
        </a-modal>
        <a-layout-sider width="256px" style="background: #fff">
            <a-menu
                    style="width: 256px"
                    :default-selected-keys="['1']"
                    mode="vertical"
            >
                <a-menu-item key="1">
                    <a-icon type="plus-square"/>
                    沪深一览
                </a-menu-item>
                <a-menu-item key="2" @click="handleChoice">
                    <a-icon type="database" theme="filled"/>
                    基础分类
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-content
                    :style="{ background: '#fff', padding: '24px', margin: '24px 16px 0', minHeight: '280px' }"
            >
                <div class="font"><b>市场一览</b></div>
                <div :style="{color: '#4682B4'}"><b>沪深300</b></div>
                <div :style="{fontSize: 'xx-large'}" v-if="this.indices != null"><b>￥{{parseFloat(indices[indices.length
                    - 1].price).toFixed(2)}}</b></div>
                <div v-else>
                    <a-empty></a-empty>
                </div>
                <div id="container" :style="{marginTop: '20px'}"></div>
                <div class="font" :style="{marginTop:'40px'}"><b>股票一览</b></div>
                <a-table
                        :columns="columns"
                        :data-source="stocks"
                        :pagination="pagination"
                        :loading="loading"
                        size="middle"
                >
                    <a slot="tsCode" slot-scope="tsCode" @click="handleClick(tsCode)">{{tsCode}}</a>
                </a-table>
            </a-layout-content>
        </a-layout>
    </a-layout>

</template>

<script>
    import {Chart} from '@antv/g2';
    import VueCookies from "vue-cookies";

    const columns = [
        {
            title: '股票名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '股票代码',
            dataIndex: 'tsCode',
            slots: {title: 'tsCode'},
            scopedSlots: {customRender: 'tsCode'},
        },
        {
            title: '当前价',
            dataIndex: 'currentPrice',
        },
        {
            title: '昨日收盘价',
            dataIndex: 'close',
        },
        {
            title: '涨幅额',
            dataIndex: 'change',
        },
        {
            title: '涨幅百分比',
            dataIndex: 'pctChg',
        },
        {
            title: '成交额',
            dataIndex: 'amount',
        },
    ];
    export default {
        name: "homepage",
        data() {
            return {
                data: [],
                markets: [],
                indices: null,
                stocks: [],
                columns,
                pagination: {pageSize: 149,},
                loading: true,
                is_selection_visible: false,
                market_index: null,
                is_painted: false
            }
        },
        mounted() {
            this.getStocks();
        },
        updated() {
            if (this.is_painted == false && this.indices != null) {
                const data = this.indices;

                const chart = new Chart({
                    container: 'container',
                    autoFit: true,
                    width: 550,
                    height: 300,
                });

                chart.data(data);
                chart.scale({
                    dtime: {
                        range: [0, 1],
                    },
                    price: {
                        min: 4740,
                        max: 4830,
                        nice: true,
                    },
                });

                chart.tooltip({
                    showCrosshairs: true, // 展示 Tooltip 辅助线
                    shared: true,
                });

                chart.line().position('dtime*price');
                chart.point().position('dtime*price');

                chart.render();
                this.is_painted = true;
            }
        },
        methods: {
            getStocks() {
                let $this = this;
                let param = new URLSearchParams();
                this.$api.TaskList.getTaskList(param).then(function (response) {
                    let data = response.data;
                    console.log(data);
                })
            },
            handleChoice() {
                this.is_selection_visible = true;
            },
            confirmSelection() {
                let $this = this;
                let param = new URLSearchParams();
                param.append('market_index', this.market_index);
                this.$api.Market.getMarketData(param).then(function (response) {
                    let data = response.data;
                    if (data.state == true) {
                        $this.$router.push({
                            path: '/MarketStocks/' + $this.market_index,
                            query: {
                                stocks: data.stocks,
                                markets: $this.markets,
                                market_index: $this.market_index
                            }
                        });
                    } else {
                        alert("数据加载错误！");
                    }
                })
            },
            handleSelectionChange(value) {
                this.market_index = value.key;
            },
            handleClick(ts_code) {
                let $this = this;
                let token = VueCookies.get('token');
                let param = new URLSearchParams();
                param.append('token', token);
                param.append('ts_code', ts_code);
                this.$api.Detail.BasicData(param).then(function (response) {
                    let data = response.data;
                    if (data.state == true) {
                        $this.$router.push({
                            path: `/StockDetail/ + ${data.stocks.symbol}`,
                            query: {
                                data: data,
                            }
                        });
                    } else {
                        alert("未找到该股票！");
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .font {
        font-size: large;
        vertical-align: bottom;
        border-bottom: thin solid black;
    }

</style>
