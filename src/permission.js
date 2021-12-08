import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

//导入cookie.js工具
import {PcCookie,Key} from '@/utils/cookie'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  const hasToken = PcCookie.get(Key.accessTokenKey)

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = PcCookie.get(Key.userInfoKey)
      if(hasGetUserInfo){
        next()
      }else{
        window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}?redirectURL=${window.location.href}`
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // await store.dispatch('user/resetToken')
      // next(`/login?redirect=${to.path}`)
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}?redirectURL=${window.location.href}`
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
