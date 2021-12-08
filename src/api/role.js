import request from '@/utils/request'

export default {
  //角色条件分页查询
  getList(query,current = 1,size = 20){
    return request({
      url: `/system/role/search`,
      method: 'post',
      data: {...query,current,size}
    })
  },
  //新增操作
  add(data){
    return request({
      url: `/system/role`,
      method: 'post',
      data
    })
  },
  getById(id){
    return request({
      url: `/system/role/${id}`,
      method: 'get',
    })
  },
  //更新
  update(data){
    return request({
      url: `/system/role`,
      method: 'put',
      data
    })
  },
  //删除操作
  deleteById(id){
    return request({
      url: `system/role/${id}`,
      method: 'delete'
    })
  },
  //通过角色id查询所拥有的菜单ids
  getMenuIdsByRoleId(id){
    return request({
      url: `/system/role/${id}/menu/ids`,
      method: 'get'
    })
  },
  saveRoleMenu(id,menuIds){
    return request({
      url: `/system/role/${id}/menu/save`,
      method: 'post',
      data: menuIds
    })
  }
}