import base from './base'
import axios from '@/utils/http'

const TaskList = {
    getTaskList(params) {
        return axios.get(`${base.product}/getTask`, params)
    },
    submitNewTask(params) {
        return axios.post(`${base.product}/submitTask`, params)
    }
}

export default TaskList
