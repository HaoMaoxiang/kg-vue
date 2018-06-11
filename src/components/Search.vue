<template>
  <div class="search">

    <h2 style="text-align:center">通用知识图谱</h2>

    <el-row style="width:100%; padding-left: 10%; padding-right: 10%;">
      <el-col :xs="20" :sm="20" :md="22" :lg="22" :xl="22">
        <el-input v-model="entity" placeholder="entity" @keyup.enter.native="query(entity)"/>
      </el-col>
      <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2">
        <el-button type="primary" icon="el-icon-search" style="width:100%" @click="query(entity)"/>
      </el-col>
    </el-row>

    <el-card v-bind:class="{hidden: isEmpty(data.data.bdbaike) || isEmpty(data.data.bdbaike) || isEmpty(data.data.bdbaike)}">
      <div class="el-card is-always-shadow" v-bind:class="{hidden: isEmpty(data.data.bdbaike)}">
        <div class="el-card__header bg-success">
          <div class="clearfix">
            <span>百度百科</span>
          </div>
        </div>
        <div class="el-card__body" v-for="o in data.data.bdbaike" :key="o">
          <router-link :to="{name:'Display',params:{entity: o, kg_base: 'bdbaike'}}">
            <span style="color: #409eff">{{ o }}</span>
          </router-link>
        </div>
      </div>

      <div class="el-card is-always-shadow" v-bind:class="{hidden: isEmpty(data.data.hdbaike)}">
        <div class="el-card__header bg-warning">
          <div class="clearfix">
            <span>互动百科</span>
          </div>
        </div>
        <div class="el-card__body" v-for="o in data.data.hdbaike" :key="o">
          <router-link :to="{name:'Display',params:{entity: o, kg_base: 'hdbaike'}}">
            <span style="color: #409eff">{{ o }}</span>
          </router-link>
        </div>
      </div>

      <div class="el-card is-always-shadow" v-bind:class="{hidden: isEmpty(data.data.zhwiki)}">
        <div class="el-card__header bg-info">
          <div class="clearfix">
            <span>维基百科</span>
          </div>
        </div>
        <div class="el-card__body" v-for="o in data.data.zhwiki" :key="o">
          <router-link :to="{name:'Display',params:{entity: o, kg_base: 'zhwiki'}}">
            <span style="color: #409eff">{{ o }}</span>
          </router-link>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      entity: '',
      data: {'data': {'bdbaike': [], 'hdbaike': [], 'zhwiki': []}}
    }
  },
  methods: {
    query (entity) {
      this.entity = entity
      this.$axios({
        method: 'get',
        url: 'http://210.13.50.98:10218/KG/search1/query.do?mention=' + entity
      }).then((resp) => {
        console.log(resp.data)
        this.data = resp.data
        if (this.isEmpty(this.data.data.bdbaike) && this.isEmpty(this.data.data.hdbaike) && this.isEmpty(this.data.data.zhwiki)) {
          this.message('提示', '你要查询的' + entity + '不存在')
        }
        sessionStorage.setItem('entityList', JSON.stringify(resp.data))
      }).catch(function (resp) {
        console.log('请求失败' + resp.status + ',' + resp.statusText)
      })
    },
    isEmpty (array) {
      if (array === undefined || array.length === 0) {
        return true
      }
      return false
    },

    message (title, content) {
      this.$alert(content, title, {
        confirmButtonText: '确定'
      })
    }
  },
  mounted: function () {
    this.data = JSON.parse(sessionStorage.getItem('entityList'))
  }
}
</script>

<style>
  .search {
    display: flex;
    flex-direction:column;
    padding: 20px 10%;
  }
</style>
