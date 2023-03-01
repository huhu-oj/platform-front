import request from '@/utils/request'

export function get(problemId,answerRecordId) {
    return request({
        url: '/api/answerRecord',
        method: 'get',
        params: {
            problemId,answerRecordId
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
