<template>
  <div class="index">

    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in 3" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="el-row">
        <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-lg-12">
          <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div class="el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-lg-12">
          <div id="myChart1" :style="{width: '100%', height: '300px'}"></div>
        </div>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>更新记录</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="更新日期"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="更新内容"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="贡献者"
          header-align="center">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '添加模块',
        address: '郝茂祥'
      }, {
        date: '2016-05-02',
        name: '添加模块',
        address: '郝茂祥'
      }, {
        date: '2016-05-02',
        name: '添加模块',
        address: '郝茂祥'
      }, {
        date: '2016-05-02',
        name: '添加模块',
        address: '郝茂祥'
      }]
    }
  },
  mounted () {
    this.getStatistics('entities_num')
    this.getStatistics('triples_num')
  },
  methods: {
    getStatistics (type) {
      this.$axios({
        method: 'get',
        url: 'http://210.13.50.98:10218/KG/search1/' + type
      }).then((resp) => {
        console.log(resp.data)
        if (type === 'entities_num') {
          this.entitiesNum = resp.data
          this.drawStatistics('myChart', resp.data.data, 10000000, '实体数')
        } else if (type === 'triples_num') {
          this.triplesNum = resp.data
          this.drawStatistics('myChart1', resp.data.data, 120000000, '三元组数')
        }
      }).catch(function (resp) {
        console.log('请求失败' + resp.status + ',' + resp.statusText)
      })
    },

    drawStatistics (elId, statisticsData, startValue, title) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(elId))
      // 绘制图表
      myChart.setOption({
        legend: {},
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: statisticsData.map(function (item) {
            return item['data']
          })
        },
        yAxis: {
          min: startValue,
          type: 'value',
          splitLine: {
            show: false
          }
        },
        series: [{
          name: title,
          type: 'line',
          data: statisticsData.map(function (item) {
            return item['count']
          })
        }],
        dataZoom: [{
          id: 'dataZoomEntity',
          type: 'slider',
          startValue: statisticsData[Math.max(0, statisticsData.length - 30)]['data']
        }],
        grid: [{
          left: '20%'
        }]
      })
      window.addEventListener('resize', myChart.resize)
    }
  }
}
</script>

<style>
  .index {
    display: flex;
    flex-direction:column;
    padding: 20px 10%;
  }
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
