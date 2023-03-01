import request from '@/utils/request'

export function get(examinationPaperId) {
    return request({
        url: '/api/examinationPaper',
        method: 'get',
        params: examinationPaperId
    })
}
