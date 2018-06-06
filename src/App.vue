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
  .hidden {
    display:none;
  }
  .tip {
    padding: 8px 16px;
    background-color: #eceeff;
    border-radius: 4px;
    border: 1px solid #506aff;
    border-left: 5px solid #506aff;
    margin: 20px 0;
  }
  .el-table {
    text-align: center;
  }
  .el-card {
    margin: 10px 0px;
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
    background-color:rgb(30, 78, 121);
    color: #E9EEF3;
    height: 120px !important;
  }
</style>
