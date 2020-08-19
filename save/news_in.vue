<template>
    <a-layout id="components-layout-demo-top" class="layout">
        <a-layout-header>
            <div style="position: absolute;left: 48%; transform: translate(-50%, 0);">
                <a-select label-in-value style="width: 90px;" @change="onChange" :default-value="{ key: 'title' }">
                    <a-select-option v-for="item in Options" :key="item.value" :value="item.value">
                        {{item.label}}
                    </a-select-option>
                </a-select>
                <a-input-search placeholder="请输入需要查询的新闻标题或内容" style="width: 300px; padding-top:15.5px" enter-button
                    @search="onSearch" />
            </div>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
            <a-breadcrumb style="margin: 16px 0">
            </a-breadcrumb>
            <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
                <div style="padding-top:20px;" class="tables" v-for="(item,index) in Detail" v-bind:key="index">
                    <a-table :columns="item.columns" :data-source="item.data" :pagination="false">
                    </a-table>
                </div>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script>
    const Options = [{
            label: '标题',
            value: 'title',
        },
        {
            label: '内容',
            value: 'content',
        }
    ]
    export default {
        data() {
            return {
                Options,
                option: 'title',
                Detail: [],
                willAddColumn: [],
                willAddData: [],
            }
        },
        mounted(){
            this.onSearch('浙江')
        },
        methods: {
            onChange(val) {
                this.option = val.key
            },
            onSearch(value) {
                console.log(value)
                let param = new URLSearchParams();
                param.append('param', this.option);
                param.append('query', value)
                console.log(this.option, value)
                this.$api.News.Newsin(param).then(res => {
                    console.log(res.data)
                    this.Detail = []
                    var data = res.data.newsList
                    var i
                    for (i in data) {
                        this.willAddColumn = []
                        this.willAddColumn.push({
                            title: data[i].title,
                            dataIndex: data[i].title,
                            align: 'left'
                        })
                        this.willAddData = []
                        this.willAddData.push({
                            [data[i].title]: data[i].content
                        })
                        this.Detail.push({
                            columns:this.willAddColumn,
                            data:this.willAddData
                        })
                    }
                })
            }
        }
    }
</script>

<style>

</style>