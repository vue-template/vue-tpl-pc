<template>
  <div id="app">
    <transition name="fade" mode="out-in" appear><router-view class="view"></router-view></transition>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="stylus">
  // @import './assets/css/main'
  // #app
  //   box-sizing border-box
  //   position relative
  //   height 100%
  //   overflow auto
  //   // overflow-scrolling touch
  //   color $black
  //   -webkit-font-smoothing: antialiased;
  //   -moz-osx-font-smoothing: grayscale;
  //   background #F5F5F5
  //   // &::-webkit-scrollbar
  //     // display none
  //   > .view
  //     box-sizing border-box
  //     position relative
  //     min-height 100%
</style>
