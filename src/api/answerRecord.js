import request from '@/utils/request'

export function get(problemId,answerRecordId,testId) {
    return request({
        url: '/api/answerRecord',
        method: 'get',
        params: {
            problemId,answerRecordId,testId
        }
    })
}
export function getForTeacher(problemId,studentId) {
    return request({
        url: '/api/answerRecord/teacher',
        method: 'get',
        params: {
            problemId,studentId
        }
    })
}

export function getAll(problemId,answerRecordId,testId,labelIds) {
    let params = new URLSearchParams()
    problemId &&params.append('problemId',problemId)
    answerRecordId && params.append('answerRecordId',answerRecordId)
    testId &&params.append('testId',testId)
    labelIds && params.append('labelIds', labelIds)
    return request({
        url: '/api/answerRecord/all',
        method: 'get',
        params
    })
}
export function update(data) {
    return request({
        url: '/api/answerRecord',
        method: 'put',
        data
    })
}