import base from './base'
import axios from '@/utils/http'

const TaskDetail = {
    getConsole(params) {
        return axios.get(`${base.product}/getConsole`, {"params": params})
    },
    getTemplate(params) {
        return axios.get(`${base.product}/getTemplates`, params)
    },
    submitConsoleScript(params) {
        return axios.post(`${base.develop}/submitTaskFile`, params)
    }
};

export default TaskDetail;
