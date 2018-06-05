<template>
  <el-row>
    <!-- logo -->
    <el-col :span="6" class="logo-box hidden-sm-and-down">
      <img v-bind:src="logo01" class="logo"/>
    </el-col>
    <el-col :span="6" class="logo-box hidden-md-and-up">
      <img v-bind:src="logo02" class="logo"/>
    </el-col> <!-- end:logo -->

    <!-- navMenu -->
    <el-col :span="18">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
      background-color="grey" text-color="aliceblue" active-text-color="#FFD700">

        <el-menu-item index="1" class="hidden-sm-and-down">
          <router-link to="/"><p>首页</p></router-link>
        </el-menu-item>

        <el-submenu index="2" class="hidden-sm-and-down">
          <template slot="title">知识图谱</template>
          <el-menu-item index="2-1">
            <router-link to="/search"><p>展示平台</p></router-link>
          </el-menu-item>
          <el-menu-item index="2-2">
            <router-link to="/api"><p>API</p></router-link>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="3" class="hidden-sm-and-down">
          <router-link to="/qa"><p>智能问答</p></router-link>
        </el-menu-item>

        <el-menu-item index="4" style="float:right" class="hidden-sm-and-down">
          <router-link to="/about"><p>关于我们</p></router-link>
        </el-menu-item>

        <el-submenu index="5" style="float:right" class="hidden-md-and-up">
          <template slot="title"><i class="el-icon-menu"/></template>
          <el-menu-item index="1">
            <router-link to="/"><p>首页</p></router-link>
          </el-menu-item>
          <el-menu-item index="2-1">
            <router-link to="/search"><p>展示平台</p></router-link>
          </el-menu-item>
          <el-menu-item index="2-2">
            <router-link to="/api"><p>API</p></router-link>
          </el-menu-item>
          <el-menu-item index="3">
            <router-link to="/qa"><p>智能问答</p></router-link>
          </el-menu-item>
          <el-menu-item index="4">
            <router-link to="/about"><p>关于我们</p></router-link>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col> <!-- end:navMenu -->
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '1',
      logo01: './static/img/logo01.png',
      logo02: './static/img/logo02.png'
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color: aliceblue !important;
  }

  .router-link p {
    width: 100%;
  }
  .logo-box {
    background-color: grey;
    height: 60px;
    display: flex;
    flex-direction: column;
  }
  .logo {
    align-self: center;
    margin: 5px 0px;
    height: 50px;
  }
</style>
