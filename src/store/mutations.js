// import * as types from './mutation-types'

export default {
  // setOrderList(state, data) {
  //   state.query = Object.assign(state.query, data)
  // },
  setServerTimeDif(state, data) {
    state.serverTimeDif = data
  },
  setOrderList(state, list) {
    // 如果已有报价列表则带上
    state.orderList.forEach(order => {
      list.forEach(item => {
        if (item.id === order.id && +order.display_status === 1) {
          item.offer_list = order.offer_list
        }
      })
    })
    state.orderList = list || []
  },
  setOrderPageInfo(state, data) {
    state.orderPageInfo = {
      pageCount: data.total_count,
      pageIndex: data.cur_page_index,
      pageSize: data.cur_page_size
    }
  },
  setOrderInfo(state, data) {
    state.orderInfo = data || {}
  },
  // setOfferList(state, data) {
  //   state.offerList = data || []
  // },
  setPayInfo(state, data) {
    state.payInfo = data
  },
  upOrderList(state, data) {
    state.orderList.some((order, i) => {
      if (order.order_id === data.orderId) {
        state.orderList[i].offer_list = data.list
        // console.log('upOrderList', data.list)
        return true
      }
    })

    state.orderList = state.orderList
  }
}
