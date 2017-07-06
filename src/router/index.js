import Vue from 'vue'
import Router from 'vue-router'
import Loading from '@/views/loading'
import Chartered from '@/views/chartered'
import Login from '@/views/login'
import OrderPlace from '@/views/order-place'
import OrderList from '@/views/order-list'
import OrderDetails from '@/views/order-details'
import OfferList from '@/views/offer-list'
import PayOrder from '@/views/pay-order'
import Agreement from '@/views/agreement'

Vue.use(Router)

const routes = [{
  path: '/chartered',
  name: 'chartered',
  redirect: '/chartered/order-place',
  component: Chartered,
  meta: {
    needlogin: true,
    title: '包车'
  },
  children: [{
    path: 'order-place',
    name: 'order-place',
    component: OrderPlace,
    meta: {
      keepAlive: true,
      needlogin: true,
      title: '我要包车'
    }
  }, {
    path: 'order-list',
    name: 'order-list',
    component: OrderList,
    meta: {
      needlogin: true,
      title: '我的订单'
    }
  }, {
    path: 'order-details',
    name: 'order-details',
    component: OrderDetails,
    meta: {
      needlogin: true,
      title: '订单详情'
    }
  }, {
    path: 'offer-list',
    name: 'offer-list',
    component: OfferList,
    meta: {
      needlogin: true,
      title: '报价信息'
    }
  }, {
    path: 'pay-order',
    name: 'pay-order',
    component: PayOrder,
    meta: {
      needlogin: true,
      title: '费用支付'
    }
  }]
}, {
  path: '/login',
  name: 'login',
  component: Login,
  meta: {
    title: '登录'
  }
}, {
  path: '/agreement',
  name: 'agreement',
  component: Agreement,
  meta: {
    title: '嗒嗒巴士约车协议'
  }
}, {
  path: '/loading',
  name: 'loading',
  component: Loading
}, {
  path: '*',
  redirect: '/chartered/order-place'
}]

export default new Router({
  // mode: 'history',
  routes
})
