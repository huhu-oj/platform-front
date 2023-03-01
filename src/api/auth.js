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
export function getInfo() {
    return request({
        url: '/api/user',
        method: 'get',
    })
}
export function logout() {
    return request({
        url: '/auth/logout',
        method: 'get',
    })
}
