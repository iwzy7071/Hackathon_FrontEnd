<template>
    <a-card style="border-color: #e7f6ff">
        <a-skeleton active v-if="!isCreated"/>
        <a-descriptions id="info" v-show="isCreated && !isError">
            <a-descriptions-item label="训练轮数">{{train.currentRound}}/{{train.totalRounds}}</a-descriptions-item>
            <a-descriptions-item label="训练用时">{{train.time}}</a-descriptions-item>
        </a-descriptions>
        <a-descriptions v-show="isCreated&& !isError">
            <a-descriptions-item label="损失函数图" style="height: fit-content;width: fit-content">
            </a-descriptions-item>
        </a-descriptions>
        <div id="lossGraph"></div>
        <div v-for="(item,index) in this.train.metrics" :key="index">
            <a-descriptions>
                <a-descriptions-item :label="item.name">
                </a-descriptions-item>
            </a-descriptions>
            <div :id="item.name"></div>
        </div>
        <a-result status="404" title="暂无数据记录" sub-title="请刷新或稍后尝试" v-if="isCreated && isError"/>
    </a-card>
</template>
<script>
    import {Chart} from '@antv/g2';

    export default {
        data() {
            return {
                collapsed: false,
                train: {},
                metricGraphs: [],
                lossGraph: '',
                timer: '',
                isCreated: false,
                isGraphCreate: false,
                isError: false,
            };
        },
        beforeMount() {
            this.getTaskDetail();
            this.timer = setInterval(this.updateTaskDetail, 5000);
        },
        updated() {
            if (!this.isGraphCreated) {
                this.showMetricGraph();
                this.isGraphCreated = true;
            }
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
        methods: {
            updateTaskDetail() {
                let $this = this;
                if (!$this.isCreated) {
                    this.getTaskDetail();
                    return;
                }
                let param = new URLSearchParams();
                param.append('id', $this.$store.state.task.task_id);
                $this.$api.TaskDetail.getMonitor(param).then(function (response) {
                    let data = response.data;
                    $this.train = data;
                    $this.lossGraph.changeData(data.loss);
                    for (let index in data.metrics) {
                        let value = data.metrics[index].values;
                        $this.metricGraphs[index].changeData(value);
                    }
                });
            },
            getTaskDetail() {
                let $this = this;
                let param = new URLSearchParams();
                param.append('id', $this.$store.state.task.task_id);
                $this.$api.TaskDetail.getMonitor(param).then(function (response) {
                    if ($this.$store.state.axiosError === "404") {
                        $this.isCreated = true;
                        $this.isError = true;
                        clearInterval($this.timer);
                        return;
                    }
                    let data = response.data;
                    if (data.totalRounds !== undefined) {
                        $this.train = data;
                        $this.isCreated = true;
                        $this.showLossGraph();
                    }
                });
            },
            showLossGraph() {
                const data = this.train.loss;
                const chart = new Chart({
                    container: 'lossGraph',
                    autoFit: true,
                    width: 800,
                    height: 200,
                });
                this.lossGraph = chart;
                chart.data(data);
                chart.scale({
                    loss: {min: 0, max: 1, nice: true,},
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
                let $this = this;
                for (let index in $this.train.metrics) {
                    let item = $this.train.metrics[index];
                    const data = item.values;
                    const chart = new Chart({
                        container: item.name,
                        autoFit: true,
                        width: 800,
                        height: 200,
                    });
                    $this.metricGraphs.push(chart);
                    chart.data(data);
                    chart.scale({
                        value: {min: 0, max: 1, nice: true,},
                    });
                    chart.tooltip({
                        showCrosshairs: true,
                        shared: true,
                    });
                    chart.line().position('round*value');
                    chart.point().position('round*value');
                    chart.render();
                }
            },
        }
    };
</script>
