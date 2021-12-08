import request from '@/utils/request'

export default {
  //查询总用户
  getUserTotal(){
    return request({
      url: `/system/user/total	      `,
      method: 'get'
    })
  },
  //查询总文章
  getArticleTotal(){
    return request({
      url: `/article/article/total`,
      method: 'get'
    })
  },
  //查询总提问
  getQuestionTotal(){
    return request({
      url: `/question/question/total`,
      method: 'get'
    })
  },
  //查询分类下的文章数
  getCategoryTotal(){
    return request({
      url: `/article/article/category/total`,
      method: 'get'
    })
  },
  //查询近六个月发布的文章书
  getMonthArticleTotal(){
    return request({
      url: `/article/article/category/total`,
      method: 'get'
    })
  },
}