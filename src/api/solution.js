import request from '@/utils/request'

export function get(problemId,solutionId) {
    return request({
        url: '/api/solution',
        method: 'get',
        params: {
            problemId,solutionId
        }
    })
}

export function getMySolutions(problemId,solutionId) {
    return request({
        url: '/api/solution/my',
        method: 'get',
        params: {
            problemId,solutionId
        }
    })
}
export function save(data) {
    return request({
        url: '/api/solution',
        method: 'post',
        data
    })
}
export function update(data) {
    return request({
        url: '/api/solution',
        method: 'put',
        data
    })
}
export function del(solutionId) {
    return request({
        url: '/api/solution',
        method: 'delete',
        params: {
            solutionId
        }
    })
}
