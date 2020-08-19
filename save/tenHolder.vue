<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <div class="stock-info-title">
          <a :href="companyLink" target="_blank" class="stock-info-name">{{name}}({{symbol}})</a>
        </div>
        <br/>
        <div style="padding-top:20px;" class="tables" v-for="(item,index) in Detail" v-bind:key="index">
          <a-table :columns="item.columns" :data-source="item.data" bordered :pagination="false">
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
        willAddData: [],
        willAddColumns: [{
            title: '截止日期',
            children: [{
              title: '股东名称',
              dataIndex: 'holder_name',
              width: '40%',
              align: 'left'
            }]
          },
          {
            title: '',
            align: 'right',
            children: [{
                title: '持股数量',
                dataIndex: 'hold_amount',
                width: '20%',
                align: 'right'
              },
              {
                title: '持股比例',
                dataIndex: 'hold_ratio',
                width: '20%',
                align: 'right'
              },
              {
                title: '较上期变化',
                dataIndex: 'last_change',
                width: '20%',
                align: 'right'
              },
            ]
          }
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
      async getTable() {
        var i
        for (i = 0; i < 10; i = i + 1) {
          var year = 2019 - i
          let param = new URLSearchParams();
          console.log('year:', year)
          param.append('symbol', this.symbol);
          param.append('year', year)
          await this.$api.Detail.Tenholder(param).then(res => {
            this.willAddColumns = [{
                title: '截止日期',
                children: [{
                  title: '股东名称',
                  dataIndex: 'holder_name',
                  width: '40%',
                  align: 'left'
                }]
              },
              {
                title: '',
                align: 'right',
                children: [{
                    title: '持股数量',
                    dataIndex: 'hold_amount',
                    width: '20%',
                    align: 'right'
                  },
                  {
                    title: '持股比例',
                    dataIndex: 'hold_ratio',
                    width: '20%',
                    align: 'right'
                  },
                  {
                    title: '较上期变化',
                    dataIndex: 'last_change',
                    width: '20%',
                    align: 'right'
                  },
                ]
              }
            ];
            this.willAddData = [];
            this.willAddData = res.data.holderList;
            console.log(res)
            this.willAddColumns[1].title = res.data.holderList[0].year + '年报';
            this.Detail.push({
              columns: this.willAddColumns,
              data: this.willAddData
            })
          })
        }
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