<template>
    <a-layout id="components-layout-demo-top-side-2">
        <a-modal v-model="is_selection_visible" title="| 选择行业" @ok="confirmSelection" ok-text="确定" cancel-text="取消">
            <a-select :default-value="markets[0]" @change="handleSelectionChange" label-in-value style="width: 120px">
                <a-select-option v-for="(market, index) in markets" :key="index">
                    {{ market }}
                </a-select-option>
            </a-select>
        </a-modal>
        <a-layout-sider width="256px"  style="background: #fff">
            <a-menu
                    style="width: 256px"
                    :default-selected-keys="['2']"
                    mode="vertical"
            >
                <a-menu-item key="1" @click="$router.push('/')">
                    <a-icon type="plus-square" />
                    沪深一览
                </a-menu-item>
                <a-menu-item key="2" @click="handleChoice">
                    <a-icon type="database" theme="filled" />
                    基础分类
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-content
                    :style="{ background: '#fff', padding: '24px', margin: '24px 16px 0', minHeight: '280px' }"
            >
                <a-breadcrumb>
                    <a-breadcrumb-item>板块一览</a-breadcrumb-item>
                    <a-breadcrumb-item>{{this.markets[this.market_index]}}</a-breadcrumb-item>
                </a-breadcrumb>
                <br>
                <a-table :columns="columns" :data-source="stocks" :loading="loading" size="middle">
                    <a slot="tsCode" slot-scope="tsCode" @click="handleClick(tsCode)">{{tsCode}}</a>
                </a-table>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
    import VueCookies from "vue-cookies";

    export default {
        name: "homepage",
        data(){
            return {
                data: [],
                markets: [],
                indices: [],
                stocks: [],
                loading: false,
                is_selection_visible: false,
                chosen_market: null,
                market_index: null,
            }
        },
        mounted() {
            if(typeof this.$route.query.stocks[0] == "string"){
                this.markets = JSON.parse(localStorage.getItem('markets'));
                this.market_index = JSON.parse(localStorage.getItem('market_index'));
                this.stocks = JSON.parse(localStorage.getItem('stocks'));
            }
            else{
                this.stocks = this.$route.query.stocks;
                this.markets = this.$route.query.markets;
                this.market_index = this.$route.query.market_index;
                localStorage.setItem('stocks', JSON.stringify(this.stocks));
                localStorage.setItem('markets', JSON.stringify(this.markets));
                localStorage.setItem('market_index', JSON.stringify(this.market_index));
            }
        },
        computed:{
            columns() {
                const columns = [
                    {
                        title: '股票名称',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: '股票代码',
                        dataIndex: 'tsCode',
                        key: 'tsCode',
                        sorter: (a, b) => a.tsCode - b.tsCode,
                        sortDirections: ['ascend'],
                        slots: {title: 'tsCode'},
                        scopedSlots: { customRender: 'tsCode' },
                    },
                    {
                        title: '当前价',
                        dataIndex: 'currentPrice',
                        key: 'currentPrice',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.currentPrice - b.currentPrice,
                        sortDirections: ['descend', 'ascend'],
                    },
                    {
                        title: '昨日收盘价',
                        dataIndex: 'close',
                        key: 'close',
                        defaultSortOrder: 'descend',
                        sorter: (a, b) => a.close - b.close,
                        sortDirections: ['descend', 'ascend'],
                    },
                    {
                        title: '涨幅额',
                        dataIndex: 'change',
                        key: 'change',
                        sorter: (a, b) => a.change - b.change,
                        sortDirections: ['descend', 'ascend'],
                    },
                    {
                        title: '涨幅百分比',
                        dataIndex: 'pctChg',
                        key: 'pctChg',
                        sorter: (a, b) => a.pctChg - b.pctChg,
                        sortDirections: ['descend', 'ascend'],
                    },
                    {
                        title: '成交额',
                        dataIndex: 'amount',
                        key: 'amount',
                        sorter: (a, b) => a.amount - b.amount,
                        sortDirections: ['descend', 'ascend'],
                    },
                ];
                return columns;
            }
        },
        methods:{
            handleChoice(){
                this.is_selection_visible = true;
            },
            confirmSelection(){
                let $this = this;
                let param = new URLSearchParams();
                param.append('market_index', this.chosen_market);
                this.$api.Market.getMarketData(param).then(function (response) {
                    let data = response.data;
                    if(data.state == true){
                        $this.$router.push({
                            path: '/MarketStocks/' + $this.chosen_market,
                            query:{
                                stocks: data.stocks,
                                markets: $this.markets,
                                market_index: $this.chosen_market
                            }
                        });
                    }
                    else{
                        alert("数据加载错误！");
                    }
                })
            },
            handleSelectionChange(value){
                this.chosen_market = value.key;
            },
            handleClick(ts_code){
                let $this = this;
                let token = VueCookies.get('token');
                let param = new URLSearchParams();
                param.append('token', token);
                param.append('ts_code', ts_code);
                this.$api.Detail.BasicData(param).then(function (response) {
                    let data = response.data;
                    if(data.state == true){
                        $this.$router.push({
                            path: `/StockDetail/ + ${data.stocks.symbol}`,
                            query:{
                                data: data,
                            }
                        });
                    }
                    else{
                        alert("未找到该股票！");
                    }
                })
            }
        }
    }
</script>

<style scoped>


</style>