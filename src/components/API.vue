<template>
  <div class="api">
    <h3 style="border-bottom: 1px solid #B0B0B0;">API调用</h3>
    <div v-for="apiDataItem in apiData" :key="apiDataItem.message">
      <api-item v-bind:apiDataItem="apiDataItem"></api-item>
    </div>
  </div>
</template>

<script>
import ApiItem from '../components/ApiItem.vue'
export default {
  components: {
    ApiItem
  },
  data () {
    return {
      apiData: [
        {
          title: '1.获取所有知识库的同义词列表 (mention -> entity)',
          api: 'http://210.13.50.98:10218/KG/api/query.do?mention=mention_name',
          note: '输入代指(mention)，返回所有知识库中对应实体(entity)的列表。',
          response: '{\n' +
                    '  message: "获取所有数据库的同义词列表",\n' +
                    '  code: 200,\n' +
                    '  data: {\n' +
                    '    bdbaike: [entity_list1],   //百度百科对应的实体列表\n' +
                    '    hdbaike: [entity_list2],   //互动百科对应的实体列表\n' +
                    '    zhwiku:  [entity_list3]    //中文维基对应的实体列表\n' +
                    '  },\n' +
                    '  success: true\n' +
                    '}\n'
        },
        {
          title: '2.获取单个知识库的同义词列表 (mention -> entity)',
          api: 'http://210.13.50.98:10218/KG/api/query.do?mention=mention_name&kg_base=kg_base_name',
          note: '输入代指(mention)和知识库(kg_base_name:可选bdbaike,hdbaike,zhwiki)，返回对应知识库中对应实体(entity)的列表。',
          response: '{\n' +
                    '  message: "获取单个数据库的同义词列表",\n' +
                    '  code: 200,\n' +
                    '  data: [entity_list]  //单个知识库中对应的实体列表\n' +
                    '  success: true\n' +
                    '}\n'
        },
        {
          title: '3.获取所有知识库中的实体知识 (entity -> knowledge)',
          api: 'http://210.13.50.98:10218/KG/api/info.do?entity=entity_name',
          note: '输入实体名称(entity)，返回所有知识库中对应实体知识。',
          response: '{\n' +
                    '  message: "获取全部数据库中实体的全部信息",\n' +
                    '  code: 200,\n' +
                    '  data: {\n' +
                    '    bdbaike: { //百度百科对应的实体知识\n' +
                    '      "predicate1": [object_list1],\n ' +
                    '      ...\n' +
                    '      "predicaten": [object_listn]\n' +
                    '    },\n' +
                    '    hdbaike: { //互动百科对应的实体知识\n' +
                    '      "predicate1": [object_list1],\n ' +
                    '      ...\n' +
                    '      "predicaten": [object_listn]\n' +
                    '    },\n' +
                    '    zhwiki: { //中文维基对应的实体知识\n' +
                    '      "predicate1": [object_list1],\n ' +
                    '      ...\n' +
                    '      "predicaten": [object_listn]\n' +
                    '    }\n' +
                    '  },\n' +
                    '  success: true\n' +
                    '}\n'
        },
        {
          title: '4.获取单个知识库中的实体知识 (entity -> knowledge)',
          api: 'http://210.13.50.98:10218/KG/api/info.do?entity=entity_name&kg_base=kg_base_name',
          note: '输入实体名称(entity)和知识库(kg_base_name:可选bdbaike,hdbaike,zhwiki)，返回对应知识库中的实体知识。',
          response: '{\n' +
                    '  message: "获取单个数据库中实体的全部信息",\n' +
                    '  code: 200,\n' +
                    '  data: { //知识库中对应的实体知识\n' +
                    '    "predicate1": [object_list1],\n ' +
                    '    ...\n' +
                    '    "predicaten": [object_listn]\n' +
                    '  },\n' +
                    '  success: true\n' +
                    '}\n'
        },
        {
          title: '5.获取所有知识库中的实体的属性值 (entity&attribute -> value)',
          api: 'http://210.13.50.98:10218/KG/api/attr.do?entity=entity_name&attribute=attribute_name',
          note: '输入实体名称(entity)和属性(attribute)，返回所有知识库中其对应的属性值。',
          response: '{\n' +
                    '  message: "获取全部数据库中实体的属性值",\n' +
                    '  code: 200,\n' +
                    '  data: {\n' +
                    '    bdbaike: [value_list],\n' +
                    '    hdbaike: [value_list],\n' +
                    '    zhwiki: [value_list],\n' +
                    '  },\n' +
                    '  success: true\n' +
                    '}\n'
        },
        {
          title: '6.获取单个知识库中的实体的属性值 (entity&attribute -> value)',
          api: 'http://210.13.50.98:10218/KG/api/attr.do?entity=entity_name&attribute=attribute_name&kg_base=kg_base_name',
          note: '输入实体名称(entity)、属性(attribute)和知识库(kg_base_name:可选bdbaike,hdbaike,zhwiki)，返回单个知识库中其对应的属性值。',
          response: '{\n' +
                    '  message: "获取全部数据库中实体的属性值",\n' +
                    '  code: 200,\n' +
                    '  data: [value_list]\n' +
                    '  success: true\n' +
                    '}\n'
        },
        {
          title: '7.获取实体对齐结果(entity (in kg_base)-> entity (in other kg_bases))',
          api: 'http://210.13.50.98:10218/KG/api/sameAs.do?entity=entity_name&kg_base=kg_base_name',
          note: '输入实体名称(entity)和知识库(kg_base_name:可选bdbaike,hdbaike,zhwiki)，返回其他知识库中的对齐实体。',
          response: '{\n' +
                    '  message: "获取实体对齐结果",\n' +
                    '  code: 200,\n' +
                    '  data: {\n' +
                    '    other_kg_base_name1: [entity_list],\n' +
                    '    other_kg_base_name2: [entity_list]\n' +
                    '  },\n' +
                    '  success: true\n' +
                    '}\n'
        }
      ]
    }
  }
}
</script>

<style>
  .api {
    padding: 20px 10%;
  }
  .notes {
    color: gray;
    border-left-style: solid;
    border-left-color: gray;
    padding: 5px 10px;
  }
  .api-content p {
    font-size: 15px;
    margin: 5px 0px;
  }
  .api-content .code {
    color: brown;
  }
</style>
