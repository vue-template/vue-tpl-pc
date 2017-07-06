<template>
  <div>
    test
  </div>
</template>

<script>
  // import {mapState, mapGetters, mapActions} from 'vuex'
  import vfooter from '../components/footer.vue'

  export default {
    name: 'test',
    components: {
      vfooter
    },
    // data() {
    //   return {
    //     failedImg: 'http://static.wechat.buskeji.com/webapp/image/failed-img.png'
    //     // failedImg: 'http://loc.wechat.buskeji.com/webapp/assets/img/icon-fail.png'
    //   }
    // },
    // computed: {
    //   ...mapState(['failImg', 'plate', 'borrowCount']),
    //   ...mapGetters(['validGoods'])
    // },
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
    }
    // methods: {
    //   ...mapActions(['getGoods', 'getBorrowCount']),
    //   init() {
    //     this.getGoods({
    //       api: 'borrow_goods/get_goods_list',
    //       data: {plate: this.plate}
    //     })

    //     this.getBorrowCount({
    //       api: 'borrow_member/my_borrow_count'
    //     })
    //   },
    //   imgFailed(e) {
    //     e.target.src = this.failImg
    //   },
    //   viewGoods(id) {
    //     this.$router.push({
    //       name: 'confirm-borrow',
    //       query: {id}
    //     })
    //   }
    // }
  }
</script>

<style lang="stylus" scoped>
</style>
