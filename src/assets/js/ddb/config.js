import env from './env'
// import {getParam} from './location'
// import {session} from './storage'

export default {
  version: '1.0.1',
  env: env.name,
  amapkey: '4db5c9cbc5c7fb94d683badc86ec04fc',
  api: 'http://' + env.sld + 'yc.api.buskeji.com/',
  regUrl: 'http://' + env.sld + 'qiye.buskeji.com/src/pages/register.html',
  loginUrl: 'http://' + env.host + '/#/login'
}