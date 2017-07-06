// import env from './env'
import config from './config'
import cookie from './cookie'
// import http from './ajax'

// 用户是否登录
export let logined = isLogin()
export function isLogin() {
  return !!(cookie('user_id') && cookie('mobile') && cookie('ddb_token'))
}

// 转到登录页
export function login(referrer = location.href, replace = false) {
  let url = config.loginUrl + '?referrer=' + encodeURIComponent(referrer)
  if (replace) {
    location.replace(url)
  } else {
    location.href = url
  }
}

// 清除登录态
export function clearLogin(callback) {
  // if (!logined) return
  cookie('user_id', '', {path: '/'})
  cookie('mobile', '', {path: '/'})
  // cookie('device_id', '', {path: '/'})
  cookie('ddb_token', '', {path: '/'})
  window.sessionStorage.clear()

  if (typeof callback === 'function') {
    callback()
  }
}

// 退出登录
export function logout(callback = login) {
  clearLogin(callback)
}

// 转到注册页
export function register(referrer = location.href, replace = false) {
  let url = config.regUrl + '?referrer=' + encodeURIComponent(referrer)
  if (replace) {
    location.replace(url)
  } else {
    location.href = url
  }
}

// 同步乘客端的登录态
// function syncLogin(argument) {
//   cookie('user_id', '126501', {expires: 365, path: '/'})
//   cookie('mobile', '12311111111', {expires: 365, path: '/'})
//   cookie('ddb_token', 'c487bfc3312614df65dc9637d0cd0b94', {expires: 365, path: '/'})
// }

export default {
  logined,
  isLogin,
  login,
  logout,
  // syncLogin,
  clearLogin
}