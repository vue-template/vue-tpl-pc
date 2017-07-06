import ddb from '../assets/js/ddb/'

export default {
  // offerInfo(state) {
  //   return state.orderInfo.offer_info || {}
  // },
  // offerLength(state) {
  //   return state.offerList.length || 0
  // },
  // schedulingList(state) {
  //   return state.orderInfo.scheduling_list || []
  // },
  // validGoods(state) {
  //   return state.goodsList.filter(goods => goods.remain_num > 0)
  // },
  // queryGoods(state) {
  //   return state.goodsList.filter(goods => goods.goods_id === state.query.goodsId)[0] || {}
  // },
  userinfo(state) {
    return {
      logined: ddb.user.isLogin(),
      companyname: ddb.cookie('company_name'),
      username: ddb.cookie('user_name') || '空空'
    }
  }
}
