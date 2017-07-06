import {noop} from './util'
// import * as dialog from 'vue-ydui/dist/lib.rem/dialog'
import {Confirm, Alert, Toast, Loading, Notify} from 'vue-ydui/dist/lib.px/dialog'
// import {Alert, Toast, Loading, Notify} from 'vue-ydui/dist/lib.px/dialog'
// import Message from 'iview/src/components/message'
// import Modal from 'iview/src/components/modal'

export {Alert as alert}
export {Toast as toast}
// export {Confirm as confirm}
// export {Notify as notify}

// export {Message as message}
// export {Modal as modal}

export function loading(msg = '玩命加载中', delay = 2000) {
  // wx.showToast({
  //   title: msg || ,
  //   icon: 'loading',
  //   mask: true,
  //   duration: 10000
  // })
  Loading.open(msg)
  hideLoading(delay)
}

// export const hideLoading = Loading.close
export function hideLoading(delay = 0) {
  setTimeout(Loading.close, delay)
}

export function tips(msg = '没有提示的提示', timeout = 1500) {
  Toast({
    mes: msg,
    timeout
  })
}

// export function tips(content = '没有提示的提示', duration = 2) {
//   Message.info({
//     content,
//     duration
//   })
// }

export function notify(msg = '注意', timeout = 5000, callback = noop) {
  Notify({
    mes: msg,
    timeout,
    callback
  })
}

export function confirm({title, msg, opts}) {
  Confirm({
    title,
    mes: msg,
    opts
  })
}

// export function confirm({content, title = null, okText = '取消', cancelText = '确定', onOk = noop, onCancel = noop}) {
//   Modal.confirm({
//     title,
//     content,
//     okText,
//     cancelText,
//     onOk,
//     onCancel
//   })
// }
