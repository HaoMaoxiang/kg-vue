<template>
  <div class="display">
    <h2 style="text-align:center">通用知识图谱</h2>

    <el-row style="width:100%">
      <el-col :xs="20" :sm="20" :md="22" :lg="22" :xl="22">
        <el-input v-model="entity" placeholder="entity" @keyup.enter.native="query(entity)"/>
      </el-col>
      <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2">
        <el-button type="primary" icon="el-icon-search" style="width:100%" @click="query(entity)"/>
      </el-col>
    </el-row>

    <el-card>
      <!-- <Graph v-bind:info="infobox"></Graph> -->
      <Graph1 v-bind:info="infobox" v-bind:entity="viewEntity"></Graph1>
    </el-card>

    <el-card v-show="!isEmpty(desc)">
      <div slot="header" class="clearfix">
        <span>Information</span>
      </div>
      <div v-for="i in desc" :key="i" class="item" v-html="i">
      </div>
    </el-card>

    <el-card v-show="!isEmpty(infobox)">
      <div slot="header" class="clearfix">
        <span>InfoBox</span>
      </div>
      <el-table class="item"
        :data="infoboxData(infobox)"
        stripe
        style="width: 100%">
        <el-table-column
          prop="key"
          label="属性"
          width="180"
          header-align="center">
        </el-table-column>
        <el-table-column label="属性值" header-align="center">
          <template slot-scope="scope">
            <div v-html="scope.row.value"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isEmpty(types)">
      <div slot="header" class="clearfix">
        <span>DBpedia Type</span>
      </div>
      <el-table class="item"
        :data="tableData(types)"
        stripe
        style="width: 100%">
        <el-table-column
          prop="key"
          label="属性"
          width="180"
          header-align="center">
        </el-table-column>
        <el-table-column label="属性值" header-align="center">
          <template slot-scope="scope">
            <div v-html="scope.row.value"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isEmpty(tags)">
      <div slot="header" class="clearfix">
        <span>Tags</span>
      </div>
      <span v-for="tag in tags" :key="tag">
        <el-tag type="success" style="margin-right: 5px">{{ tag }}</el-tag>
      </span>
    </el-card>

    <el-card v-show="!isEmpty(categories)">
      <div slot="header" class="clearfix">
        <span>Category</span>
      </div>
      <span v-for="category in categories" :key="category">
        <el-tag type="success" style="margin-right: 5px">{{ category }}</el-tag>
      </span>
    </el-card>
  </div>
</template>

<script>

// import {drawKg, kgOption1} from '../../static/js/youe_echarts.js'

import Graph1 from '../components/Graph1.vue'

export default {
  components: {
    Graph1
  },
  data () {
    return {
      entity: '',
      viewEntity: this.$route.params.entity,
      kgBase: this.$route.params.kg_base,
      desc: [],
      infobox: {},
      tags: [],
      types: [],
      categories: []
    }
  },
  created () {
    this.$axios({
      method: 'get',
      url: 'http://210.13.50.98:10218/KG/search1/info.do?entity=' + this.viewEntity + '&kg_base=' + this.kgBase
    }).then((resp) => {
      console.log(resp.data)
      this.desc = resp.data.data.DESC
      this.tags = resp.data.data.TAG
      this.types = resp.data.data.TYPE
      this.categories = resp.data.data.CATEGORY
      this.infobox = this.getInfobox(resp.data.data)
    }).catch(function (resp) {
      console.log('请求失败' + resp.status + ',' + resp.statusText)
    })
  },
  mounted () {
    // this.display(this.infobox)
  },
  methods: {
    getInfobox (data) {
      var set = new Set(['DESC', 'TAG', 'TYPE', 'CATEGORY_ZH', 'CATEGORY'])
      var res = {}
      for (var k in data) {
        if (!set.has(k)) {
          res[k] = data[k]
        }
      }
      return res
    },
    infoboxData (data) {
      var res = []
      for (var k in data) {
        var temp = {}
        temp['key'] = k
        temp['value'] = data[k].join('、')
        res.push(temp)
      }
      return res
    },
    tableData (data) {
      var res = []
      for (var k in data) {
        var temp = {}
        temp['key'] = 'type'
        temp['value'] = data[k]
        res.push(temp)
      }
      return res
    },
    isEmpty (data) {
      if (data === undefined || data.length === 0 || JSON.stringify(data) === JSON.stringify({})) {
        return true
      }
      return false
    }
    // display (infobox) {
    //   var myChart = this.$echarts.init(document.getElementById('graph'))
    //   this.sleep(500)
    //   drawKg(this.viewEntity, infobox, myChart, kgOption1, document.getElementById('graph'))
    //   window.onresize = function () {
    //     myChart.resize()
    //   }
    // }
  }
}
</script>

<style>
  .display {
    display: flex;
    flex-direction:column;
    padding: 20px 10%;
  }

  .display a {
    color: #333;
  }
</style>
