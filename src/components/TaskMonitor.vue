<template>
    <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>训练列表</a-breadcrumb-item>
            <a-breadcrumb-item>任务详情</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
            <a-descriptions>
                <a-descriptions-item label="训练轮数">{{train.currentRound+`/`+train.totalRound}}</a-descriptions-item>
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
                metrics: [],
            };
        },
        mounted() {
            this.task = this.$route.query.data;
            this.getTaskDetail(this.task.id);
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
                    const data = item.metric;
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
            deletePower(record) {
                let index = this.powerList.indexOf(record);
                this.powerList.splice(index, 1);
            },
            deleteOrigin(record) {
                let index = this.originList.indexOf(record);
                this.originList.splice(index, 1);
            },
            uploadChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    this.$message.success(`${info.file.name} 文件上传成功。`);
                } else if (status === 'error') {
                    this.$message.error(`${info.file.name} 文件上传失败。`);
                }
            },
            finishLaunchTask() {
                let $this = this;
                this.launchTaskForm.validateFields((err, values) => {
                    if (!err) {
                        let param = new URLSearchParams();
                        param.append('name', values.name);
                        param.append('desc', values.desc);
                        $this.$api.TaskList.submitNewTask(param).then(function (response) {
                            let data = response.data;
                            let state = data.state;
                            let id = data.id;
                            if (state === true) {
                                $this.$message.info("创建任务" + id + "成功");
                            } else {
                                $this.$message.warning("创建任务" + id + "成功");
                            }
                        })
                        this.add_task_visible = false;
                        $this.reload();
                    }
                });
            },
        }
    };
</script>
