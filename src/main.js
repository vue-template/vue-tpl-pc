import Vue from 'vue'
import iView from 'iview'
// import 'iview/dist/styles/iview.css'
import './assets/css/iview.less'
import router from './router/'
import store from './store/'
import filters from './filters'
// import 'nib/index.styl'
import './assets/css/main.styl' // !如果在组件后导入会导致组件中样式在前?
import './assets/css/order-place.styl'
import './assets/css/login.styl'
import './assets/css/ie.styl'
import ddb from './assets/js/ddb/'
import App from './app'

Vue.use(iView)

window.ddb = ddb
Vue.prototype.$ddb = ddb

// 关闭生产模式下的提示
Vue.config.productionTip = false
if (ddb.envname === 'pro' && !ddb.getParam('debug')) {
  console.log = console.error = console.debug = console.warn = console.info = ddb.noop
}

// 定义 vue 过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

// 转页前处理：更新标题/登录中间验证
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || document.title
  // window.scrollTo(0, 0) // 转页后滚动页面

  // 登录中间验证
  if (to.meta.needlogin && !ddb.user.isLogin()) {
    next({
      path: '/login',
      query: {
        referrer: to.fullPath
      }
    })
  } else {
    next()
  }
})

// 给 IE 浏览器添加标识
if (ddb.env.isIE) {
  let name = ddb.env.isIE9 ? 'ie ie9' : 'ie'
  // document.documentElement.classList.add('ie')
  document.documentElement.className += (document.documentElement.className ? ' ' : '') + name
}

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
  // data: {
  //   // transitionName: 'slide-left'
  // },
  // created() {
  //   this.init()
  // },
  // watch: {
  //   '$route': function(to, from) {
  //     let toDepth = to.path.split('/').length
  //     let fromDepth = from.path.split('/').length
  //     this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  //   }
  // },
  mounted() {
    // 腾讯云分析
    if (ddb.envname === 'pro') {
      window._mtac = {'performanceMonitor': 1}
      ;(function() {
        let mta = document.createElement('script')
        mta.src = 'http://pingjs.qq.com/h5/stats.js?v2.0.4'
        mta.setAttribute('name', 'MTAH5')
        mta.setAttribute('sid', '500476382')
        mta.setAttribute('cid', '500478472')
        document.head.appendChild(mta)
        // document.body.appendChild(mta)
      })()

      // 按钮点击统计上报
      try {
        this.$el.addEventListener('click', function(e) {
          if (!window.MtaH5) return
          let target = e.target
          while (target !== this && !target.hasAttribute('data-mtaid')) {
            target = target.parentNode
            if (!target) return
          }
          let name = target.getAttribute('data-mtaid')
          let report = name => {
            if (name) {
              window.MtaH5.clickStat(name)
              console.log('上报统计：' + name)
            }
          }

          if (name && name.indexOf(' ') !== -1) {
            name.split(' ').forEach(report)
          } else {
            report(name)
          }
        })
      } catch (r) {
        console.log(r)
      }
    }
  }
  // methods: {
  //   init() {
  //     let plate = ddb.getParam('plate') || ddb.session('plate') || '粤BC5033'
  //     if (!plate) ddb.tips('缺少必要参数：[车牌号]')
  //     ddb.session('plate', plate)
  //     this.$store.commit('setPlate', plate)
  //   }
  // }
})