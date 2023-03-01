import request from '@/utils/request'

export function get(problemId) {
    return request({
        url: '/api/hint',
        method: 'get',
        params: problemId
    })
}
