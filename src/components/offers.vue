<template>
  <div class="offers">
    <div class="w-offer" v-for="info of offers" :key="info.order_id">
      <div class="content">
        <div class="intro">
          <div class="title">
            <div class="avatar vip">
              <img :src="info.company_avatar">
            </div>
            <div class="company">
              <h3 class="name">{{info.company_name}}</h3>
              <div v-if="!isCard" class="tags"><span v-for="tag in info.company_label">{{tag}}</span></div>
              <div class="score"><em>车企评分</em><i v-for="n in 5" :class="{'on': n <= info.score}"></i></div>
            </div>
          </div>
          <!-- <div v-if="!isCard" class="score"><em>车企评分</em><i v-for="n in 5" :class="{'on': n <= info.score}"></i></div> -->
        </div>
        <div class="details">
          <Poptip v-if="isCard" trigger="hover" placement="bottom-start" width="400">
            <div class="dt">
              <span class="key">车辆费用</span>
              <span class="val">{{info.scheduling_list | carPriceCount | fen2yuan}}元</span>
            </div>
            <table slot="content">
              <thead>
                <tr>
                  <td>车牌号</td>
                  <td>座位数</td>
                  <td>单价</td>
                  <td>合计</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in info.scheduling_list">
                  <td>{{item.car_no}}</td>
                  <td>{{item.car_seat}}</td>
                  <td>{{item.price | fen2yuan}}元</td>
                  <td>{{item.price | fen2yuan}}元</td>
                </tr>
              </tbody>
            </table>
          </Poptip>
          <template v-else>
            <div class="dt">
              <span class="key">车辆费用</span>
              <span class="val">{{info.scheduling_list | carPriceCount | fen2yuan}}元<i :class="{'on': showCarInfo}" @click="toggleInfo('car')"></i></span>
            </div>
            <div class="dd" v-show="showCarInfo">
              <table>
                <thead>
                  <tr>
                    <td>车牌号</td>
                    <td>座位数</td>
                    <td>单价</td>
                    <td>合计</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in info.scheduling_list">
                    <td>{{item.car_no}}</td>
                    <td>{{item.car_seat}}</td>
                    <td>{{item.price | fen2yuan}}元</td>
                    <td>{{item.price | fen2yuan}}元</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <Poptip v-if="isCard" trigger="hover" placement="bottom-start" width="400">
            <div class="dt">
              <span class="key">行程费用</span>
              <span class="val">{{info | tripPriceCount | fen2yuan}}元</span>
            </div>
            <table slot="content">
              <thead>
                <tr>
                  <td>路桥费</td>
                  <td>食宿费</td>
                  <td>停车费</td>
                  <td>其它</td>
                  <td>合计</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{info.road_toll | fen2yuan}}元</td>
                  <td>{{info.room | fen2yuan}}元</td>
                  <td>{{info.park | fen2yuan}}元</td>
                  <td>{{info.other | fen2yuan}}元</td>
                  <td>{{info | tripPriceCount | fen2yuan}}元</td>
                </tr>
              </tbody>
            </table>
          </Poptip>
          <template v-else>
            <div class="dt">
              <span class="key">行程费用</span>
              <span class="val">{{info | tripPriceCount | fen2yuan}}元<i :class="{'on': showTripInfo}" @click="toggleInfo('trip')"></i></span>
            </div>
            <div class="dd" v-show="showTripInfo">
              <table>
                <thead>
                  <tr>
                    <td>路桥费</td>
                    <td>食宿费</td>
                    <td>停车费</td>
                    <td>其它</td>
                    <td>合计</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{info.road_toll | fen2yuan}}元</td>
                    <td>{{info.room | fen2yuan}}元</td>
                    <td>{{info.park | fen2yuan}}元</td>
                    <td>{{info.other | fen2yuan}}元</td>
                    <td>{{info | tripPriceCount | fen2yuan}}元</td>
                  </tr>
                  <tr>
                    <td colspan="5" class="explain">其它费用说明，请根据实际情况线下结算</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <div class="dt">
            <span class="key total">总报价</span>
            <span class="val total">{{info.price | fen2yuan}}元</span>
          </div>
        </div>
      </div>
      <div class="footer"><Button type="primary" size="large" @click="gopay(info)" :data-mtaid="'chartered.' + (isCard ? 'order_list' : 'offer_list') + '.btn_choose_offer'">去支付</Button></div>
    </div>
  </div>
</template>

<script>
  // import {mapState, mapMutations, mapActions} from 'vuex'
  import {mapActions} from 'vuex'
  import ddb from '../assets/js/ddb/'

  export default {
    props: {
      orderId: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'list'
      },
      limit: [String, Number],
      status: {
        type: [String, Number],
        default: 1
      }
      // offerLen: Object
    },
    data() {
      return {
        isCard: this.type === 'card',
        offerList: [],
        showCarInfo: false,
        showTripInfo: false,
        timerName: this.$route.name + 'offerTimer' + this.orderId
      }
    },
    filters: {
      carPriceCount(list) {
        let total = 0
        list.forEach(item => {
          total += Number(item.price)
        })
        return total
      },
      tripPriceCount(info) {
        return Number(info.road_toll) + Number(info.room) + Number(info.park) + Number(info.other)
      }
    },
    computed: {
      offerLength() {
        return this.offerList.length
      },
      offers() {
        if (this.limit && this.offerLength > this.limit) {
          return this.offerList.slice(0, this.limit)
        }
        return this.offerList
      }
    },
    created() {
      this.init()
    },
    destroyed() {
      console.log('beforeDestroy offers')
      clearInterval(ddb[this.timerName]) // 清除定时器
    },
    methods: {
      ...mapActions(['getOfferList', 'setPayInfo']),
      init() {
        this.getOffers()
        clearInterval(ddb[this.timerName])
        ddb[this.timerName] = setInterval(this.getOffers, 10000) // 每10秒更新一次报价列表
      },
      getOffers() {
        this.getOfferList({
          data: {order_id: this.orderId}
        }).then(res => {
          if (res.ret === 0 && res.data) {
            this.offerList = res.data.offer_list
            // this.offerLen[this.orderId] = this.offerList.length
            // this.$emit('update:offerLen', this.offerList.length)
          }
        })
      },
      toggleInfo(name) {
        switch (name) {
          case 'car':
            this.showCarInfo = !this.showCarInfo
            break
          case 'trip':
            this.showTripInfo = !this.showTripInfo
            break
        }
      },
      gopay(info) {
        // 已不是抢单状态
        if (this.status > 1) {
          ddb.tips('已过抢单时间，请重新下单')
          return
        }

        this.setPayInfo({data: info})
        ddb.session('chartered:pay-info', info)
        this.$router.push({
          name: 'pay-order',
          query: {id: info.order_id}
        })
      }
    }
  }
</script>