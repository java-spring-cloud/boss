import request from '@/utils/request'

export default {
  //分页条件查询标签列表
  getList(query,current = 1,size = 20) {
    return request({
      url: `/article/label/search`,
      method: 'post',
      data: {...query,current,size}
    })
  },
  //新增标签
  add(data){
    return request({
      url: `/article/label`,
      method: 'post',
      data: data
    })
  },
  //查询标签详情
  getById(id){
    return request({
      url: `/article/label/${id}`,
      method: 'get'
    })
  },
  //更新标签
  update(data){
    return request({
      url: `/article/label`,
      method: 'put',
      data: data
    })
  },

  deleteById(id){
    return request({
      url: `/article/label/${id}`,
      method: 'delete'
    })
  }
}