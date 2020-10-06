<template>
    <a-drawer
            title="数据源和计算力列表"
            :width="450"
            :visible="this.$store.state.task_selected_visible"
            :body-style="{ paddingBottom: '80px' }"
            @close="taskSelectedClose"
    >
        <a-table :columns="originColumn"
                 rowKey="id"
                 :data-source="this.$store.state.originList">
            <div slot="name" href="javascript:" slot-scope="text">
                <div>{{text}}</div>
                <div><span @click="deleteOrigin(text)" style="color: darkgrey">删除</span></div>
            </div>
            <div slot="state" href="javascript:" slot-scope="record">
                <a v-if="record.state">已授权</a>
                <span v-else>未授权</span>
            </div>
            <div slot="action" href="javascript:" slot-scope="record">
                <a @click="getOriginAuth(record)">获取授权</a>
                <div><a>任务详情</a></div>
            </div>
        </a-table>
        <a-table :columns="powerColumn"
                 rowKey="id"
                 style="margin-top: 15px"
                 :data-source="this.$store.state.powerList">
            <div slot="device" href="javascript:" slot-scope="text">
                <div>{{text}}</div>
                <div><span @click="deletePower(text)" style="color: darkgrey">删除</span></div>
            </div>
            <div slot="state" href="javascript:" slot-scope="record">
                <a v-if="record.state">已授权</a>
                <span v-else>未授权</span>
            </div>
            <div slot="action" href="javascript:" slot-scope="record">
                <a @click="getPowerAuth(record)">获取授权</a>
                <div><a>任务详情</a></div>
            </div>
        </a-table>
    </a-drawer>
</template>
<script>
    export default {
        data() {
            return {
                powerColumn: [
                    {
                        title: '设备',
                        dataIndex: 'device',
                        key: 'device',
                        scopedSlots: {customRender: 'device'},
                    },
                    {
                        title: '授权状态',
                        key: 'state',
                        scopedSlots: {customRender: 'state'},
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: {customRender: 'action'},
                    },
                ],
                originColumn: [
                    {
                        title: '源名称',
                        dataIndex: 'name',
                        key: 'name',
                        scopedSlots: {customRender: 'name'},
                    },
                    {
                        title: '授权状态',
                        key: 'state',
                        scopedSlots: {customRender: 'state'},
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: {customRender: 'action'},
                    },
                ],
            };
        },
        methods: {
            taskSelectedClose() {
                this.$store.commit("setTaskSelectedVisible", false);
            },
            deleteOrigin(text) {
                let index = 0;
                for (index in this.$store.state.originList) {
                    let obj = this.$store.state.originList[index];
                    if (obj.name === text) {
                        break;
                    }
                }
                if (index !== this.$store.state.originList.length) {
                    this.$store.commit("sliceOriginList", index);
                    this.$message.info("已从任务中移除" + text + "计算力");
                }
            },
            deletePower(text) {
                let index = 0;
                for (index in this.$store.state.powerList) {
                    let obj = this.$store.state.powerList[index];
                    if (obj.device === text) {
                        break;
                    }
                }
                if (index !== this.$store.state.powerList.length) {
                    this.$store.commit("slicePowerList", index);
                    this.$message.info("已从任务中移除" + text + "计算力");
                }
            },
            getOriginAuth(record) {
                if (record.state === true) {
                    this.$message.warn("该数据源已经授权");
                    return;
                }
                record.state = true;
                this.$message.info("数据源" + record.name + "授权成功");
            },
            getPowerAuth(record) {
                if (record.state === true) {
                    this.$message.warn("该计算力已经授权");
                    return;
                }
                record.state = true;
                this.$message.info("计算力" + record.device + "授权成功");
            }
        }
    };
</script>
