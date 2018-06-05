<template>
  <div id="my-footer" style="text-align:center;">
    <p class="copyright">版权所有&#169; 2018-2019 国信优易数据有限公司</p>
    <img id="qrcode-img" v-bind:src="qrcodeUrl" class="hidden-sm-and-down">
  </div>
</template>

<script>
export default {
  name: 'my-footer',
  data () {
    return {
      qrcodeUrl: '/static/img/qrcode.jpg'
    }
  }
}
</script>

<style>
  #qrcode-img {
    float: right;
    margin: -150px 10px 10px 10px;
    width: 140px;
  }
  .copyright {
    font-size: 12px;
    line-height: 160px;
  }
</style>
