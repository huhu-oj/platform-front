import request from '@/utils/request'

export function get(testId) {
    return request({
        url: '/api/test',
        method: 'get',
        params: {
            testId
        }
    })
}
export function save(data) {
    return request({
        url: '/api/test',
        method: 'post',
        data
    })
}
export function update(data) {
    return request({
        url: '/api/test',
        method: 'put',
        data
    })
}
export function del(testId) {
    return request({
        url: '/api/test',
        method: 'delete',
        params: testId
    })
}
