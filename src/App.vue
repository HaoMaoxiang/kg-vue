<template>
  <div id="app">
    <el-container>
      <el-header><Header/></el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer><Footer/></el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
export default {
  name: 'app',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
  body, p, ul, li{
    margin: 0px;
    padding: 0xp;
  }
  .el-container {
    min-height: 100vh;
  }
  .el-header {
    padding: 0px;
  }
  .el-main {
    background-color: aliceblue;
    color: #333;
  }
  .el-footer {
    background-color:#333;
    color: #E9EEF3;
    height: 160px !important;
  }
</style>
