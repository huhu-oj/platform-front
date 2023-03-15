import request from '@/utils/request'

export function get() {
    return request({
        url: '/api/user',
        method: 'get',
    })
}
export function getByUsername(username) {
    return request({
        url: '/api/user/name',
        method: 'get',
        params: {
            username
        }
    })
}
