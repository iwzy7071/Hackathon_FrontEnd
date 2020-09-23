import base from './base'
import axios from '@/utils/http'

const TaskList = {
    getTaskList(params) {
        return axios.get(`${base.product}/getTaskList`, params)
    },
    submitNewTask(params) {
        return axios.post(`${base.product}/submitTask`, params)
    },
    getTaskSelected(params) {
        return axios.get(`${base.product}/getTask`, {"params": params})
    }
};

export default TaskList;
