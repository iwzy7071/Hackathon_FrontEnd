<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
        <div class="stock-info-title">
          <a :href="companyLink" target="_blank" class="stock-info-name">{{name}}({{symbol}})</a>
        </div>
        <div class="table-operate">
          <a-button-group>
            <a-button v-if="page==1" disabled type="link">
              <a-icon type="left" />上一页
            </a-button>
            <a-button v-if="page==2" type="link" @click="page-=1">
              <a-icon type="left" />上一页
            </a-button>
            <a-button v-if="page==1" type="link" @click="page+=1"> 下一页
              <a-icon type="right" />
            </a-button>
            <a-button v-if="page==2" disabled type="link"> 下一页
              <a-icon type="right" />
            </a-button>
          </a-button-group>
        </div>
        <div class="stock-currency">
          <span>财报币种：人民币(CNY)</span>
        </div>
        <div class="tables">
          <a-table v-if="page==1" :columns="columns1" :data-source="data" bordered :pagination=false>
          </a-table>
          <a-table v-if="page==2" :columns="columns2" :data-source="data" bordered :pagination=false>
            <template slot="name" slot-scope="text">
              <a>{{ text }}</a>
            </template>
          </a-table>
        </div>
      </div>
    </a-layout-content>
  </a-layout>



</template>

<script>
  const columns1 = [{
      title: '报告期',
      dataIndex: 'title',
      width: '20%',
      align: 'center'
    },
    {
      title: '2019年报',
      dataIndex: '_2019',
      width: '16%',
      align: 'center'
    },
    {
      title: '2018年报',
      dataIndex: '_2018',
      width: '16%',
      align: 'center'
    },
    {
      title: '2017年报',
      dataIndex: '_2017',
      width: '16%',
      align: 'center'
    },
    {
      title: '2016年报',
      dataIndex: '_2016',
      width: '16%',
      align: 'center'
    },
    {
      title: '2015年报',
      dataIndex: '_2015',
      width: '16%',
      align: 'center'
    },
  ];
  const columns2 = [{
      title: '报告期',
      dataIndex: 'title',
      width: '20%',
      align: 'center'
    },
    {
      title: '2014年报',
      dataIndex: '_2014',
      width: '16%',
      align: 'center'
    },
    {
      title: '2013年报',
      dataIndex: '_2013',
      width: '16%',
      align: 'center'
    },
    {
      title: '2012年报',
      dataIndex: '_2012',
      width: '16%',
      align: 'center'
    },
    {
      title: '2011年报',
      dataIndex: '_2011',
      width: '16%',
      align: 'center'
    },
    {
      title: '2010年报',
      dataIndex: '_2010',
      width: '16%',
      align: 'center'
    },
  ];
  
  export default {
    data() {
      return {
        page: 1,
        columns1,
        columns2,
        data:[],
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
    mounted(){
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
        this.$api.Detail.Finance(param).then(res => {
          console.log(res);
          this.data = res.data.financeIndexList;
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

</style>