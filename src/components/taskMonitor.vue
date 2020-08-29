<template>
    <a-card style="border-color: #e7f6ff">
        <a-descriptions>
            <a-descriptions-item label="训练轮数">{{train.currentRound+`/`+train.totalRounds}}</a-descriptions-item>
            <a-descriptions-item label="训练用时">{{train.time}}</a-descriptions-item>
        </a-descriptions>
        <a-descriptions>
            <a-descriptions-item label="损失函数图">
                <div id="lossGraph"></div>
            </a-descriptions-item>
            <a-descriptions-item v-for="(item,index) in this.metrics" :key="index" :label="item.name">
                <div :id="item.name"></div>
            </a-descriptions-item>
        </a-descriptions>
    </a-card>
</template>
<script>
    import {Chart} from '@antv/g2';

    export default {
        data() {
            return {
                collapsed: false,
                task: {},
                train: {},
                metrics: [],
            };
        },
        mounted() {
            this.task = this.$route.query.data;
            console.log(this.task);
            this.getTaskDetail(this.task.task_id);
        },
        updated() {
            this.showMetricGraph();
        },
        methods: {
            getTaskDetail(id) {
                let $this = this;
                let param = new URLSearchParams();
                param.append('id', id);
                $this.$api.TaskDetail.getMonitor(param).then(function (response) {
                    let data = response.data;
                    $this.train = data;
                    $this.showLossGraph();
                    $this.metrics = $this.train.metrics;
                })
            },
            showLossGraph() {
                const data = this.train.loss;
                const chart = new Chart({
                    container: 'lossGraph',
                    autoFit: true,
                    width: 200,
                    height: 200,
                });
                chart.data(data);
                chart.scale({
                    round: {range: [0, 30],},
                    loss: {min: 0, max: 10, nice: true,},
                });
                chart.tooltip({
                    showCrosshairs: true,
                    shared: true,
                });
                chart.line().position('round*loss');
                chart.point().position('round*loss');
                chart.render();
            },
            showMetricGraph() {
                for (let index in this.metrics) {
                    let item = this.metrics[index];
                    const data = item.values;
                    const chart = new Chart({
                        container: item.name,
                        autoFit: true,
                        width: 200,
                        height: 200,
                    });
                    chart.data(data);
                    chart.scale({
                        round: {range: [0, 30],},
                        metric: {min: 0, max: 10, nice: true,},
                    });
                    chart.tooltip({
                        showCrosshairs: true,
                        shared: true,
                    });
                    chart.line().position('round*metric');
                    chart.point().position('round*metric');
                    chart.render();
                }
            },
            tabChange(key) {
                let $this = this;
                console.log(key);
                if (key === 1) {
                    $this.$router.replace({
                        path: `/taskDetail/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                } else if (key === 2) {
                    $this.$router.replace({
                        path: `/taskEditor/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                } else {
                    $this.$router.replace({
                        path: `/taskMonitor/ + ${$this.task.task_id}`,
                        query: {data: $this.task,}
                    });
                }
            },
        }
    };
</script>
