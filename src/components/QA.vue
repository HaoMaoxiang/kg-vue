<template>
  <div class="qa">

    <h2 style="text-align:center">基于深度学习的智慧QA，助力您成为朋友圈中的最强大脑</h2>

    <el-row style="width:100%">
      <el-col :xs="20" :sm="20" :md="22" :lg="22" :xl="22">
        <el-input v-model="question" placeholder="Search for..." @keyup.enter.native="sendQA(question)"/>
      </el-col>
      <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2">
        <el-button type="primary" icon="el-icon-search" style="width:100%" @click="sendQA(question)"/>
      </el-col>
    </el-row>

    <ul class="example-qa">
      <li>e.g. <a @click="sendQA('姚明有多高？')">姚明有多高？</a></li>
      <li>e.g. <a @click="sendQA('姚明的女儿？')">姚明的女儿？</a></li>
      <li>e.g. <a @click="sendQA('周杰伦的代表作品有哪些？')">周杰伦的代表作品有哪些？</a></li>
    </ul>
    <div class="tip" v-bind:class="{hidden: isHidden}">
      <p>问题：{{ question }}</p>
      <br>
      <p>回答：{{ answer }}</p>
    </div>
    <hr style="color:#333">
  </div>
</template>

<script>
export default {
  data () {
    return {
      question: '',
      answer: '',
      isHidden: true
    }
  },
  methods: {
    sendQA (question) {
      this.isHidden = false
      this.question = question
      this.$axios({
        method: 'get',
        url: 'http://210.13.50.98:10218/KG/qa?q=' + question
      }).then((resp) => {
        console.log(resp.data)
        this.answer = resp.data
      }).catch(function (resp) {
        console.log('请求失败' + resp.status + ',' + resp.statusText)
      })
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
