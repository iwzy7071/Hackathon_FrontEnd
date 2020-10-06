import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        originList: [],
        powerList: [],
        taskList: [],
        task_selected_visible: false,
        task: {},
        uploadFileId: "",
        axiosError: "",
        taskSelected: []
    },
    mutations: {
        setOriginList(state, originList) {
            state.originList = originList;
        },
        setPowerList(state, powerList) {
            state.powerList = powerList;
        },
        setTaskList(state, taskList) {
            state.taskList = taskList;
        },
        setTaskSelectedVisible(state, task_selected_visible) {
            state.task_selected_visible = task_selected_visible;
        },
        setTask(state, task) {
            state.task = task;
        },
        setAxiosError(state, axiosError) {
            state.axiosError = axiosError;
        },
        setTaskSelected(state, taskSelected) {
            state.taskSelected = taskSelected;
        },
        setUploadFileId(state, uploadFileId) {
            state.uploadFileId = uploadFileId;
        },
        slicePowerList(state, index) {
            state.powerList.splice(index, 1);
        },
        pushPowerList(state, record) {
            state.powerList.push(record);
        },
        sliceOriginList(state, index) {
            state.originList.splice(index, 1);
        },
        pushOriginList(state, record) {
            state.originList.push(record);
        },
    },
    actions: {},
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})
