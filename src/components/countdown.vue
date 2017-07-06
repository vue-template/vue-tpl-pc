<template>
  <time v-if="countTime" class="w-countdown">{{countTime}}</time>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import ddb from '../assets/js/ddb/'

  export default {
    props: {
      orderId: {
        type: String,
        required: true
      },
      startTime: {
        type: String,
        required: true
      },
      time: [Number, String]
    },
    data() {
      return {
        countTime: '',
        offerLength: 0,
        timerName: this.$route.name + 'countTimer' + this.orderId
      }
    },
    computed: {
      ...mapState(['serverTimeDif'])
    },
    watch: {
      countTime(v) {
        this.$emit('update:time', Number(v.split(':')[0]))
      }
    },
    created() {
      this.init()
    },
    destroyed() {
      console.log('beforeDestroy countdown')
      clearInterval(ddb[this.timerName]) // 清除定时器
    },
    methods: {
      ...mapActions(['getOrderInfo', 'getOfferList']),
      init() {
        this.upCountTime()
      },
      getOfferLength(cb) {
        this.getOfferList({
          data: {order_id: this.orderId}
        }).then(res => {
          cb(res.data && res.data.offer_list && res.data.offer_list.length)
        })
      },

      // 更新倒计时时间
      upCountTime(time) {
        time = time || 30 // 剩余抢单时间（分钟）

        // 更新剩余抢单时间
        let now = new Date().getTime() + this.serverTimeDif
        let start = new Date(this.startTime.replace(/-/g, '/')).getTime()
        let leftTime = time * 60000
        leftTime = leftTime - (now - start)

        if (leftTime > 0) {
          let self = this
          let pad = ddb.util.pad
          this.countTime = pad(Math.floor(leftTime / 60000)) + ':' + pad(Math.floor(leftTime % 60000 / 1000))
          clearInterval(ddb[this.timerName])
          ddb[this.timerName] = setInterval(function() {
            let times = self.countTime.split(':')
            let m = Number(times[0]) // 分
            let s = Number(times[1]) // 秒

            if (m === 0 && s === 0) {
              self.countTime = '00:00'
              self.countEnd(time)
            } else if (m >= 0) {
              if (s > 0) {
                s--
              } else if (s === 0) {
                m--
                s = 59
              }
              self.countTime = pad(m) + ':' + pad(s)
            }
          }, 1000)
        } else {
          this.countEnd(time)
        }
      },

      // 倒计时结束后
      countEnd(time) {
        // 抢单倒计时结束后，若有报价，再计时1小时
        clearInterval(ddb[this.timerName])
        if (time === 90) {
          this.countTime = '00:00'
          this.$emit('end')
        } else {
          this.getOfferLength(len => {
            if (len > 0) {
              this.upCountTime(90)
            } else {
              this.countTime = '00:00'
              this.$emit('end')
            }
          })
        }
      }
    }
  }
</script>