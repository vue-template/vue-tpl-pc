<template>
  <div class="offer-list">
    <Breadcrumb class="w-breadcrumb">
      <Breadcrumb-item><router-link to="order-list">我的订单</router-link></Breadcrumb-item>
      <Breadcrumb-item>报价信息</Breadcrumb-item>
    </Breadcrumb>

    <div class="tips">
      <p>您的行程已经发送给所有车企，车企将为您限时抢单报价{{leftTime | leftTimeFilter}}</p>
      <div class="timer">
        <countdown v-if="order.create_time" :order-id="orderId" :start-time="order.create_time" @end="countEnd" :time.sync="leftTime"></countdown>
        <Button type="primary" size="small" @click="refresh" data-mtaid="chartered.offer_list.refresh_offer">刷新</Button>
      </div>
    </div>

    <offers ref="offers" :class="{'disabled': order.display_status != 1}" :order-id="orderId" :status="order.display_status"></offers>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import offers from '../components/offers.vue'
  import countdown from '../components/countdown.vue'
  import ddb from '../assets/js/ddb/'

  export default {
    components: {
      offers,
      countdown
    },
    data() {
      return {
        orderId: this.$route.query.id,
        order: {},
        leftTime: ''
      }
    },
    filters: {
      leftTimeFilter(time) {
        if (time) {
          return '（' + time + '分钟后抢单将会停止）'
        }
        return '（抢单已停止）'
      }
    },
    computed: {
      ...mapState(['orderList']),
      curOrder() {
        return this.orderList.filter(order => order.order_id === this.orderId)[0] || {}
      }
    },
    created() {
      this.init()
    },
    methods: {
      ...mapActions(['getOrderInfo']),
      init() {
        if (this.curOrder.id) {
          this.order = this.curOrder
          if (+this.order.display_status !== 1) {
            ddb.tips('已过抢单时间，请重新下单')
          }
        } else {
          this.getOrderInfo({
            data: {order_id: this.orderId}
          }).then(res => {
            if (res.ret === 0) {
              this.order = res.data
              console.log(this.order.status_name + ':' + this.order.display_status)
              if (+this.order.display_status !== 1) {
                ddb.tips('已过抢单时间，请重新下单')
              }
            }
          })
        }
      },
      refresh() {
        this.$refs.offers.init()
      },
      countEnd() {
        console.log('countEnd')
        // 延迟刷新数据，避免服务器状态还未更改
        setTimeout(this.init, 1000)
      }
    }
  }
</script>