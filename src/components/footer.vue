<template>
  <footer>
    <div class="layout">
      <p class="contact">
        <span>客服电话：<em>0755-36901727 </em></span>
        <span>咨询QQ：<em>2017922504 </em></span>
        <span>商务合作：<em>vinson@dadabus.com</em></span>
      </p>
      <p class="copyright">Copyright © 2017 <span class="name">{{domainname}}</span>. All Rights Reserved. <span class="icp">{{icp}}</span></p>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'footer',
    data() {
      let isDadabusDomain = /buskeji\.com$/.test(location.hostname)
      return {
        domainname: isDadabusDomain ? 'dadabus' : 'buskeji',
        icp: isDadabusDomain ? '粤ICP备16040838号-2' : '粤ICP备16040838号-1'
      }
    }
  }
</script>