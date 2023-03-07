import request from '@/utils/request'

export function get() {
    return request({
        url: '/api/label',
        method: 'get',
    })
}
