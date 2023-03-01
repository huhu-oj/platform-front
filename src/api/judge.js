import request from '@/utils/request'

export function judge(data) {
    return request({
        url: '/api/judge',
        method: 'post',
        data
    })
}
export function test(data) {
    return request({
        url: '/api/judge/test',
        method: 'post',
        data
    })
}
