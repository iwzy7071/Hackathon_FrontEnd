<template>
    <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>训练列表</a-breadcrumb-item>
            <a-breadcrumb-item>任务详情</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
            <a-descriptions title="任务概览">
                <a-descriptions-item label="任务ID">{{task.id}}</a-descriptions-item>
                <a-descriptions-item label="任务名称">{{task.name}}</a-descriptions-item>
                <a-descriptions-item label="任务描述">{{task.desc}}</a-descriptions-item>
                <a-descriptions-item label="训练脚本描述"><a>123.py</a></a-descriptions-item>
                <a-descriptions-item label="训练轮数">{{train.currentRound+`/`+train.totalRound}}</a-descriptions-item>
                <a-descriptions-item label="训练用时">{{train.time}}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions title="损失值概览"></a-descriptions>
            <div id="lossGraph"></div>
            <a-descriptions title="评估值概览"></a-descriptions>
            <div id="metricGraph"></div>

        </a-layout-content>
    </a-layout>
</template>
<script>
    import {Chart} from '@antv/g2';

    export default {
        data() {
            return {
                collapsed: false,
                task: {},
                train: {},
                uploadHeader: '',
            };
        },
        mounted() {
            this.task = this.$route.query.data;
            this.getTaskDetail(this.task.id);
        },
        methods: {
            getTaskDetail(id) {
                let $this = this;
                let param = new URLSearchParams();
                param.append('id', id);
                $this.$api.TaskDetail.getTaskDetail(param).then(function (response) {
                    let data = response.data;
                    $this.train = data;
                    $this.showLossGraph();
                    $this.showMetricGraph();
                })
            },
            showLossGraph() {
                const data = this.train.loss;
                const chart = new Chart({
                    container: 'lossGraph',
                    autoFit: true,
                    width: 500,
                    height: 300,
                });
                chart.data(data);
                chart.tooltip({
                    showCrosshairs: true,
                    shared: true,
                });
                chart.line().position('round*loss');
                chart.point().position('round*loss');
                chart.render();
            },
            showMetricGraph() {
                const data = this.train.loss;
                const chart = new Chart({
                    container: 'metricGraph',
                    autoFit: true,
                    width: 300,
                    height: 300,
                });
                chart.data(data);
                chart.tooltip({
                    showCrosshairs: true,
                    shared: true,
                });
                chart.line().position('round*loss');
                chart.point().position('round*loss');
                chart.render();
            }
        }
    };
</script>
