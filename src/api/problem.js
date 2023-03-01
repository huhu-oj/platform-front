import request from '@/utils/request'

export function get(problemId) {
    return request({
        url: '/api/problem',
        method: 'get',
        params: problemId
    })
}
