import config from './config'
// import {device} from './env'
import cookie from './cookie'
import {store, session} from './storage'
import {toast} from './ui'
import user from './user'
import axios from 'axios'
import qs from 'qs'

export let xhrs = []
// axios.defaults.timeout = 8000
// axios.defaults.baseURL = config.api
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// Ajax 通用请求参数
export let params = {
  version: config.version,
  // user_id: '',
  // mobile: '',
  // device_id: '', // 设备 ID
  // ddb_token: '', // 登录令牌
  // lat: 1, // 用户当前纬度
  // lng: 1, // 用户当前经度
  // device: device.width + ':' + device.height + '|' + device.dpr, // 用户设备信息
  // ddb_src_id: '', // 渠道 ID
  city_code: '0755' // 默认深圳
}

// 更新通用参数
export function upParams() {
  let mobile = cookie('mobile')
  if (mobile && mobile !== params.mobile) {
    params.mobile = mobile
    params.user_id = cookie('user_id') || params.user_id
    params.ddb_token = cookie('ddb_token') || params.ddb_token
    // params.device_id = cookie('device_id') || params.device_id
    params.ddb_src_id = session('ddb_src_id') || params.ddb_src_id
  }

  // 设置用户城市编码
  let city = store('ddb_city')
  if (city) {
    params.city_code = city.city_code
  }

  // 设置用户地理经纬度
  let gps = store('user_gps')
  if (gps) {
    [params.lng, params.lat] = [gps.lng, gps.lat]
  }
}

// 初始化参数
upParams()
// console.log('params:', params)

// Ajax 请求封装
export function ajax(opts) {
  upParams()
  opts.params = Object.assign({}, params, opts.params)

  return new Promise((resolve, reject) => {
    let cachekey = opts.cachekey
    let cache = cachekey ? session(cachekey) : null
    const done = function(res) {
      let data = res.data
      let ret = data.ret = Number(data.ret)
      // console.log(res.config.method + ':' + opts.url + '\n ', data)
      resolve(data)

      // 返回未登录状态
      if ((ret === 8001 || ret === 8002 || ret === 8003)) {
        user.clearLogin() // 清除过期登录态，如果有

        // 如果需检查登录态则转到登录页
        if (!opts.notCheckLogin) {
          user.login()
          return
        }
      }

      opts.success && opts.success(data)
    }

    // 如果有缓存则使用缓存数据
    if (cache) {
      done(cache)
      return
    }

    let xhr = axios({
      url: opts.url,
      method: opts.method || opts.type || 'get',

      // 将被添加到 url 前面，除非 url 是绝对的
      baseURL: config.api,

      // 与请求一起发送的 URL 参数，必须是纯对象或 URLSearchParams 对象
      params: opts.params,

      // 作为请求主体发送的数据，仅适用于请求方法 PUT、POST 和 PATCH
      data: opts.data,

      // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等
      // 这里可以使用开头引入的 qs（这个模块在安装 axios 的时候就已经安装了，不需要另外安装）
      // transformRequest: [data => {
      //   return qs.stringify(data)
      // }],

      // 这里提前处理返回的数据
      // transformResponse: [data => {
      //   return data
      // }],

      // 服务器将响应的数据类型，包括：arraybuffer、blob、document、json、text、stream
      responseType: opts.responseType || opts.dataType || 'json',

      // headers: {'content-type': 'application/json'},
      headers: opts.headers || opts.header || {'content-type': 'text/plain'},  // 这里要重设，默认的有跨域问题
      // withCredentials: true, // 指示是否跨站点访问控制请求，没搞懂是作毛用的

      // 指定请求超时之前的毫秒数
      timeout: opts.timeout || 8000
    }).then(done).catch(err => {
      if (err.response) {
        // 存在请求，但是服务器的返回一个状态码，都在 2xx 之外 todo
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
      } else {
        // 一些错误是在设置请求时触发的
        console.log('Error', err.message)
      }
      opts.error && opts.error(err)
      console.log('网络异常: [' + err + ']')
      toast('网络异常: [' + err + ']')
      reject(err)
    })

    xhrs.push(xhr)
  })
}

// get 请求封装
export function get(url, params = {}, opts = {}) {
  opts = Object.assign(opts, {
    url,
    params,
    method: 'get'
  })

  return ajax(opts)
}

// post 请求封装
export function post(url, data = {}, opts = {}) {
  data = qs.stringify(data)
  // data = new URLSearchParams(data)
  // data.append('param1', 'value1')
  opts = Object.assign(opts, {
    url,
    data,
    // headers: {'content-type': 'application/x-www-form-urlencoded;charset=utf-8'},
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    // headers: {'content-type': 'multipart/form-data'},
    method: 'post'
  })

  return ajax(opts)
}

export default {
  xhrs,
  ajax,
  get,
  post
}