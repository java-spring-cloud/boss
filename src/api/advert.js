import request from '@/utils/request'


export default {

  //条件分页查询接口
  getList(query,current = 1,size = 20){
    return request({
      url: `/article/advertsearch`,
      method: 'post',
      data: {...query,current,size}
    })
  },
  add(data){
    return request({
      url: `/article/advert`,
      method: 'post',
      data
    })
  },
  getById(id){
    return request({
      url: `/article/adverti/${id}`,
      method: 'get',
    })
  },
  update(data){
    return request({
      url: `/article/advert`,
      method: 'put',
      data
    })
  },
  deleteById(id){
    return request({
      url: `/article/adverti/${id}`,
      method: 'delete',
    })
  },
}