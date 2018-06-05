<template>
  <div class="qa">

    <h2 style="text-align:center">基于深度学习的智慧QA，助力您成为朋友圈中的最强大脑</h2>

    <el-row style="width:100%">
      <el-col :xs="20" :sm="20" :md="22" :lg="22" :xl="22">
        <el-input v-model="input" placeholder="Search for..."></el-input>
      </el-col>
      <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2">
        <el-button type="primary" icon="el-icon-search" style="width:100%"></el-button>
      </el-col>
    </el-row>

    <ul class="example-qa">
      <li>e.g. <a>姚明有多高？</a></li>
      <li>e.g. <a>姚明的女儿是谁？</a></li>
      <li>e.g. <a>姚明的妻子的身高是多少？</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: ''
    }
  }
}
</script>

<style>
  .qa {
    display: flex;
    flex-direction:column;
    padding: 20px 20%;
  }

  .example-qa {
    padding: 5px;
  }

  .example-qa li {
    font-size: 14px;
    list-style-type:none; 
    padding: 3px;
  }

  .example-qa li a {
    color: blue !important;
    cursor: pointer;
  }

</style>
