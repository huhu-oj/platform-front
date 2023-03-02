import request from '@/utils/request'

export function judge(data) {
    return request({
        url: '/api/judge',
        method: 'post',
        data
    })
}
export function test(code,input) {
    return request({
        url: '/api/judge/test',
        method: 'post',
        params: {
            code,input
        }
    })
}
