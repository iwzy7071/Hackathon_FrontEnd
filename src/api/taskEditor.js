import base from './base'
import axios from '@/utils/http'

const TaskDetail = {
    getConsole(params) {
        return axios.get(`${base.develop}/getConsole`, params)
    },
    getTemplate(params) {
        return axios.get(`${base.develop}/getTemplate`, params)
    },
    submitConsoleScript(params){
        return axios.post(`${base.develop}/submitConsoleScript`, params)
    }
};

export default TaskDetail;
