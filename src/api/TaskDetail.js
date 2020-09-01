import base from './base'
import axios from '@/utils/http'

const TaskDetail = {
    getMonitor(params) {
        return axios.get(`${base.product}/getMonitor`, params)
    },
    launchNewTask(params) {
        return axios.post(`${base.product}/launchTask`, params)
    },
    uploadFile(params) {
        return axios.post(`${base.develop}/submitTaskFile`, params)
    },
};

export default TaskDetail;
