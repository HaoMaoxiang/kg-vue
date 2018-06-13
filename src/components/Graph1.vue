<template>
  <div>
    <div id='aaa' style='height: 100px;'></div>
  </div>
</template>

<script>
export default {
  props: ['info', 'entity'],
  data () {
    return {
    }
  },
  methods: {
    // 计算图显示高度
    selfHeight (size) {
      var height = Math.max((100 + Math.sqrt(size) * 88), 350)
      return height + 'px'
    },
    graphDataDemo (entity, data) {
      var res = {}
      var id = 0
      var linkId = 0
      var dataNodes = []
      var dataLinks = []
      // 通过字面量方式实现的函数each
      var each = function (object, callback) {
        var type = (function () {
          switch (object.constructor) {
            case Object:
              return 'Object'
            case Array:
              return 'Array'
            case NodeList:
              return 'NodeList'
            default:
              return 'null'
          }
        })()
        // 为数组或类数组时, 返回: index, value
        if (type === 'Array' || type === 'NodeList') {
          // 由于存在类数组NodeList, 所以不能直接调用every方法
          [].every.call(object, function (v, i) {
            return callback.call(v, i, v)
          })
        } else if (type === 'Object') {
          for (var i in object) {
            if (callback.call(object[i], i, object[i]) === false) {
              break
            }
          }
        }
      }

      // 去除所有a标签
      var replaceATag = function (str) {
        return str.replace(/<a>/g, '').replace(/<\/a>/g, '')
      }

      // 过长主语拆成2行
      var objectNameSplitIntoTwo = function (str) {
        if (str.length <= 10) return str
        var newstr = str.substr(0, str.length / 2) + '\n' + str.substr(str.length / 2, str.length)
        return newstr
      }

      // 主语节点
      dataNodes.push({
        id: id,
        name: entity,
        draggable: false,
        symbolSize: 80,
        symbol: 'circle',
        category: 0,
        itemStyle: {
          opacity: 1
        },
        showAdjacent: true,
        label: {
          formatter: function (params) {
            return objectNameSplitIntoTwo(params.data.name)
          },
          fontSize: 16,
          fontFamily: 'Microsoft YaHei',
          fontWeight: 'bolder'
        }
      })

      // this.nodeIndexToEdgeIndex[id] = []
      // this.nodeIndexToNodeIndex[id] = []
      id++

      each(this.info, function (p, o) {
        p = replaceATag(p)
        if (p === 'TYPE' || p === 'TAG' || p === 'DESC' || p === 'CATEGORY_ZH') {
          return
        }
        // 谓语节点
        var pid = id
        dataNodes.push({
          id: id,
          name: p,
          draggable: false,
          symbolSize: [70, 35],
          symbol: 'roundRect',
          category: 1,
          itemStyle: {
            opacity: 1
          },
          showAdjacent: false,
          label: {
            fontSize: 12,
            fontFamily: 'sans-serif',
            fontWeight: 'bold'
          }
          // slient:true
          // fixed:false
        })

        // this.nodeIndexToNodeIndex[id] = []
        // this.nodeIndexToEdgeIndex[id] = []

        dataLinks.push({
          source: 0,
          target: id,
          id: linkId,
          lineStyle: {
            opacity: 0.8
          }
        })
        // this.nodeIndexToEdgeIndex[0].push(linkId)
        // this.nodeIndexToNodeIndex[0].push(id)
        id++
        linkId++

        // 宾语节点
        for (var i in o) {
          var subo = replaceATag(o[i])
          dataNodes.push({
            id: id,
            name: subo,
            draggable: true,
            symbolSize: 40,
            symbol: 'circle',
            category: 2,
            itemStyle: {
              opacity: 1
            },
            label: {
              fontSize: 13,
              fontFamily: 'bold',
              fontWeight: 'Arial'
            }
          })
          dataLinks.push({
            source: pid,
            target: id,
            lineStyle: {
              opacity: 1
            },
            id: linkId
          })
          // this.nodeIndexToNodeIndex[pid].push(id)
          // this.nodeIndexToEdgeIndex[pid].push(linkId)
          id++
          linkId++
        }
      })
      res['nodes'] = dataNodes
      res['links'] = dataLinks
      return res
    },
    kgOptionDemo (entity, data) {
      var option = {
        title: {
          text: this.entity,
          top: 'top',
          left: 'center'
        },
        tooltip: {
          show: false
        },
        animation: false,
        animationDuration: 1,
        animationEasingUpdate: 1,
        series: [{
          name: this.entity,
          type: 'graph',
          layout: 'force',

          force: {
            repulsion: 700,
            edgeLength: 70,
            gravity: 0.7,
            layoutAnimation: true
          },
          categories: [
            {
              name: '主语',
              itemStyle: {
                color: 'RGB(225,79,56)'
              },
              label: {
                color: '#333',
                fontSize: 16,
                fontFamily: 'Microsoft YaHei',
                fontWeight: 'bolder'
              }
            },
            {
              name: '谓语',
              itemStyle: {
                color: 'RGB(231,175,74)'
              },
              label: {
                color: '#333',
                fontSize: 12,
                fontFamily: 'sans-serif',
                fontWeight: 'bold'
              }
            },
            {
              name: '宾语',
              itemStyle: {
                color: 'RGB(243,203,189)'
              },
              label: {
                formatter: function (obj) {
                  return obj.name
                  // return this.echartsTextTurncateForObject(obj.name)
                },
                fontSize: 13,
                fontFamily: 'Arial',
                fontWeight: 'bold',
                normal: {
                  show: true,
                  position: 'top'
                }
              }
            }
          ],
          data: this.graphDataDemo(entity, data)['nodes'],
          links: this.graphDataDemo(entity, data)['links'],
          focusNodeAdjacency: true,
          roam: true,
          label: {
            color: '#333',
            show: true
          },
          lineStyle: {
            normal: {
              color: '#333',
              opacity: 0.8,
              width: 1.5,
              curveness: 0.05,
              type: 'dotted'
            }
          }
        }]
      }
      return option
    },
    drawGraph () {
      var graphDom = document.getElementById('aaa')
      var option = this.kgOptionDemo(this.entity, this.info)
      graphDom.style.height = this.selfHeight(option.series[0].data.length)
      let myChart = this.$echarts.init(graphDom)
      myChart.setOption(option)
    }
  },
  watch: {
    info: function () {
      this.drawGraph()
    }
  }
}
</script>

<style>

</style>
