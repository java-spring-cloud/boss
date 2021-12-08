import request from '@/utils/request'

export default {
  getList(query,current = 1,size = 20){
    return request({
      url: `article/category/search`,
      method: 'post',
      data: {
        ...query,
        current,
        size
      }
    })
  },

  add( data ){
    return request({
      url: `/article/category`,
      method: 'post',
      data: data
    })
  },
  //查询类别详情
  getById(id) {
    return request({
      url: `/article/category/${id}`,
      method: 'get'
    })
  },

  update(data){
    return request({
      url:  `/article/category`,
      method: 'put',
      data: data
    })
  },
  //删除
  deleteById(id){
    return request({
      url: `/article/category/${id}`,
      method: 'delete'
    })
  },
  //查询正常状态的分类
  getNormalList(){
    return request({
      url: `/article/category/list`,
      method: 'get',
    })
  },
  getCategoryAndLabel(){
    return request({
      url: `/article/category/label/list`,
      method: 'get'
    })
  }
}