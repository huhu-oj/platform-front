import request from '@/utils/request'

export function login(data) {
    return request({
        url: 'auth/login',
        method: 'post',
        data
    })
}
export function getCode() {
    return request({
        url: 'auth/code',
        method: 'get'
    })
}
