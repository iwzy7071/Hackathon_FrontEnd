import base from './base'
import axios from '@/utils/http'

const TaskList = {
    getTaskList(params) {
        return axios.get(`${base.product}/getTask`, params)
    }
}

export default TaskList
