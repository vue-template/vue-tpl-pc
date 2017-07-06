import config from './config'
import env, {envname, device, isWeixin, isApp, isAndroid, isIOS} from './env'
import {getParam, setParam, setObj} from './location'
import cookie from './cookie'
import {store, session} from './storage'
import {loading, hideLoading, alert, toast, confirm, tips, notify} from './ui'
import {ajax, get, post, xhrs, params, upParams} from './ajax'
import user, {logined, login, logout, register} from './user'
import * as util from './util'
// import setTitle from './hack'

// 嗒嗒工具函数库
export default {
  // 通用配置
  version: config.version,
  config,

  // 环境变量
  env,
  envname,
  device,
  isWeixin,
  isApp,
  isAndroid,
  isIOS,

  // 通用工具
  noop: util.noop,
  util,

  // 常用工具
  getParam,
  setParam,
  setObj,

  // 数据存储
  cookie,
  store,
  session,

  // UI 组件
  loading,
  hideLoading,
  alert,
  toast,
  confirm,
  tips,
  notify,

  // ajax
  ajax,
  get,
  post,
  xhrs,
  params,
  upParams,

  // 用户相关
  user,
  logined,
  login,
  logout,
  register

  // hack
  // setTitle
}