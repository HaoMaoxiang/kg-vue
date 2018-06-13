<template>
  <div id='graph' style="height: 300px">
  </div>
</template>

<script>
export default {
  props: ['info'],
  data () {
    return {
      force: {
        repulsion: 700,
        edgeLength: 70,
        gravity: 0.7,
        layoutAnimation: true
      },
      subject: {
        symbol: 'circle',
        symbolSize: 80,
        draggable: false,
        color: 'RGB(225,79,56)',
        fontSize: 16,
        fontWeight: 'bolder',
        fontFamily: 'Microsoft YaHei',
        opacity: 1
      },
      predicate: {
        symbol: 'roundRect',
        symbolSize: [70, 35],
        draggable: false,
        color: 'RGB(231,175,74)',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        opacity: 1
      },
      object: {
        symbol: 'circle',
        symbolSize: 40,
        draggable: true,
        color: 'RGB(243,203,189)',
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        opacity: 1
      },
      edgeStyle: {
        opacity: 0.8,
        color: '#000000',
        width: 1.5,
        curveness: 0.05,
        type: 'dotted'
      },
      // 谓语显示列表
      predicateShow: [],
      nodeIndexToNodeIndex: {},
      nodeIndexToEdgeIndex: {},
      myChart: null
    }
  },
  mounted: function () {
    this.drawKg('苏州', this.info, this.myChart, this.domId)
  },
  methods: {
    // 去除所有a标签
    replaceATag (str) {
      return str.replace(/<a>/g, '').replace(/<\/a>/g, '')
    },
    // 过长主语拆成2行
    objectNameSplitIntoTwo (str) {
      if (str.length <= 10) return str
      var newstr = str.substr(0, str.length / 2) + '\n' + str.substr(str.length / 2, str.length)
      return newstr
    },
    // 深度拷贝
    cloneObj (obj) {
      var newObj = {}
      if (obj instanceof Array) {
        newObj = []
      }
      for (var key in obj) {
        var val = obj[key]
        // newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
        newObj[key] = typeof val === 'object' ? this.cloneObj(val) : val
      }
      return newObj
    },
    // 过长字符缩减
    echartsTextTurncateForObject (name) {
      return this.$echarts.format.truncateText(name, 300, this.object.fontSize + ' ' + this.object.fontFamily, '…')
    },
    // 计算图显示高度
    selfHeight (size) {
      var height = Math.max((100 + Math.sqrt(size) * 88), 350)
      console.log(height)
      return height + 'px'
    },
    // 通过字面量方式实现的函数each
    each (object, callback) {
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
    },
    // 画kg图，谓语也用节点表示
    kgOption (entity, data) {
      this.nodeIndexToNodeIndex = {}
      this.nodeIndexToEdgeIndex = {}
      this.predicateShow = []

      var dataNodes = []
      var dataLinks = []
      var id = 0
      var linkId = 0

      // 主语节点
      dataNodes.push({
        id: id,
        name: entity,
        draggable: this.subject.draggable,
        symbolSize: this.subject.symbolSize,
        symbol: this.subject.symbol,
        category: 0,
        itemStyle: {
          opacity: this.subject.opacity
        },
        showAdjacent: true,
        label: {
          formatter: function (params) {
            return this.objectNameSplitIntoTwo(params.data.name)
          },
          fontSize: this.subject.fontSize,
          fontFamily: this.subject.fontFamily,
          fontWeight: this.subject.fontWeight
        }
      })

      this.nodeIndexToEdgeIndex[id] = []
      this.nodeIndexToNodeIndex[id] = []
      id++

      this.each(data, function (p, o) {
        p = this.replaceATag(p)
        if (p === 'TYPE' || p === 'TAG' || p === 'DESC' || p === 'CATEGORY_ZH') {
          return
        }
        // 谓语节点
        var pid = id
        dataNodes.push({
          id: id,
          name: p,
          draggable: this.predicate.draggable,
          symbolSize: this.predicate.symbolSize,
          symbol: this.predicate.symbol,
          category: 1,
          itemStyle: {
            opacity: this.predicate.opacity
          },
          showAdjacent: false,
          label: {
            fontSize: this.predicate.fontSize,
            fontFamily: this.predicate.fontFamily,
            fontWeight: this.predicate.fontWeight
          }
          // slient:true
          // fixed:false
        })

        this.nodeIndexToNodeIndex[id] = []
        this.nodeIndexToEdgeIndex[id] = []

        dataLinks.push({
          source: 0,
          target: id,
          id: linkId,
          lineStyle: {
            opacity: this.edgeStyle.opacity
          }
        })
        this.nodeIndexToEdgeIndex[0].push(linkId)
        this.nodeIndexToNodeIndex[0].push(id)
        id++
        linkId++

        // 宾语节点
        this.each(o, function (index, subo) {
          subo = this.replaceATag(subo)
          dataNodes.push({
            id: id,
            name: subo,
            draggable: this.object.draggable,
            symbolSize: this.object.symbolSize,
            symbol: this.object.symbol,
            category: 2,
            itemStyle: {
              opacity: 0
            },
            label: {
              fontSize: this.object.fontSize,
              fontFamily: this.object.fontFamily,
              fontWeight: this.object.fontWeight
            }

          })
          dataLinks.push({
            source: pid,
            target: id,
            lineStyle: {
              opacity: 0
            },
            id: linkId
          })
          this.nodeIndexToNodeIndex[pid].push(id)
          this.nodeIndexToEdgeIndex[pid].push(linkId)
          id++
          linkId++
        })
      })

      var option = {
        // backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
        //   offset: 0,
        //   color: '#f7f8fa'
        // }, {
        //   offset: 1,
        //   color: '#cdd0d5'
        // }]),
        title: {
          text: entity,
          top: 'top',
          left: 'center'
        },
        tooltip: {
          show: true,
          formatter: function (params) {
            if (params.dataType === 'node' && params.data.category === 2 && params.data.itemStyle.opacity !== 0 && this.echartsTextTurncateForObject(params.data.name) !== params.data.name) {
              return params.data.name
            }
          }
        },
        animation: false,
        animationDuration: 1,
        animationEasingUpdate: 1,
        series: [
          {
            name: entity,
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: this.force.repulsion,
              edgeLength: this.force.edgeLength,
              layoutAnimation: this.force.layoutAnimation,
              gravity: this.force.gravity
            },
            categories: [
              {
                name: '主语',
                itemStyle: {
                  color: this.subject.color
                },
                label: {
                  fontSize: this.subject.fontSize,
                  fontFamily: this.subject.fontFamily,
                  fontWeight: this.subject.fontWeight
                }
              },
              {
                name: '谓语',
                itemStyle: {
                  color: this.predicate.color
                },
                label: {
                  fontSize: this.predicate.fontSize,
                  fontFamily: this.predicate.fontFamily,
                  fontWeight: this.predicate.fontWeight
                }
              },
              {
                name: '宾语',
                itemStyle: {
                  color: this.object.color
                },
                label: {
                  formatter: function (obj) {
                    return obj.name
                    // return this.echartsTextTurncateForObject(obj.name)
                  },
                  fontSize: this.predicate.fontSize,
                  fontFamily: this.predicate.fontFamily,
                  fontWeight: this.predicate.fontWeight
                }
              }
            ],
            data: dataNodes,
            links: dataLinks,
            focusNodeAdjacency: true,
            roam: true,
            label: {
              show: true,
              color: '#000000'
            },
            edgeSymbol: ['', ''],
            edgeLabel: {
              show: false,
              color: 'blue'
            },
            lineStyle: {
              color: '#000000',
              opacity: this.edgeStyle.opacity,
              width: 1.5,
              curveness: 0.05,
              type: 'dotted'
            },
            emphasis: {
              label: {
                show: false
              },
              edgeLabel: {
                show: false
              }
            },
            textStyle: {
              color: '#000000'
            }
          }
        ]
      }
      return option
    },
    // 画KG图
    drawKg (entity, data, graphDom) {
      var option = this.kgOption(entity, data)
      // graphDom.style.height = this.selfHeight(option.series[0].data.length)
      this.myChart = this.$echarts.init(this.domId)
      this.myChart.setOption(option)
      // 点击隐藏节点
    }
  }
}
</script>

<style>

</style>
