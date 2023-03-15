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

export function getForTeacher(testId) {
    return request({
        url: '/api/test/teacher',
        method: 'get',
        params: {
            testId
        }
    })
}

export function getRecordsForTeacher(studentId) {
    return request({
        url: '/api/test/record/student',
        method: 'get',
        params: {
            studentId
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
export function saveRecord(data) {
    return request({
        url: '/api/test/record',
        method: 'post',
        data
    })
}
export function getRecord(testId) {
    return request({
        url: '/api/test/record',
        method: 'get',
        params: {
            testId
        }
    })
}

export function getRecords() {
    return request({
        url: '/api/test/records',
        method: 'get',
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
        params: {
            testId
        }
    })
}
