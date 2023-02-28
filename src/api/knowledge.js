import request from '@/utils/request'

export function get(knowledgeId) {
    return request({
        url: '/api/knowledge',
        method: 'get',
        params: knowledgeId
    })
}
