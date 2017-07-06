<template>
  <div class="order-list">
    <div class="w-filter">
      <div class="item">
        <Select class="select" v-model="filter.status" placeholder="请选择">
          <Option value="0">全部订单</Option>
          <Option value="1">抢单中</Option>
          <Option value="2">待支付</Option>
          <Option value="3">待出行</Option>
          <Option value="4">出行中</Option>
          <Option value="5">已取消</Option>
          <Option value="6">已完成</Option>
        </Select>
      </div>
      <div class="item">
        <Input v-model="filter.id" placeholder="订单号"></Input>
      </div>
      <div class="item">
        <Date-picker type="date" placeholder="下单日期" v-model="filter.createTimeMin"></Date-picker>
      </div>
      <div class="item">至</div>
      <div class="item">
        <Date-picker type="date" placeholder="下单日期" v-model="filter.createTimeMax"></Date-picker>
      </div>
      <div class="item">
        <Date-picker type="date" placeholder="发车日期" v-model="filter.startDateMin"></Date-picker>
      </div>
      <div class="item">至</div>
      <div class="item">
        <Date-picker type="date" placeholder="发车日期" v-model="filter.statDateMax"></Date-picker>
      </div>
      <div class="item">
        <Button class="button" type="primary" @click="filterOrder(filter)" data-mtaid="chartered.order_list.btn_search">搜索</Button>
      </div>
    </div>

    <table class="w-table">
      <thead>
        <tr>
          <th>状态</th>
          <th>出发地</th>
          <th>出发时间</th>
          <th>联系人</th>
          <th>包车类型</th>
          <th>下单时间</th>
          <th>订单号</th>
          <th>总金额</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="order in orderList">
          <tr>
            <td>{{order.status_name}}</td>
            <td>{{order.start_city_name}}</td>
            <td>{{order.start_time}}</td>
            <td>{{order.contact_name}}</td>
            <td>{{order.trip_type | tripType}}</td>
            <td>{{order.create_time}}</td>
            <td>{{order.order_id}}</td>
            <td><template v-if="order.amount > 0">￥{{order.amount | fen2yuan}}</template></td>
            <td>
              <div class="actions">
                <a @click="viewOrder(order.order_id)" data-mtaid="chartered.order_list.btn_view_order">查看订单</a>
                <a v-if="order.display_status < 5" @click="cancelOrder(order)" data-mtaid="chartered.order_list.btn_cancel_order">取消订单</a>
                <a v-if="order.display_status == 2" @click="payOrder(order)" data-mtaid="chartered.order_list.btn_pay_order">立即支付</a>
                <a v-if="order.display_status == 5" @click="endTrip(order.order_id)" data-mtaid="chartered.order_list.btn_end_trip">结束行程</a>
                <countdown v-if="order.display_status == 1" :order-id="order.order_id" :start-time="order.create_time" @end="countEnd"></countdown>
              </div>
            </td>
          </tr>
          <tr v-if="order.display_status == 1" v-show="order.offer_list.length">
            <td colspan="9">
              <div class="offerbox">
                <div class="header">
                  <h3>已报价车企</h3>
                  <router-link :to="{name: 'offer-list', query: {id: order.order_id}}" data-mtaid="chartered.order_list.view_offer_list">报价详情</router-link>
                </div>
                <!-- <offers :order-id="order.order_id" :limit="4" type="card" :offer-len.sync="offerLen"></offers> -->
                <offers :order-id="order.order_id" :limit="4" type="card"></offers>
                <!-- <div v-if="!offerLen[order.order_id]" class="empty">暂无报价</div> -->
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <Page
      class="w-page"
      :total="pageCount"
      :current="pageIndex"
      :page-size="pageSize"
      :page-size-opts="pageSizeOpts"
      :placement="pageCount > 10 ? 'top' : 'bottom'"
      show-sizer
      show-total
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
      data-mtaid="chartered.order_list.toggle_page">
    </Page>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import ddb from '../assets/js/ddb/'
  import moment from 'moment'
  import offers from '../components/offers.vue'
  import countdown from '../components/countdown.vue'

  export default {
    components: {
      offers,
      countdown
    },
    data() {
      return {
        // offerLen: {}, // 相应订单报价数
        // 分布数据
        pageCount: 0,
        pageIndex: 1,
        pageSize: 10,
        pageSizeOpts: [10, 20, 30, 40, 50],

        // 表单数据
        filter: {
          id: '',
          status: '0',
          createTimeMin: '',
          createTimeMax: '',
          startDateMin: '',
          statDateMax: ''
        }
      }
    },
    computed: {
      ...mapState(['orderList', 'orderPageInfo'])
    },
    created() {
      this.init()
    },
    methods: {
      ...mapActions(['getOrderList', 'setPayInfo']),
      init(data = {}) {
        data = Object.assign({
          page_index: this.pageIndex,
          page_size: this.pageSize
        }, data)
        this.getOrderList({data}).then(res => {
          // 初始化分页信息
          this.pageCount = Number(this.orderPageInfo.pageCount) || 0
          this.pageIndex = Number(this.orderPageInfo.pageIndex) || 0
          this.pageSize = Number(this.orderPageInfo.pageSize) || 10
        })
      },
      viewOrder(id) {
        this.$router.push({
          name: 'order-details',
          query: {id}
        })
      },

      // 提交订单取消数据
      submitCancel: function(api, {order_id}) {
        let self = this
        ddb.get(api, {order_id}).then(res => {
          if (res.ret === 0) {
            ddb.tips('订单取消成功')
            self.init()
          } else {
            ddb.tips('订单取消失败')
          }
        })
      },
      cancelOrder(order) {
        let self = this
        let status = +order.display_status
        let api = 'chartered/cancel_order'
        let tips = '确定要取消订单吗？'
        let okText = '执意取消'
        let cancelText = '再等等'
        let canCancel = true

        // 1-抢单中、2-待支付、3-预约中、4-待出行、5-出行中、6-已取消、7-已关闭、8-已完成
        switch (status) {
          case 1:
            tips = '别急，报价正在路上，建议您再等等'
            break
          case 2:
            tips = '货比三家，其余报价正在赶来，建议您再等等'
            break
          case 3:
            api = 'chartered/refund_order'
            tips = '您已经支付成功，确定要取消订单吗？'
            okText = '确定'
            cancelText = '点错了'
            break
          case 4:
            api = 'chartered/refund_order'
            cancelText = '点错了'
            // 根据是否有手续费显示不同文案（发车前 24 小时后有手续费）
            // 4）已支付（发车时间-当前时间<24小时且发车时间-当前时间>4小时）
            // “取消订单将会扣除XXX元手续费，确定要取消订单吗？”---其中XXX为总金额*50%

            // 5）已支付（发车时间-当前时间<4小时且发车时间-当前时间>2小时）
            // “取消订单将会扣除XXX元手续费，确定要取消订单吗？”---其中XXX为总金额*20%

            // 6）已支付（发车时间-当前时间<2小时）
            // “距离发车时间已经不足2小时，订单不可取消”
            tips = '已经安排出车，取消订单将会扣除一定的手续费，确定要取消订单吗？'
            // let now = new Date().getTime()
            // let start = new Date(order.start_time.replace(/-/g, '/')).getTime()
            // let hour = (now - start) / 60 * 60 * 1000
            // // if (moment(now).isAfter(moment(order.start_time).subtract(24, 'hours'))) {
            // if (hour > 24) {
            //   tips = '正在为您安排车辆和司机，确定取消订单？'
            // } else if (hour > 4) {
            //   tips = '已经安排出车，取消订单将会扣除一定的手续费，确定要取消订单吗？'
            // } else if (hour > 2) {
            //   tips = '已经安排出车，取消订单将会扣除一定的手续费，确定要取消订单吗？'
            // } else {
            //   tips = '距离发车时间已经不足2小时，订单不可取消'
            //   okText = '确定'
            //   canCancel = false
            // }
            break
        }

        // 按钮配置
        let opts = [{
          txt: okText,
          // color: false,
          color: '#999',
          callback() {
            if (canCancel) {
              self.submitCancel(api, {
                order_id: order.order_id
              })
            }
          }
        }, {
          txt: cancelText,
          // color: false,
          color: '#FF9C00',
          callback() {
            // console.log('cancel')
          }
        }]

        ddb.confirm({
          title: '提示',
          msg: tips,
          opts
        })
      },
      toggleTab(name) {
        // switch (name) {
        //   case 'tab1':
        //     this.$router.push({
        //       name: 'order-place'
        //       // params: {userId: 123}
        //     })
        //     break
        //   case 'tab2':
        //     this.$router.push({
        //       name: 'order-details'
        //     })
        //     break
        // }
        this.$router.push({name})
      },
      pageChange(i) {
        this.pageIndex = i
        this.init()
      },
      pageSizeChange(size) {
        this.pageSize = size
        this.init()
      },
      formatDate(date) {
        return date ? moment(date).format('YYYY-MM-DD') : undefined
      },
      filterOrder(filter) {
        this.init({
          order_id: filter.id,
          order_status: filter.status,
          create_time_min: this.formatDate(filter.createTimeMin),
          create_time_max: this.formatDate(filter.createTimeMax),
          start_date_min: this.formatDate(filter.startDateMin),
          start_date_max: this.formatDate(filter.statDateMax)
        })
      },
      payOrder(order) {
        let offerInfo = order.offer_list[0]
        this.setPayInfo({data: offerInfo})
        ddb.session('chartered:pay-info', offerInfo)
        this.$router.push({
          name: 'pay-order',
          query: {id: order.order_id}
        })
        // let self = this
        // ddb.post('chartered/pay_order', {
        //   order_id: order.order_id,
        //   total_amount: order.amount
        // }).then(res => {
        //   if (res.ret === 0) {
        //     ddb.notify('支付成功')
        //     self.init()
        //   } else {
        //     ddb.notify('支付失败：' + res.msg)
        //   }
        // }).catch(err => {
        //   ddb.notify('支付失败：网络出错[' + err + ']，请检查网络后重试')
        // })
      },
      endTrip(id) {
        let self = this
        ddb.confirm({
          title: '结束行程',
          msg: '是否确定行程已结束？',
          opts: [{
            txt: '取消',
            // color: '#999',
            color: false
          }, {
            txt: '确定',
            color: '#FF9C00',
            callback() {
              ddb.get('chartered/complete_order', {order_id: id}).then(function(res) {
                if (res.ret === 0) {
                  ddb.tips('行程已结束！')
                } else {
                  ddb.tips('结束行程失败！')
                }
                self.init()
              })
            }
          }]
        })
      },
      countEnd() {
        console.log('countEnd')
        // 延迟刷新数据，避免服务器状态还未更改
        setTimeout(this.init, 1000)
      }
    }
  }
</script>