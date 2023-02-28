import request from '@/utils/request'

export function get() {
    return request({
        url: '/api/user',
        method: 'get',
    })
}
