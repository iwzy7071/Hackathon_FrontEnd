import base from './base'
import axios from '@/utils/http'

const TaskDetail = {
    getTaskDetail(params) {
        return axios.get(`${base.product}/getMonitor`, params)
    }
}

export default TaskDetail;
