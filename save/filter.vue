<template>
    <a-layout id="components-layout-demo-top-side">
        <a-layout-content style="padding: 0 50px">
            <a-breadcrumb style="margin: 16px 0">
            </a-breadcrumb>
            <a-layout style="padding: 24px 0; maxWidth:1000px; margin-left:14%; background: #fff">

                <a-layout-content :style="{ padding: '0 24px', minHeight: '280px'}">
                    <div class="selectRange"><b>选择范围</b></div>
                    <div class="Rangeselect">
                        <span>行业：</span>
                        <a-select label-in-value show-search option-filter-prop="children" style="width: 150px"
                            :filter-option="filterOption" @change="indusChange" :default-value="{ key: 'all' }">
                            <a-select-option v-for="item in indusOptions" :key="item.value" :value="item.value">
                                {{item.label}}
                            </a-select-option>
                        </a-select>
                        <span style="padding-left:20px">地域板块：</span>
                        <a-select label-in-value show-search option-filter-prop="children" style="width: 150px"
                            :filter-option="filterOption" @change="areaChange" :default-value="{ key: 'all' }">
                            <a-select-option v-for="item in areaOptions" :key="item.value" :value="item.value">
                                {{item.label}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div style="padding-top:20px; "><b>条件设置</b></div>
                    <div style="padding-left:50px; padding-top:20px;">
                        <a-checkbox-group :options="checkOptions" @change="onChange" />
                        <br />
                    </div>
                    <div style="padding-top:20px; font-size:14px">
                        <b>筛选条件</b>
                        <a-button type="link" @click="startScreen">
                            开始选股
                        </a-button>
                    </div>
                    <div class="conditiontables">
                        <a-table :columns="conditionColumns" :data-source="conditionData" :pagination='false'>
                            <a-slider slot="slider" slot-scope="text, record" :min="record.range[0]"
                                :max="record.range[1]" range :value="[record.minValue, record.maxValue]"
                                @change="sliderChange" />
                            <a-input-number slot="minNum" v-model="record.minValue" slot-scope="text, record"
                                :min="record.range[0]" :max="record.range[1]" />
                            <a-input-number slot="maxNum" v-model="record.maxValue" slot-scope="text, record"
                                :min="record.range[0]" :max="record.range[1]" />
                            <a-input-number
                                v-if="record.type==='or_yoy'|| record.type==='bps' || record.type==='roe' || record.type==='profit_to_gr'"
                                slot="year" v-model="record.year" slot-scope="text, record" :min="2010" :max="2020"
                                @change="yearChange(record.year,record.type)" />
                            <span slot="year" v-else>最新数据</span>
                        </a-table>
                    </div>
                    <div style="padding-top:20px">
                        <b>符合条件的股票{{numberOfStock}}支</b>
                    </div>
                    <div class="stocktables">
                        <a-table :columns="stockColumns" :data-source="stockData" :pagination='true'
                            :scroll="{x:stockColumns.length*130, y:1000}">
                            <span  slot="name" slot-scope="text, record">{{record.name}}({{record.ts_code}})</span>
                        </a-table>
                    </div>
                </a-layout-content>
                <a-layout-sider width="300" style="background: #fff; maxWidth:1000px;">
                    <div class="rankName"><b>股票排行榜</b></div>
                    <div class="rankSelect">
                        <a-select label-in-value show-search option-filter-prop="children" style="width: 300px"
                            :filter-option="filterOption" @change="optionChange" :default-value="{ key: 'pe_ttm' }">
                            <a-select-option v-for="item in rankOptions" :key="item.value" :value="item.value">
                                {{item.label}}
                            </a-select-option>
                        </a-select>
                    </div>
                    <div class="table-operate">
                        <a-button-group>
                            <a-button v-if="reverse==false" disabled type="link">
                                正序
                            </a-button>
                            <a-button v-if="reverse==true" type="link" @click="orderHandle">
                                正序
                            </a-button>
                            <a-button v-if="reverse==false" type="link" style="padding-left: 150px"
                                @click="reverseHandle">
                                倒序
                            </a-button>
                            <a-button v-if="reverse==true" disabled style="padding-left: 150px" type="link">
                                倒序
                            </a-button>
                        </a-button-group>
                    </div>
                    <div class="ranktables">
                        <a-table :columns="columns" :data-source="data" :pagination='false'>
                            <span  slot="name" slot-scope="text, record">{{record.name}}({{record.ts_code}})</span>
                        </a-table>
                    </div>
                </a-layout-sider>
            </a-layout>
        </a-layout-content>
    </a-layout>
</template>



<script>
    const rankOptions = [{
            label: '市盈率',
            value: 'pe_ttm',
        },
        {
            label: '每股收益',
            value: 'eps',
        },
        {
            label: '每股净资产',
            value: 'bps',
        },
        {
            label: '净资产收益率',
            value: 'roe',
        },
        {
            label: '净利润同比增长',
            value: 'netprofit_yoy',
        },
        {
            label: '市盈率LYR',
            value: 'pe',
        },
        {
            label: '净利润',
            value: 'profit_to_gr',
        },
        {
            label: '股息收益率',
            value: 'dv_ratio',
        },
        {
            label: '市销率',
            value: 'ps',
        },
        {
            label: '总市值',
            value: 'total_mv',
        },
        {
            label: '营业收入同比增长',
            value: 'or_yoy',
        },
        {
            label: '营业收入',
            value: 'profit_to_op',
        },
        {
            label: '市净率MRQ',
            value: 'pb',
        },
        {
            label: '总资产报酬率',
            value: 'roa',
        },
        {
            label: '流通市值',
            value: 'circ_mv',
        },
    ];
    const areaOptions = [{
            label: '全部地区',
            value: 'all',
        },

        {
            label: '安徽',
            value: '安徽',
        },
        {
            label: '北京',
            value: '北京',
        },
        {
            label: '福建',
            value: '福建',
        },
        {
            label: '甘肃',
            value: '甘肃',
        },
        {
            label: '广东',
            value: '广东',
        },
        {
            label: '广西',
            value: '广西',
        },
        {
            label: '贵州',
            value: '贵州',
        },
        {
            label: '海南',
            value: '海南',
        },
        {
            label: '河北',
            value: '河北',
        },
        {
            label: '河南',
            value: '河南',
        },
        {
            label: '黑龙江',
            value: '黑龙江',
        },
        {
            label: '湖北',
            value: '湖北',
        },
        {
            label: '湖南',
            value: '湖南',
        },
        {
            label: '吉林',
            value: '吉林',
        },
        {
            label: '江苏',
            value: '江苏',
        },
        {
            label: '江西',
            value: '江西',
        },
        {
            label: '辽宁',
            value: '辽宁',
        },
        {
            label: '内蒙',
            value: '内蒙',
        },
        {
            label: '宁夏',
            value: '宁夏',
        },
        {
            label: '青海',
            value: '青海',
        },
        {
            label: '山东',
            value: '山东',
        },
        {
            label: '山西',
            value: '山西',
        },
        {
            label: '陕西',
            value: '陕西',
        },
        {
            label: '上海',
            value: '上海',
        },
        {
            label: '深圳',
            value: '深圳',
        },
        {
            label: '四川',
            value: '四川',
        },
        {
            label: '天津',
            value: '天津',
        },
        {
            label: '西藏',
            value: '西藏',
        },
        {
            label: '新疆',
            value: '新疆',
        },
        {
            label: '云南',
            value: '云南',
        },
        {
            label: '浙江',
            value: '浙江',
        },
        {
            label: '重庆',
            value: '重庆',
        },
    ];
    const indusOptions = [{
            label: '全部行业',
            value: 'all',
        },

        {
            label: 'IT设备',
            value: 'IT设备',
        },
        {
            label: '白酒',
            value: '白酒',
        },
        {
            label: '百货',
            value: '百货',
        },
        {
            label: '半导体',
            value: '半导体',
        },
        {
            label: '保险',
            value: '保险',
        },
        {
            label: '玻璃',
            value: '玻璃',
        },
        {
            label: '仓储物流',
            value: '仓储物流',
        },
        {
            label: '超市连锁',
            value: '超市连锁',
        },
        {
            label: '出版业',
            value: '出版业',
        },
        {
            label: '船舶',
            value: '船舶',
        },
        {
            label: '电气设备',
            value: '电气设备',
        },
        {
            label: '电器连锁',
            value: '电器连锁',
        },
        {
            label: '电器仪表',
            value: '电器仪表',
        },
        {
            label: '电信运营',
            value: '电信运营',
        },
        {
            label: '多元金融',
            value: '多元金融',
        },
        {
            label: '房产服务',
            value: '房产服务',
        },
        {
            label: '纺织',
            value: '纺织',
        },
        {
            label: '纺织机械',
            value: '纺织机械',
        },
        {
            label: '服饰',
            value: '服饰',
        },
        {
            label: '钢加工',
            value: '钢加工',
        },
        {
            label: '港口',
            value: '港口',
        },
        {
            label: '工程机械',
            value: '工程机械',
        },
        {
            label: '公共交通',
            value: '公共交通',
        },
        {
            label: '公路',
            value: '公路',
        },
        {
            label: '供气供热',
            value: '供气供热',
        },
        {
            label: '广告包装',
            value: '广告包装',
        },
        {
            label: '航空',
            value: '航空',
        },
        {
            label: '红黄酒',
            value: '红黄酒',
        },
        {
            label: '互联网',
            value: '互联网',
        },
        {
            label: '化工机械',
            value: '化工机械',
        },
        {
            label: '化工原料',
            value: '化工原料',
        },
        {
            label: '化纤',
            value: '化纤',
        },
        {
            label: '化学制药',
            value: '化学制药',
        },
        {
            label: '环境保护',
            value: '环境保护',
        },
        {
            label: '黄金',
            value: '黄金',
        },
        {
            label: '火力发电',
            value: '火力发电',
        },
        {
            label: '机场',
            value: '机场',
        },
        {
            label: '机床制造',
            value: '机床制造',
        },
        {
            label: '机械基件',
            value: '机械基件',
        },
        {
            label: '家居用品',
            value: '家居用品',
        },
        {
            label: '家用电器',
            value: '家用电器',
        },
        {
            label: '建筑工程',
            value: '建筑工程',
        },
        {
            label: '焦炭加工',
            value: '焦炭加工',
        },
        {
            label: '酒店餐饮',
            value: '酒店餐饮',
        },
        {
            label: '空运',
            value: '空运',
        },
        {
            label: '矿物制品',
            value: '矿物制品',
        },
        {
            label: '林业',
            value: '林业',
        },
        {
            label: '路桥',
            value: '路桥',
        },
        {
            label: '旅游服务',
            value: '旅游服务',
        },
        {
            label: '旅游景点',
            value: '旅游景点',
        },
        {
            label: '铝',
            value: '铝',
        },
        {
            label: '煤炭开采',
            value: '煤炭开采',
        },
        {
            label: '摩托车',
            value: '摩托车',
        },
        {
            label: '农药化肥',
            value: '农药化肥',
        },
        {
            label: '农业综合',
            value: '农业综合',
        },
        {
            label: '农用机械',
            value: '农用机械',
        },
        {
            label: '批发业',
            value: '批发业',
        },
        {
            label: '啤酒',
            value: '啤酒',
        },
        {
            label: '普钢',
            value: '普钢',
        },
        {
            label: '其他建材',
            value: '其他建材',
        },
        {
            label: '其他商业',
            value: '其他商业',
        },
        {
            label: '汽车服务',
            value: '汽车服务',
        },
        {
            label: '汽车配件',
            value: '汽车配件',
        },
        {
            label: '汽车整车',
            value: '汽车整车',
        },
        {
            label: '铅锌',
            value: '铅锌',
        },
        {
            label: '轻工机械',
            value: '轻工机械',
        },
        {
            label: '区域地产',
            value: '区域地产',
        },
        {
            label: '全国地产',
            value: '全国地产',
        },
        {
            label: '染料涂料',
            value: '染料涂料',
        },
        {
            label: '日用化工',
            value: '日用化工',
        },
        {
            label: '乳制品',
            value: '乳制品',
        },
        {
            label: '软件服务',
            value: '软件服务',
        },
        {
            label: '软饮料',
            value: '软饮料',
        },
        {
            label: '商贸代理',
            value: '商贸代理',
        },
        {
            label: '商品城',
            value: '商品城',
        },
        {
            label: '生物制药',
            value: '生物制药',
        },
        {
            label: '石油加工',
            value: '石油加工',
        },
        {
            label: '石油开采',
            value: '石油开采',
        },
        {
            label: '石油贸易',
            value: '石油贸易',
        },
        {
            label: '食品',
            value: '食品',
        },
        {
            label: '水力发电',
            value: '水力发电',
        },
        {
            label: '水泥',
            value: '水泥',
        },
        {
            label: '水务',
            value: '水务',
        },
        {
            label: '水运',
            value: '水运',
        },
        {
            label: '饲料',
            value: '饲料',
        },
        {
            label: '塑料',
            value: '塑料',
        },
        {
            label: '陶瓷',
            value: '陶瓷',
        },
        {
            label: '特种钢',
            value: '特种钢',
        },
        {
            label: '铁路',
            value: '铁路',
        },
        {
            label: '通信设备',
            value: '通信设备',
        },
        {
            label: '铜',
            value: '铜',
        },
        {
            label: '文教休闲',
            value: '文教休闲',
        },
        {
            label: '橡胶',
            value: '橡胶',
        },
        {
            label: '小金属',
            value: '小金属',
        },
        {
            label: '新型电力',
            value: '新型电力',
        },
        {
            label: '医疗保健',
            value: '医疗保健',
        },
        {
            label: '医药商业',
            value: '医药商业',
        },
        {
            label: '银行',
            value: '银行',
        },
        {
            label: '影视音像',
            value: '影视音像',
        },
        {
            label: '渔业',
            value: '渔业',
        },
        {
            label: '元器件',
            value: '元器件',
        },
        {
            label: '园区开发',
            value: '园区开发',
        },
        {
            label: '运输设备',
            value: '运输设备',
        },
        {
            label: '造纸',
            value: '造纸',
        },
        {
            label: '证券',
            value: '证券',
        },
        {
            label: '中成药',
            value: '中成药',
        },
        {
            label: '种植业',
            value: '种植业',
        },
        {
            label: '专用机械',
            value: '专用机械',
        },
        {
            label: '装修装饰',
            value: '装修装饰',
        },
        {
            label: '综合类',
            value: '综合类',
        },

    ];
    const checkOptions = [{
            label: '市盈率',
            value: `pe_ttm:市盈率`,
        },
        {
            label: '每股收益',
            value: `eps:每股收益`,
        },
        {
            label: '每股净资产',
            value: `bps:每股净资产`,
        },
        {
            label: '净资产收益率',
            value: `roe:净资产收益率`,
        },
        {
            label: '净利润同比增长',
            value: `netprofit_yoy:净利润同比增长`,
        },
        {
            label: '市盈率LYR',
            value: `pe:市盈率LYR`,
        },
        {
            label: '净利润',
            value: `profit_to_gr:净利润`,
        },
        {
            label: '股息收益率',
            value: `dv_ratio:股息收益率`,
        },
        {
            label: '市销率',
            value: `ps:市销率`,
        },
        {
            label: '总市值',
            value: `total_mv:总市值`,
        },
        {
            label: '营业收入同比增长',
            value: `or_yoy:营业收入同比增长`,
        },
        {
            label: '营业收入',
            value: `profit_to_op:营业收入`,
        },
        {
            label: '市净率MRQ',
            value: `pb:市净率MRQ`,
        },
        {
            label: '总资产报酬率',
            value: `roa:总资产报酬率`,
        },
        {
            label: '流通市值',
            value: `circ_mv:流通市值`,
        },
    ];
    export default {
        data() {
            return {
                reverse: false,
                rankValue: {
                    key: 'pe_ttm',
                    label: '市盈率'
                },
                rankOptions,
                areaOptions,
                indusOptions,
                checkOptions,
                columns: [{
                        title: '股票',
                        dataIndex: 'name',
                        width: '36%',
                        align: 'center',
                        scopedSlots: {
                            customRender: 'name'
                        }
                    },
                    {
                        title: '当前价',
                        dataIndex: 'close',
                        width: '35%',
                        align: 'center'
                    },

                    {
                        title: '',
                        dataIndex: 'value',
                        width: '35%',
                        align: 'center'
                    },
                ],
                conditionColumns: [{
                        title: '条件',
                        dataIndex: 'condition',
                        width: '20%',
                        align: 'center',
                    },
                    {
                        title: '最小值',
                        dataIndex: 'minValue',
                        width: '18%',
                        align: 'center',
                        scopedSlots: {
                            customRender: 'minNum'
                        }
                    },
                    {
                        title: '条件范围',
                        dataIndex: 'range',
                        width: '26%',
                        align: 'center',
                        scopedSlots: {
                            customRender: 'slider'
                        }
                    },
                    {
                        title: '最大值',
                        dataIndex: 'maxValue',
                        width: '18%',
                        align: 'center',
                        scopedSlots: {
                            customRender: 'maxNum'
                        }
                    },
                    {
                        title: '日期(年)',
                        dataIndex: 'year',
                        width: '18%',
                        align: 'center',
                        scopedSlots: {
                            customRender: 'year'
                        }
                    },
                ],
                data: [],
                conditionData: [],
                area: 'all',
                industry: 'all',
                willAddCondition: {
                    type: '',
                    condition: '',
                    minValue: -1,
                    maxValue: 1,
                    year: 2020,
                    range: [],
                },
                numberOfStock: 0,
                stockColumns : [{
                    title: '股票',
                    dataIndex: 'name',
                    width: '20%',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'name'
                    },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.name.length - b.name.length,
                },
                {
                    title: '当前价',
                    dataIndex: 'close',
                    align: 'center',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.close - b.close,
                },
                {
                    title: '当日涨跌幅(%)',
                    dataIndex: 'pct_chg',
                    align: 'center',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.pct_chg - b.pct_chg,
                }],
                stockData: [],
            }
        },
        mounted() {
            this.columns[2].title = this.rankValue.label
            this.getRank()
        },

        methods: {
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            optionChange(value) {
                this.rankValue = value;
                this.columns[2].title = this.rankValue.label;
                if (this.rankValue.key === "netprofit_yoy" || this.rankValue.key === "roe" || this.rankValue.key === "dv_ratio" || this.rankValue.key === "or_yoy" || this.rankValue.key === "roa"){
                    this.columns[2].title += "(%)";
                }
                else if(this.rankValue.key === "profit_to_op" || this.rankValue.key === "profit_to_gr"){
                    this.columns[2].title += "(亿)";
                }
                else if(this.rankValue.key === "total_mv" || this.rankValue.key === "circ_mv"){
                    this.columns[2].title += "(万元)";
                }
                this.getRank()
            },
            areaChange(value) {
                this.area = value.key
            },
            indusChange(value) {
                this.industry = value.key
            },
            orderHandle() {
                this.reverse = false
                this.getRank()
            },
            reverseHandle() {
                this.reverse = true
                this.getRank()
            },
            getRank() {
                let param = new URLSearchParams();
                param.append('type', this.rankValue.key);
                param.append('reverse', this.reverse);
                this.$api.Filter.Rank(param).then(res => {
                    console.log(res)
                    this.data = res.data.rankedObjectList;
                })
            },
            async onChange(val) {
                this.conditionData = []
                var i
                for (i in val) {
                    await this.getCondition(val[i]);
                }
            },
            yearChange(year, type) {
                var i
                for (i in this.conditionData) {
                    if (this.conditionData[i].type != type) {
                        continue
                    } else {
                        let param = new URLSearchParams();
                        param.append('type', type);
                        param.append('year', year);
                        this.$api.Filter.Condition(param).then(res => {
                            this.conditionData[i].minValue = res.data.minValue;
                            this.conditionData[i].maxValue = res.data.maxValue;
                            this.conditionData[i].range = [];
                            this.conditionData[i].range.push(res.data.minValue);
                            this.conditionData[i].range.push(res.data.maxValue);
                        });
                        break;
                    }
                }
            },
            getCondition(val) {
                var value = val.split(':')[0]
                var label = val.split(':')[1]
                let param = new URLSearchParams();
                param.append('type', value);
                param.append('year', 2020);
                this.$api.Filter.Condition(param).then(res => {
                    console.log(value)
                    console.log('res:', res)
                    this.willAddCondition.condition = label;
                    this.willAddCondition.type = value;
                    this.willAddCondition.year = 2020;
                    var min = res.data.minValue;
                    var max = res.data.maxValue;
                    this.willAddCondition.minValue = min;
                    this.willAddCondition.maxValue = max;
                    this.willAddCondition.range.push(min);
                    this.willAddCondition.range.push(max);
                    this.conditionData.push(this.willAddCondition);
                    this.willAddCondition = {
                        type: '',
                        condition: '',
                        minValue: -1,
                        maxValue: 1,
                        year: 2020,
                        range: [],
                    };

                })

            },
            sliderChange(value) {
                var i
                for (i in this.conditionData) {
                    if (Math.round(this.conditionData[i].minValue) === value[0] || Math.round(this.conditionData[i]
                            .maxValue) === value[1]) {
                        this.conditionData[i].minValue = value[0]
                        this.conditionData[i].maxValue = value[1]
                    }
                }
            },
            startScreen() {
                this.getStock()
            },
            getStock() {
                let $this = this
                let param = new URLSearchParams();
                param.append('conditionList', JSON.stringify($this.conditionData));
                param.append('industry', $this.industry);
                param.append('area', $this.area);
                    $this.$api.Filter.Screen(param).then(res => {                   
                    $this.stockData = res.data.stockList
                    $this.numberOfStock = $this.stockData.length
                })
            }
        }
    }
</script>

<style>
    #components-layout-demo-top-side .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 28px 16px 0;
        float: left;
    }

    .rankSelect {
        padding-top: 5px;
    }

    .rankName {
        font-size: 20px;
    }

    .selectRange {
        padding-top: 3px;
        font-size: 18px;
        padding-right: 50px;
        float: left
    }

    .Rangeselect {
        float: center
    }

    .ant-checkbox-group label {
        width: 190px;
        line-height: 30px;
        display: inline-block;
    }
</style>