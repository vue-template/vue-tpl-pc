<template>
  <div class="login">
    <div class="logo"></div>
    <div class="reg"><a :href="regUrl" data-mtaid="chartered.login.注册">注册</a></div>

    <div class="login-wrap">
      <div class="login-box">
        <ul>
          <li class="mobile"><input type="tel" v-model="mobile" maxlength="11" autofocus @keydown.enter="getAuthCode" placeholder="请输入已绑定企业平台的手机号"></li>
          <li v-if="errmsg" class="errmsg">{{errmsg}}</li>
          <li class="code">
            <input type="tel" v-model="authCode" @keydown.enter="login" placeholder="请输入验证码">
            <button :class="{'disabled': !cansend}" @click="getAuthCode" data-mtaid="chartered.login.获取验证码">{{authText}}</button>
          </li>
          <li class="btn"><button @click="login" :class="{'disabled': !valid}" data-mtaid="chartered.login.登录">登录</button></li>
          <li class="info">想了解更多请拨打客服热线 0755-36901727</li>
        </ul>
      </div>
    </div>

    <div class="tabs">
      <div class="cover"></div>
      <div class="tab">
        <img src="../assets/img/login_icon1.png" height="78" width="90">
        <p>专为企业用户设计</p>
      </div>
      <div class="tab midd">
        <img src="../assets/img/login_icon2.png" height="78" width="90">
        <p>多个订单同时下达</p>
      </div>
      <div class="tab">
        <img src="../assets/img/login_icon3.png" height="78" width="90">
        <p>报价信息更详细</p>
      </div>
    </div>

    <vfooter></vfooter>
  </div>
</template>

<script>
  import vfooter from '../components/footer.vue'
  import ddb from '../assets/js/ddb/'

  export default {
    name: 'home',
    components: {
      vfooter
    },
    data() {
      return {
        authText: '获取验证码',
        mobile: '',
        authCode: '',
        errmsg: '',
        regUrl: ddb.config.regUrl + '?referrer=' + encodeURIComponent(location.href)
      }
    },
    watch: {
      mobile() {
        this.errmsg = ''
      }
    },
    computed: {
      // 是否可发送验证码请求
      cansend() {
        return /^1\d{10}$/.test(this.mobile) && /^重新获取|获取验证码$/.test(this.authText)
      },

      // 表单是否有可提交状态
      valid() {
        // return /^1\d{10}$/.test(this.mobile) && /^\d{4,6}$/.test(this.code)
        return /^1\d{10}$/.test(this.mobile) && this.authCode
      }
    },
    destroyed() {
      clearInterval(ddb.timer) // 清除定时器
    },
    methods: {
      countdown() {
        let self = this
        let duration = 60 // 验证码有效期60秒
        this.authText = duration + 's 重新获取'
        ddb.timer = setInterval(function() {
          duration--
          if (duration === 0) { // 倒计时结束
            self.authText = '重新获取'
            clearInterval(ddb.timer)
          } else {
            self.authText = duration + 's 重新获取'
          }
        }, 1000)
      },
      getAuthCode() {
        if (!this.cansend) return
        let self = this
        ddb.get('authentication/send_auth_msg', {
          mobile: this.mobile
        }).then(res => {
          if (res.ret !== 0) {
            alert(res.msg)
          } else {
            this.countdown()
            ddb.tips('验证码已发送至 ' + self.mobile)
          }
        })
      },
      login() {
        if (!this.valid) return
        let self = this
        ddb.get('authentication/auth_verify', {
          mobile: this.mobile,
          auth_code: this.authCode
        }).then(res => {
          if (res.ret === 0) {
            ddb.cookie('mobile', res.data.mobile, {expires: 1, path: '/'})
            ddb.cookie('user_id', res.data.user_id, {expires: 1, path: '/'})
            ddb.cookie('ddb_token', res.data.token, {expires: 1, path: '/'})
            ddb.cookie('company_name', res.data.company_name, {expires: 1, path: '/'})
            ddb.cookie('user_name', res.data.user_name, {expires: 1, path: '/'})

            // 登录后根据来源路径跳转
            let referrer = ddb.getParam('referrer')
            if (referrer) {
              if (/^http[s]?:/i.test(referrer)) {
                location.replace(referrer)
              } else {
                self.$router.replace(referrer)
              }
            } else {
              // self.$router.replace('chartered')
              history.go(-1)
            }
          } else {
            if (res.ret === 7001) {
              self.errmsg = '您的账号尚未开通权限'
            } else {
              alert(res.msg)
            }

            if (!self.cansend) {
              self.authText = '重新获取'
              clearInterval(ddb.timer)
            }
          }
        })
      }
    }
  }
</script>
