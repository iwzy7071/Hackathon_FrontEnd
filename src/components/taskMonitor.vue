<template>
    <a-card style="border-color: #e7f6ff">
        <a-skeleton active v-if="isCreated"/>
        <a-descriptions id="info" v-show="!isCreated">
            <a-descriptions-item label="训练轮数"></a-descriptions-item>
            <a-descriptions-item label="训练用时"></a-descriptions-item>
        </a-descriptions>
        <a-descriptions v-show="!isCreated">
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
                metricGraphs: [],
                lossGraph: '',
                timer: '',
                isCreated: true
            };
        },
        beforeMount() {
            this.task = this.$store.getters.getTask;
            this.getTaskDetail(this.task.task_id);
            this.timer = setInterval(this.updateTaskDetail, 5000);
        },
        updated() {
            this.showMetricGraph();
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
        methods: {
            // 更新任务状态
            updateTaskDetail() {
                let $this = this;
                let param = new URLSearchParams();
                param.append('id', this.task.task_id);
                $this.$api.TaskDetail.getMonitor(param).then(function (response) {
                    let data = response.data;
                    $this.lossGraph.changeData(data.loss);
                    for (let index in data.metrics) {
                        let value = data.metrics[index].values;
                        $this.metricGraphs[index].changeData(value);
                    }
                    $this.rectifyInfo(data.currentRound, data.totalRounds, data.time);
                });
            },
            //获得任务初始数据并绘图
            getTaskDetail(id) {
                let $this = this;
                let param = new URLSearchParams();
                param.append('id', id);
                $this.$api.TaskDetail.getMonitor(param).then(function (response) {
                    $this.isCreated = false;
                    let data = response.data;
                    $this.train = data;
                    $this.showLossGraph();
                    $this.rectifyInfo(data.currentRound, data.totalRounds, data.time);
                });
            },
            //更新当前轮数和用时
            rectifyInfo(currentRound, totalRounds, time) {
                let element = document.getElementById('info').getElementsByClassName('ant-descriptions-item-content');
                let element1 = element.item(0);
                let element2 = element.item(1);
                element1.innerHTML = currentRound + "/" + totalRounds;
                element2.innerHTML = time;
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
