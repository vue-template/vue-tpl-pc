<template>
  <div class="loading">
    <Spin size="large"></Spin>
  </div>
</template>

<script>
  // import {mapState, mapGetters, mapActions} from 'vuex'
  import ddb from '../assets/js/ddb/'
  // import moment from 'moment'

  export default {
    name: 'loading',
    // data() {
    //   return {}
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
      ddb.loading()
      // ddb.login()
      // console.log('wwwwwwww', moment().format('dddd'))
      // console.log('test')
      // ddb.ajax({
      //   url: 'chartered/submit_order',
      //   method: 'post',
      //   data: {test: 1},
      //   headers: {'content-type': 'application/x-www-form-urlencoded'}
      // })
      // ddb.post('chartered/submit_order', {test: 1}).then(res => {
      //   // console.log(res)
      // })
      // ddb.get('authentication/auth_verify', {
      //   mobile: '12312345678',
      //   auth_code: '4321'
      // }).then(res => {
      //   console.log(res)
      // })
    }
  }
</script>

<style lang="stylus" scoped>
  .loading
    display flex
    align-items center
    justify-content center
    background #fff
</style>
