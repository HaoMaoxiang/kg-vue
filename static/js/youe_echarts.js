import echarts from 'echarts'
var force = {
  repulsion: 700,
  edgeLength: 70,
  gravity: 0.7,
  layoutAnimation: true
}

var subject = {
  symbol: 'circle',
  symbolSize: 80,
  draggable: false,
  color: 'RGB(225,79,56)',
  fontSize: 16,
  fontWeight: 'bolder',
  fontFamily: 'Microsoft YaHei',
  opacity: 1
}

var predicate = {
  symbol: 'roundRect',
  symbolSize: [70, 35],
  draggable: false,
  color: 'RGB(231,175,74)',
  fontSize: 12,
  fontWeight: 'bold',
  fontFamily: 'sans-serif',
  opacity: 1
}

var object = {
  symbol: 'circle',
  symbolSize: 40,
  draggable: true,
  color: 'RGB(243,203,189)',
  fontSize: 13,
  fontWeight: 'bold',
  fontFamily: 'Arial',
  opacity: 1
}

var edgeStyle = {
  opacity: 0.8,
  color: '#000000',
  width: 1.5,
  curveness: 0.05,
  type: 'dotted'
}

var WEB_ROOT_PATH = getRootPathWeb()

// 去除所有a标签
function replaceATag (str) {
  return str.replace(/<a>/g, '').replace(/<\/a>/g, '')
}

// 过长主语拆成2行
function objectNameSplitIntoTwo (str) {
  if (str.length <= 10) return str
  var newstr = str.substr(0, str.length / 2) + '\n' + str.substr(str.length / 2, str.length)
  return newstr
}

var nodeIndexToNodeIndex = {}
var nodeIndexToEdgeIndex = {}
var predicateShow = []
var myChart = null
var originOption = null

// 深度拷贝
var cloneObj = function (obj) {
  var newObj = {}
  if (obj instanceof Array) {
    newObj = []
  }
  for (var key in obj) {
    var val = obj[key]
    // newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
    newObj[key] = typeof val === 'object' ? cloneObj(val) : val
  }
  return newObj
}

// 过长字符缩减
function echartsTextTurncateForObject (name) {
  return echarts.format.truncateText(name, 300, object.fontSize + ' ' + object.fontFamily, '…')
}

// 画kg图 谓语也用节点表示
function kgOption1 (entity, data) {
  nodeIndexToNodeIndex = {}
  nodeIndexToEdgeIndex = {}
  predicateShow = []
  var dataNodes = []
  var dataLinks = []
  var id = 0
  var linkId = 0
  // 主语节点
  dataNodes.push({
    id: id,
    name: entity,
    draggable: subject.draggable,
    symbolSize: subject.symbolSize,
    symbol: subject.symbol,
    category: 0,
    itemStyle: {
      opacity: subject.opacity
    },
    showAdjacent: true,
    label: {
      formatter: function (params) {
        return objectNameSplitIntoTwo(params.data.name)
      },
      fontSize: subject.fontSize,
      fontFamily: subject.fontFamily,
      fontWeight: subject.fontWeight
    }

  })
  nodeIndexToEdgeIndex[id] = []
  nodeIndexToNodeIndex[id] = []
  id++

  each(data, function (p, o) {
    p = replaceATag(p)
    if (p === 'TYPE' || p === 'TAG' || p === 'DESC' || p === 'CATEGORY_ZH') {
      return
    }

    // 谓语节点
    var pid = id
    dataNodes.push({
      id: id,
      name: p,
      draggable: predicate.draggable,
      symbolSize: predicate.symbolSize,
      symbol: predicate.symbol,
      category: 1,
      itemStyle: {
        opacity: predicate.opacity
      },
      showAdjacent: false,
      label: {
        fontSize: predicate.fontSize,
        fontFamily: predicate.fontFamily,
        fontWeight: predicate.fontWeight
      }
      // slient:true
      // fixed:false
    })

    nodeIndexToNodeIndex[id] = []
    nodeIndexToEdgeIndex[id] = []

    dataLinks.push({
      source: 0,
      target: id,
      id: linkId,
      lineStyle: {
        opacity: edgeStyle.opacity
      }
    })
    nodeIndexToEdgeIndex[0].push(linkId)
    nodeIndexToNodeIndex[0].push(id)
    id++
    linkId++

    if (typeof (o) === 'string') { // string
      o = replaceATag(o)

      // 单宾语节点
      dataNodes.push({
        id: id,
        name: o,
        draggable: object.draggable,
        symbolSize: object.symbolSize,
        symbol: object.symbol,
        category: 2,
        itemStyle: {
          opacity: 0
        },
        label: {
          fontSize: object.fontSize,
          fontFamily: object.fontFamily,
          fontWeight: object.fontWeight
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
      nodeIndexToNodeIndex[pid].push(id)
      nodeIndexToEdgeIndex[pid].push(linkId)
      id++
      linkId++
    } else { // array
      // 多宾语节点
      each(o, function (index, subo) {
        subo = replaceATag(subo)
        dataNodes.push({
          id: id,
          name: subo,
          draggable: object.draggable,
          symbolSize: object.symbolSize,
          symbol: object.symbol,
          category: 2,
          itemStyle: {
            opacity: 0
          },
          label: {
            fontSize: object.fontSize,
            fontFamily: object.fontFamily,
            fontWeight: object.fontWeight
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
        nodeIndexToNodeIndex[pid].push(id)
        nodeIndexToEdgeIndex[pid].push(linkId)
        id++
        linkId++
      })
    }
  })

  var option = {
    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
      offset: 0,
      color: '#f7f8fa'
    }, {
      offset: 1,
      color: '#cdd0d5'
    }]),
    title: {
      text: entity,
      top: 'top',
      left: 'center'
    },
    tooltip: {
      show: true,
      formatter: function (params) {
        // console.log(params)
        if (params.dataType === 'node' && params.data.category === 2 && params.data.itemStyle.opacity !== 0 && echartsTextTurncateForObject(params.data.name) !== params.data.name) {
          return params.data.name
        }
      }
    },
    toolbox: {
      show: true,
      itemSize: 25,
      right: '5%',
      feature: {
        myTool1: {
          show: true,
          title: '显示',
          icon: 'image://' + WEB_ROOT_PATH + '/img/lookup2.png',
          onclick: function () {
            hideShowAllNode(true)
          }
        },
        myTool2: {
          show: true,
          title: '还原',
          icon: 'image://' + WEB_ROOT_PATH + '/img/restore.png',
          onclick: function () {
            hideShowAllNode(false)
          }
        },
        saveAsImage: {
          show: true,
          icon: 'image://' + WEB_ROOT_PATH + '/img/download.png'
        }
      }
    },
    animation:
        false,
    animationDuration:
        1,
    animationEasingUpdate:
        1,
    series:
        [{
          name: entity,
          type: 'graph',
          layout: 'force',
          // coordinateSystem:"cartesian2d",
          force: {
            repulsion: force.repulsion,
            edgeLength: force.edgeLength,
            layoutAnimation: force.layoutAnimation,
            gravity: force.gravity
          },
          categories: [
            {
              name: '主语',
              itemStyle: {
                color: subject.color
              },
              label: {
                fontSize: subject.fontSize,
                fontFamily: subject.fontFamily,
                fontWeight: subject.fontWeight
              }
            },
            {
              name: '谓语',
              itemStyle: {
                color: predicate.color
              },
              label: {
                fontSize: predicate.fontSize,
                fontFamily: predicate.fontFamily,
                fontWeight: predicate.fontWeight
              }
            },
            {
              name: '宾语',
              itemStyle: {
                color: object.color
              },
              label: {
                formatter: function (obj) {
                  // return obj.name
                  return echartsTextTurncateForObject(obj.name)
                },
                fontSize: predicate.fontSize,
                fontFamily: predicate.fontFamily,
                fontWeight: predicate.fontWeight
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
            // position: 'center',

          },
          edgeSymbol: ['', ''],
          edgeLabel: {
            show: false,
            color: 'blue'
            // formatter: function (x) {
            //     return x.data.name;
            // }
            // formatter:'{c}'
          },
          lineStyle: {
            color: '#000000',
            opacity: edgeStyle.opacity,
            width: 1.5,
            curveness: 0.05,
            type: 'dotted'
            // silent:true
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
        }]
  }

  return option
}

// 获取项目url根地址
function getRootPathWeb () {
  // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
  var curWwwPath = window.document.location.href
  // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
  var pathName = window.document.location.pathname
  var pos = curWwwPath.indexOf(pathName)
  // 获取主机地址，如： http://localhost:8083
  var localhostPaht = curWwwPath.substring(0, pos)
  // 获取带"/"的项目名，如：/uimcardprj
  var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1)
  return (localhostPaht + projectName)
}

function selfHeight (size) {
  var height = Math.max((100 + Math.sqrt(size) * 88), 350)
  console.log(height)
  return height + 'px'
}

// 画kg图
function kgOption2 (entity, data) {
  var dataNodes = []
  var dataLinks = []
  var id = 0
  dataNodes.push({
    id: id,
    name: entity,
    draggable: false,
    symbolSize: 40
  })
  id += 1

  each(data, function (p, o) {
    p = replaceATag(p)
    if (p === 'TYPE' || p === 'TAG' || p === 'DESC' || p === 'CATEGORY_ZH') {
      return
    }

    if (typeof (o) === 'string') { // string
      o = replaceATag(o)
      dataNodes.push({
        id: id,
        name: o,
        draggable: true,
        symbolSize: 20,
        symbol: 'roundRect'
      })

      dataLinks.push({
        source: 0,
        target: id,
        name: p
      })

      id += 1
    } else { // array
      each(o, function (index, subo) {
        subo = replaceATag(subo)
        dataNodes.push({
          id: id,
          name: subo,
          draggable: true,
          symbolSize: 20,
          symbol: 'roundRect'
        })
        dataLinks.push({
          source: 0,
          target: id,
          name: p
        })
        id += 1
      })
    }
  })

  var option = {
    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
      offset: 0,
      color: '#f7f8fa'
    }, {
      offset: 1,
      color: '#cdd0d5'
    }]),
    title: {
      text: 'test',
      top: 'top',
      left: 'center'
    },
    toolbox: {
      show: false,
      feature: {
        dataView: {
          show: true,
          readOnly: true
        },
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        }
      }
    },
    animationDuration: 1,
    animationEasingUpdate: 1,
    series: [{
      name: 'test',
      type: 'graph',
      layout: 'force',

      force: {
        repulsion: 250,
        edgeLength: 125
      },
      data: dataNodes,
      links: dataLinks,
      focusNodeAdjacency: true,
      roam: true,
      label: {
        normal: {
          show: true
        }
      },
      edgeSymbol: ['', 'arrow'],
      edgeLabel: {
        normal: {
          show: true,
          color: 'blue',
          formatter: function (x) {
            return x.data.name
          }
        }
      },
      lineStyle: {
        normal: {
          color: 'source',
          opacity: 0.7,
          width: 1,
          curveness: 0.1,
          type: 'solid'
        }
      }
    }]
  }

  return option
}

// 画kg图
function drawKg (entity, data, mc, optionMethon, graphDom) {
  var option = optionMethon(entity, data)
  originOption = option
  graphDom.style.height = selfHeight(option.series[0].data.length)
  myChart = mc
  myChart.setOption(option)
  myChart.on('click', hideShowNode)
}

// 影藏或者显示某个节点
function hideShowForNode (data, index, nodeOpacity, edgeOpacity, links) {
  var clickNode = data[index]
  if (clickNode.category === 2) return
  if (clickNode.showAdjacent === false) {
    nodeOpacity = 1
    edgeOpacity = 0.8
    clickNode.showAdjacent = true
    if (clickNode.category !== 0) {
      predicateShow.push(index)
    }
  } else {
    clickNode.showAdjacent = false
    if (clickNode.category !== 0) {
      // predicateShow.splice($.inArray(index, predicateShow), 1)
      predicateShow.splice(inArray(index, predicateShow), 1)
    }
  }
  if (clickNode.category === 0) {
    // $.each(predicateShow, function (i, ind) {
    //   setOpacity(ind, data, links, edgeOpacity, nodeOpacity)
    // })
    each(predicateShow, function (i, ind) {
      setOpacity(ind, data, links, edgeOpacity, nodeOpacity)
    })
  }
  setOpacity(index, data, links, edgeOpacity, nodeOpacity)
}

// 影藏或者显示某个节点e的周围连接节点
function hideShowNode (e) {
  var graph = myChart.getOption('graph')
  var data = graph.series[0].data
  var links = graph.series[0].links
  var nodeOpacity = 0
  var edgeOpacity = 0
  if (e.dataType === 'node') { // 点击节点
    var index = e.data.id
    hideShowForNode(data, index, nodeOpacity, edgeOpacity, links)
  } else if (e.dataType === 'edge') {
    var i = e.data.target
    hideShowForNode(data, i, nodeOpacity, edgeOpacity, links)
  }
  myChart.setOption(graph)
}

// 隐藏或者显示所有节点
function hideShowAllNode (showAll) {
  predicateShow = []
  if (showAll) {
    var graph = cloneObj(originOption)
    var data = graph.series[0].data
    var links = graph.series[0].links
    for (var i = 0; i < data.length; ++i) {
      if (data[i].category === 1) {
        hideShowForNode(data, data[i].id, 0, 0, links)
      }
    }
  } else {
    graph = originOption
  }
  myChart.setOption(graph)
}

// 设置某个节点的透明度
function setOpacity (index, nodes, links, edgeOpacity, nodeOpacity) {
  // $.each(nodeIndexToEdgeIndex[index], function (i, edgeIndex) {
  //   links[edgeIndex].lineStyle.opacity = edgeOpacity
  // })
  // $.each(nodeIndexToNodeIndex[index], function (i, nodeIndex) {
  //   nodes[nodeIndex].itemStyle.opacity = nodeOpacity
  // })
  each(nodeIndexToEdgeIndex[index], function (i, edgeIndex) {
    links[edgeIndex].lineStyle.opacity = edgeOpacity
  })
  each(nodeIndexToNodeIndex[index], function (i, nodeIndex) {
    nodes[nodeIndex].itemStyle.opacity = nodeOpacity
  })
}

function inArray (needle, array, bool) {
  if (typeof needle === 'string' || typeof needle === 'number') {
    for (var i in array) {
      if (needle === array[i]) {
        if (bool) {
          return i
        }
        return true
      }
    }
    return false
  }
}

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

export {
  drawKg,
  kgOption1,
  kgOption2
}
