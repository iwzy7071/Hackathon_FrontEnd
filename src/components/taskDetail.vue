<template>
    <a-layout>
        <a-skeleton active v-if="spinning"/>
        <h4 v-if="!spinning">任务简介</h4>
        <a-card style="border-color: #e7f6ff;margin-top: 1%" v-if="!spinning">
            <a-descriptions>
                <a-descriptions-item label="任务ID">{{this.$store.state.task.task_id}}</a-descriptions-item>
                <a-descriptions-item v-if="this.$store.state.task.status === 0" label="状态">未开始</a-descriptions-item>
                <a-descriptions-item v-if="this.$store.state.task.status === 1" label="状态">进行中</a-descriptions-item>
                <a-descriptions-item v-if="this.$store.state.task.status === 2" label="状态">已完成</a-descriptions-item>
                <a-descriptions-item v-if="this.$store.state.task.status === 3" label="状态">已终止</a-descriptions-item>
                <a-descriptions-item label="开始时间">{{this.$store.state.task.start_time}}</a-descriptions-item>
                <a-descriptions-item label="任务名称">{{this.$store.state.task.name}}</a-descriptions-item>
                <a-descriptions-item label="数据源数量">{{this.$store.state.originList.length}}</a-descriptions-item>
                <a-descriptions-item label="完成时间">{{this.$store.state.task.finish_time}}</a-descriptions-item>
                <a-descriptions-item label="任务描述">{{this.$store.state.task.desc}}</a-descriptions-item>
                <a-descriptions-item label="计算力数量">{{this.$store.state.powerList.length}}</a-descriptions-item>
                <a-descriptions-item label="总时长">{{this.$store.state.task.total_time}}</a-descriptions-item>
            </a-descriptions>
        </a-card>
        <h4 v-if="!spinning" style="margin-top: 1%">任务输出</h4>
        <a-card style="border-color: #e7f6ff;margin-top: 1%;height: 400px" v-if="!spinning">
            <h4>Main Graph</h4>
            <h5 style="color: lightgray">click compoent to view details</h5>
            <a-steps direction="vertical" :current="1" style="margin: 0 auto;width: fit-content" size="small">
                <a-step :status="step.status" v-for="step in progressList" :key="step.index">
                    <a-icon slot="icon" type="check-circle"
                            style="color:lightblue"
                            v-if="step.status === 'finish'"/>
                    <a-button slot="title"
                              v-if="step.title !== '上传模型训练脚本'"
                              @click="progressButton(step.index)"
                              :style="{width:'300px',backgroundColor:step.status==='wait' ?'lightgray':'lightgreen'}">
                        {{step.title}}
                    </a-button>
                    <a-progress slot="subTitle" :stroke-color="{from: '#108ee9',to: '#87d068',}" :percent="50"
                                status="active" v-if="step.title === '模型训练中'"/>
                    <a-upload slot="title" v-if="step.title === '上传模型训练脚本'" :customRequest="uploadFile"
                              :show-upload-list="false">
                        <a-button
                                :style="{width:'300px',backgroundColor:'lightgray'}">
                            {{step.title}}
                        </a-button>
                    </a-upload>
                    <a-select slot="subTitle" :dropdownMatchSelectWidth="false" :value="[]"
                              @change="addProgressButton"
                              v-if="step.index === -1">
                        <a-select-option value="intersection">
                            求交集
                        </a-select-option>
                        <a-select-option value="train">
                            模型训练
                        </a-select-option>
                    </a-select>
                </a-step>
            </a-steps>
        </a-card>
    </a-layout>
</template>
<script>
    export default {
        data() {
            return {
                spinning: true,
                progressList: [{"index": -1, "status": "wait", "title": "获取授权"}],
                uid: ""
            };
        },
        mounted() {
            let $this = this;
            var total_time = new Date($this.$store.state.task.finish_time) - new Date($this.$store.state.task.start_time);
            var date = new Date(total_time);
            $this.$store.state.task.total_time = [date.getHours() - 8, date.getMinutes(), date.getSeconds()].join(":");
            if ($this.$store.state.originList.length === 0 && $this.$store.state.powerList.length === 0) {
                let param = new URLSearchParams();
                param.append('id', $this.$store.state.task.task_id);
                $this.$api.TaskList.getTaskSelected(param).then(function (response) {
                    let data = response.data;
                    this.$store.commit("setOriginList", data.data_providers);
                    this.$store.commit("setPowerList", data.computation_providers);
                    $this.spinning = false;
                });
            } else {
                $this.spinning = false;
            }
            this.$store.commit("setUploadFileId", "");
        },
        methods: {
            addProgressButton(value) {
                if (value === "intersection") {
                    this.progressList.push({"index": this.progressList.length - 1, "status": "wait", "title": "求交集"});
                }
                if (value === "train") {
                    if (this.$store.state.uploadFileId === "")
                        this.progressList.push({
                            "index": this.progressList.length - 1,
                            "status": "wait",
                            "title": "上传模型训练脚本"
                        });
                    if (this.$store.state.uploadFileId !== "")
                        this.progressList.push({
                            "index": this.progressList.length - 1,
                            "status": "wait",
                            "title": "开始模型训练"
                        });
                }
            },
            progressButton(index) {
                let $this = this;
                index = index + 1;
                if ($this.progressList[index].title === "获取授权") {
                    $this.progressList[index].status = "finish";
                    $this.progressList[index].title = "已获取授权";
                    $this.$message.info("任务" + $this.$store.state.task.task_id + "授权完成");
                }
                if ($this.progressList[index].title === "开始模型训练") {
                    $this.finishLaunchTask();
                    $this.progressList[index].title = "模型训练中";
                    $this.progressList[index].status = "process";
                }
            },
            uploadFile(info) {
                let $this = this;
                const reader = new FileReader();
                reader.readAsText(info.file);
                reader.onload = function () {
                    let result = this.result;
                    const param = new FormData();
                    param.append("file", result);
                    param.append("id", $this.$store.state.task.task_id);
                    $this.$api.TaskDetail.uploadFile(param).then(function (response) {
                        let data = response.data;
                        let uid = data.uid;
                        this.$store.commit("setUploadFileId", uid);
                        let state = data.state;
                        if (state === true) {
                            $this.$message.info("上传脚本文件" + info.file.name + "成功");
                            var index = 0;
                            for (index in $this.progressList) {
                                if ($this.progressList[index].title === "上传模型训练脚本")
                                    break;
                            }
                            $this.progressList[index].title = "开始模型训练";
                        } else {
                            $this.$message.warn("上传脚本文件" + info.file.name + "失败");
                        }
                    });
                }
            },
            finishLaunchTask() {
                let $this = this;
                let param = new URLSearchParams();
                param.append('id', $this.$store.state.task.task_id);
                let powerList = [];
                let originList = [];
                for (let index in $this.$store.state.powerList) {
                    powerList.push($this.$store.state.powerList[index].id);
                }
                for (let index in $this.$store.state.originList) {
                    originList.push($this.$store.state.originList[index].id);
                }
                param.append('computation_providers', powerList.toString());
                param.append('data_sources', originList.toString());
                param.append('file_id', $this.$store.state.uploadFileId);
                $this.$api.TaskDetail.launchNewTask(param).then(function (response) {
                    let data = response.data;
                    let state = data.state;
                    if (state === true) {
                        $this.$message.info("启动任务成功");
                    } else {
                        $this.$message.warning("启动任务失败");
                    }
                });
            },
            uploadFileUpdate() {
                let $this = this;
                var index = 0;
                for (index in $this.progressList) {
                    if ($this.progressList[index].title === "上传模型训练脚本") {
                        $this.progressList[index].title = "开始模型训练";
                        return;
                    }
                }
            }
        },
    };
</script>
