import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        originList: [],
        powerList: [],
        taskList: [],
        task_selected_visible: false,
        task: {},
    },
    mutations: {
        deletePower(state, index) {
            state.powerList.slice(index, 1);
        },
        setPowerList(state, powerList) {
            state.powerList = powerList;
        },
        setTaskSelected(state, taskList) {
            state.taskList = taskList;
        },
        setTask(state, task) {
            let s = JSON.stringify(task);
            sessionStorage.setItem("task", s);
            state.task = task;
        },
    },
    actions: {},
    modules: {},
    getters: {
        getOriginList: state => state.originList,
        getPowerList: state => state.powerList,
        getTaskSelected: state => state.taskList,
        getTask(state) {
            let task = sessionStorage.getItem("task");
            state.task = JSON.parse(task);
            return state.task;
        }
    }
})
