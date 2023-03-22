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
export function getByIds(userIds) {
    let params = new URLSearchParams()
    userIds &&params.append('userIds',userIds)
    return new request({
        url: '/api/user/ids',
        method: 'get',
        params
    })
}
export function getUseLanguage() {
    return request({
        url: '/api/user/language',
        method: 'get',
    })
}
