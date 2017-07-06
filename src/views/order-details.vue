<template>
  <div class="order-details">
    <Breadcrumb class="w-breadcrumb">
      <Breadcrumb-item><router-link to="order-list">我的订单</router-link></Breadcrumb-item>
      <Breadcrumb-item>订单详情</Breadcrumb-item>
    </Breadcrumb>
    <div class="order-info w-cardbox">
      <Card class="w-card" :bordered="false">
        <h3 class="title" slot="title">行程信息</h3>
        <ul class="list">
          <li v-if="orderInfo.refund_status == 2"><span class="dt">退款金额</span> <span class="dd">{{orderInfo.refund_total_amount | fen2yuan}}元</span></li>
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
      <Card v-if="offerInfo.price" class="w-card">
        <h3 class="title" slot="title">报价信息</h3>
        <ul class="list">
          <li><span class="dt">报价车企</span> <span class="dd">{{offerInfo.company_name}}</span></li>
          <li><span class="dt">总费用</span> <span class="dd">{{offerInfo.price | fen2yuan}}元</span></li>
          <li><span class="dt">用车费</span> <span class="dd">{{offerInfo.car_price | fen2yuan}}元</span></li>
          <li v-if="offerInfo.road_toll > 0"><span class="dt">路桥费</span> <span class="dd">{{offerInfo.road_toll | fen2yuan}}元</span></li>
          <li v-if="offerInfo.room > 0"><span class="dt">食宿费</span> <span class="dd">{{offerInfo.room | fen2yuan}}元</span></li>
          <li v-if="offerInfo.park > 0"><span class="dt">停车费</span> <span class="dd">{{offerInfo.park | fen2yuan}}元</span></li>
          <li v-if="offerInfo.other > 0"><span class="dt">其它费用</span> <span class="dd">{{offerInfo.other | fen2yuan}}元</span></li>
        </ul>
      </Card>
      <Card v-if="schedulingList.length" class="w-card">
        <h3 class="title" slot="title">排班信息</h3>
        <ul v-for="(item, i) in schedulingList" class="list">
          <li><span class="dt">车牌号{{item | role(i)}}</span> <span class="dd">{{item.car_no}}</span></li>
          <li><span class="dt">车型</span> <span class="dd">商务{{item.car_seat}}</span></li>
          <li><span class="dt">司机</span> <span class="dd">{{item.driver_name}}</span></li>
          <li><span class="dt">联系电话</span> <span class="dd">{{item.mobile}}</span></li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  // import ddb from '../assets/js/ddb/'

  export default {
    data() {
      return {
        orderId: this.$route.query.id
      }
    },
    computed: {
      ...mapState(['orderInfo']),
      offerInfo(state) {
        return state.orderInfo.offer_info || {}
      },
      schedulingList(state) {
        return state.orderInfo.scheduling_list || []
      }
    },
    filters: {
      role(item, i) {
        if (+item.role === 2) {
          return '（队长车）'
        } else {
          return i + 1
        }
      }
    },
    created() {
      this.init()
    },
    methods: {
      ...mapActions(['getOrderInfo']),
      init() {
        this.getOrderInfo({
          data: {order_id: this.orderId}
        })
      }
    }
  }
</script>