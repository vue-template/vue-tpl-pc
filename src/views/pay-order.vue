<template>
  <div class="pay-order">
    <Breadcrumb class="w-breadcrumb">
      <Breadcrumb-item><router-link to="order-list">我的订单</router-link></Breadcrumb-item>
      <Breadcrumb-item>费用支付</Breadcrumb-item>
    </Breadcrumb>

    <p class="tips" v-if="orderInfo.display_status == 2"><Icon type="android-warning"></Icon>请在 {{leftTime}} 分钟内完成订单的支付</p>
    <div class="order-info w-cardbox">
      <Card class="w-card" :bordered="false">
        <h3 class="title" slot="title">行程信息</h3>
        <ul class="list">
          <li><span class="dt">包车类型</span> <span class="dd">{{orderInfo.trip_type | tripType}}</span></li>
          <li><span class="dt">出发地</span> <span class="dd">{{orderInfo.start_city_name}}{{orderInfo.start_place_detail}}</span></li>
          <li><span class="dt">目的地</span> <span class="dd">{{orderInfo.end_city_name}}{{orderInfo.end_place_detail}}</span></li>
          <li><span class="dt">发车时间</span> <span class="dd">{{orderInfo.start_time}}</span></li>
          <li v-if="orderInfo.trip_type > 1"><span class="dt">结束时间</span> <span class="dd">{{orderInfo.end_time}}</span></li>
          <li><span class="dt">乘车人数</span> <span class="dd">{{orderInfo.passenger_count}}</span></li>
          <li><span class="dt">联系人</span> <span class="dd">{{orderInfo.contact_name}}</span></li>
          <li><span class="dt">联系电话</span> <span class="dd">{{orderInfo.contact_mobile}}</span></li>
          <li v-if="orderInfo.user_comments"><span class="dt">备注</span> <span class="dd">{{orderInfo.user_comments}}</span></li>
        </ul>
      </Card>
      <Card class="w-card">
        <h3 class="title" slot="title">报价信息</h3>
        <ul class="list">
          <li><span class="dt">报价车企</span> <span class="dd">{{payInfo.company_name}}</span></li>
          <li><span class="dt">总费用</span> <span class="dd">{{payInfo.price | fen2yuan}}</span></li>
          <li><span class="dt">用车费</span> <span class="dd">{{payInfo.car_price | fen2yuan}}</span></li>
          <li v-if="payInfo.road_toll > 0"><span class="dt">路桥费</span> <span class="dd">{{payInfo.road_toll | fen2yuan}}</span></li>
          <li v-if="payInfo.room > 0"><span class="dt">食宿费</span> <span class="dd">{{payInfo.room | fen2yuan}}</span></li>
          <li v-if="payInfo.park > 0"><span class="dt">停车费</span> <span class="dd">{{payInfo.park | fen2yuan}}</span></li>
          <li v-if="payInfo.other > 0"><span class="dt">其它费用</span> <span class="dd">{{payInfo.other | fen2yuan}}</span></li>
          <li><span class="dt">支付方式</span> <span class="dd"><label>企业支付</label></span></li>
        </ul>
      </Card>
    </div>
    <p class="rules">退单规则：出发前24小时可以全额退款，出行前4小时以上不足24小时退订扣除20%手续费，出行前2小时以上不足4小时退订扣除50%手续费，出行前2小时内不可退订。</p>
    <div class="paynow">
      <div class="agreement"><Checkbox v-model="agree"></Checkbox>我已阅读并同意<router-link to="/agreement" target="_blank" title="点击查看《嗒嗒巴士包车协议》">《嗒嗒巴士包车协议》</router-link></div>
      <Button type="primary" size="large" :disabled="!agree" :loading="loading" @click="payOrder" data-mtaid="chartered.pay_order.pay_now">
        <span v-if="loading">提交中...</span>
        <span v-else>立即支付</span>
      </Button>
    </div>
  </div>
</template>

<script>
  // import {mapState, mapGetters, mapActions} from 'vuex'
  import {mapState, mapActions} from 'vuex'
  import ddb from '../assets/js/ddb/'

  export default {
    data() {
      return {
        orderId: this.$route.query.id,
        agree: false,
        loading: false,
        leftTime: '15',
        payInfo: ddb.session('chartered:pay-info') || {}
      }
    },
    computed: {
      ...mapState(['orderInfo']),
      ...mapState({
        offerInfo: 'payInfo'
      })
    },
    created() {
      this.init()
    },
    destroyed() {
      console.log('destroyed countdown')
      clearInterval(ddb.leftTimer) // 清除定时器
    },
    methods: {
      ...mapActions(['getOrderInfo']),
      init() {
        this.getOrderInfo({
          data: {order_id: this.orderId}
        })

        this.payInfo = this.offerInfo.company_code ? this.offerInfo : this.payInfo
        if (!this.payInfo.company_code) {
          ddb.tips('未选择报价或报价信息已失效，请重新选择')
        }
      },
      chooseOffer(callback) {
        let self = this
        let data = {
          order_id: this.orderId,
          company_code: this.payInfo.company_code
        }
        this.loading = true
        ddb.get('chartered/choose_company_offer', data).then(res => {
          if (res.ret === 0) {
            callback()
          } else {
            self.loading = false
            ddb.notify(res.msg)
          }
        })
      },
      submitPay() {
        let self = this
        let data = {
          order_id: this.orderId,
          total_amount: this.payInfo.price
        }
        ddb.post('chartered/pay_order', data).then(res => {
          if (res.ret === 0) {
            ddb.notify('支付成功，3秒后转到订单列表')
            setTimeout(function() {
              // self.$router.go(-1)
              self.$router.replace({
                name: 'order-list'
              })
            }, 3000)
          } else {
            self.loading = false
            ddb.notify('支付失败：' + res.msg)
          }
        }).catch(err => {
          self.loading = false
          ddb.notify('支付失败：网络出错[' + err + ']，请检查网络后重试')
        })
      },
      payOrder() {
        this.chooseOffer(this.submitPay)
      },

      // 更新倒计时时间
      countdown(time) {
        let now = new Date().getTime() + this.serverTimeDif
        let end = new Date(this.startTime.replace(/-/g, '/')).getTime()
        let left = end - now

        if (left > 0) {
          let self = this
          this.leftTime = Math.floor(left / 60000)
          clearInterval(ddb.leftTimer)
          ddb.leftTimer = setInterval(function() {
            if (self.leftTime > 0) {
              self.leftTime--
            } else {
              self.countend()
            }
          }, 1000)
        } else {
          this.countend()
        }
      },

      // 倒计时结束后
      countend() {
        clearInterval(ddb.leftTimer)
        ddb.tips('已过支付时间，请重新下单')
      }
    }
  }
</script>