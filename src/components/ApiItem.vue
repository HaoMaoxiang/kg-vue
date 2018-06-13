<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>{{ apiDataItem.title }}</span>
    </div>
    <div class="api-content">
      <p class="code">{{ apiDataItem.api }}</p>
      <div class='notes'>
        <p>{{ apiDataItem.note }}</p>
      </div>
      <p>返回格式说明：</p>
      <el-card body-style="background-color: rgb(248, 248, 248); padding: 5px;">
        <pre>{{apiDataItem.response}}</pre>
      </el-card>
    </div>
  </el-card>
</template>

<script>
export default {
  props: ['apiDataItem']
}
</script>

<style>

</style>
