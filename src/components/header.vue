<template>
  <header>
    <div class="layout">
      <h1>企业用车平台</h1>
      <div v-if="userinfo.logined" class="loginbar logined">
        <span class="username">{{userinfo.companyname}} - {{userinfo.username}}</span>
        <a class="logout" @click="logout">退出</a>
      </div>
      <div v-else class="loginbar">
        <router-link to="login">登录</router-link>
        <!-- <a :href="regUrl">注册</a> -->
      </div>
    </div>
  </header>
</template>

<script>
  import {mapGetters} from 'vuex'
  import ddb from '../assets/js/ddb/'

  export default {
    name: 'header',
    // data() {
    //   return {
    //     regUrl: ddb.config.regUrl + '?referrer=' + encodeURIComponent(location.href)
    //   }
    // },
    computed: {
      ...mapGetters(['userinfo'])
    },
    methods: {
      logout() {
        ddb.logout()
      }
    }
  }
</script>