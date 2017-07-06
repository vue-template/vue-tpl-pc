<template>
  <div class="home">
    <vheader></vheader>
    <div class="main">
      <div class="layout">
        <Tabs class="w-tab" :value="tabValue" @on-click="toggleTab" data-mtaid="chartered.toggle_tab">
          <Tab-pane label="我要约车" :name="tab1Name"></Tab-pane>
          <Tab-pane label="我的订单" :name="tab2Name"></Tab-pane>
          <p slot="extra">客服热线：<em>0755-36901727</em></p>
        </Tabs>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" class="subview"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" class="subview"></router-view>
      </div>
    </div>
    <vfooter></vfooter>
    <Back-top :height="1200" :bottom="110" data-mtaid="chartered.backtop"></Back-top>
  </div>
</template>

<script>
  // import {mapState, mapGetters, mapActions} from 'vuex'
  import vheader from '../components/header.vue'
  import vfooter from '../components/footer.vue'
  import OrderPlace from './order-place'

  export default {
    name: 'chartered',
    components: {
      OrderPlace,
      vheader,
      vfooter
    },
    data() {
      // let tabName = this.$route.name
      let tabName = this.$route.fullPath
      let tab1Name = '/chartered/order-place'
      return {
        tabValue: tabName,
        tab1Name,
        tab2Name: tabName !== tab1Name ? tabName : '/chartered/order-list'
      }
    },
    watch: {
      $route(to, from) {
        // let tabName = to.name
        let tabName = to.fullPath
        this.tabValue = tabName
        this.tab2Name = tabName !== this.tab1Name ? tabName : this.tab2Name
      }
    },
    computed: {
      // ...mapState(['failImg', 'plate', 'borrowCount']),
      // ...mapGetters(['validGoods'])
      // tabValue() {
      //   return this.$route.name
      // },
      // tab2Name() {
      //   let routeName = this.$route.name
      //   console.log('test')
      //   return routeName !== 'order-place' ? routeName : this.lastTab2Name
      // }
    },
    created() {
      // let ddb = window.ddb
      // console.log(ddb)
      // ddb.user.syncLogin()
      // console.log(this.$ddb)
      // this.$dialog.confirm({
      // ddb.confirm({
      //   title: '选填标题',
      //   mes: '我有一个小毛驴我从来也不骑！',
      //   opts: () => {
      //     this.$dialog.toast({
      //       mes: '你点了确定',
      //       timeout: 1000
      //     })
      //   }
      // })
      // ddb.loading()
      // this.$http.get(ddb.config.api + 'borrow_goods/get_goods_list', {params: ddb.params})

      // this.init()
    },
    methods: {
      // ...mapActions(['getGoods', 'getBorrowCount']),
      // init() {
      //   this.getGoods({
      //     api: 'borrow_goods/get_goods_list',
      //     data: {plate: this.plate}
      //   })

      //   this.getBorrowCount({
      //     api: 'borrow_member/my_borrow_count'
      //   })
      // },
      // imgFailed(e) {
      //   e.target.src = this.failImg
      // },
      // viewGoods(id) {
      //   this.$router.push({
      //     name: 'confirm-borrow',
      //     query: {id}
      //   })
      // }
      toggleTab(path) {
        // console.log(this.$route.path.slice(this.$route.path.lastIndexOf('/') + 1))
        // console.log(this.$route.name)
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
        // this.$router.push({
        //   name,
        //   query: this.query
        // })
        this.$router.push({path})
      }
    }
  }
</script>
