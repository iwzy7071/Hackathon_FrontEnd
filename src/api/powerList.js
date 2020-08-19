import base from './base'
import axios from '@/utils/http'

const powerList = {
    getPowerList(params) {
        return axios.get(`${base.product}/computationProviders`, params)
    },
}

export default powerList;
