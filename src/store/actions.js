// import * as types from './mutation-types'
import ddb from '../assets/js/ddb/'

export const getOrderList = ({commit}, opts = {}) => {
  ddb.loading()
  return new Promise((resolve, reject) => {
    ddb.get('chartered/get_order_list', opts.data).then(res => {
      ddb.hideLoading(800)
      resolve(res)

      if (res.ret === 0) {
        // res.data.order_list.map(order => {
        //   order.offerlen = 0
        //   return order
        // })
        commit('setOrderList', res.data.order_list)
        commit('setOrderPageInfo', res.data)
        commit('setServerTimeDif', new Date(res.server_time.replace(/-/g, '/')).getTime() - new Date().getTime())
      } else {
        ddb.tips(res.msg)
      }
    }).catch(err => {
      ddb.hideLoading(800)
      reject(err)
    })
  })
}

export const getOrderInfo = ({commit}, opts = {}) => {
  ddb.loading()
  return new Promise((resolve, reject) => {
    ddb.get('chartered/get_order_detail', opts.data).then(res => {
      ddb.hideLoading(800)
      resolve(res)

      if (res.ret === 0) {
        commit('setOrderInfo', res.data)
      } else {
        // ddb.tips(res.msg)
        ddb.notify(res.msg)
      }
    }).catch(err => {
      ddb.hideLoading(800)
      reject(err)
    })
  })
}

// export const getOfferList = ({commit}, opts = {}) => {
//   ddb.get('chartered/company_offer_list', opts.data).then(res => {
//     opts.done && opts.done(res)
//     if (res.ret === 0 && res.data) {
//       commit('setOfferList', res.data.offer_list)
//     } else {
//       ddb.tips(res.msg)
//     }
//   })
// }

export const getOfferList = ({state, commit}, opts = {}) => {
  return new Promise((resolve, reject) => {
    ddb.get('chartered/company_offer_list', opts.data).then(res => {
      resolve(res)

      if (res.ret === 0 && res.data) {
        // commit('setOfferList', res.data.offer_list)
        // NND 复制个数组出来，数组值还会跟着改？！
        // let list = [...state.orderList]
        // let list = state.orderList.slice()
        // let list = state.orderList.concat()

        // list.some((order, i) => {
        //   if (order.order_id === opts.data.order_id) {
        //     // order.offer_list = this.offerList
        //     // order.offerlen = this.offerList.length
        //     console.log('iiiiiiiii', i)
        //     list[i].offer_list = this.offerList
        //     return true
        //   }
        // })
        // let list = JSON.parse(JSON.stringify(state.orderList))
        // commit('setOrderList', list)
        // list[0].offer_list = []
        // console.log(list)
        commit('upOrderList', {
          orderId: opts.data.order_id,
          list: res.data.offer_list
        })
      } else {
        ddb.tips(res.msg)
      }
    })
  })
}

export const setPayInfo = ({state, commit, dispatch}, opts = {}) => {
  commit('setPayInfo', opts.data)
  // if (!state.goodsList.length) {
  //   dispatch('getGoods', {api, data})
  // }
}

// export const upOrderList = ({state, commit, dispatch}, data) => {
//   // let list = [...state.orderList]
//   // list.some(order => {
//   //   if (order.order_id === opts.orderId) {
//   //     order.offer_list = opts.offerList
//   //     return true
//   //   }
//   // })

//   commit('setOrderList', data)
// }
