import base from './base'
import axios from '@/utils/http'

const OriginList = {
    getOriginList(params) {
        return axios.get(`${base.product}/dataSources`, params)
    },
};

export default OriginList
