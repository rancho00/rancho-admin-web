<template>
  <el-tabs v-model="activeName">
    <el-tab-pane></el-tab-pane>
    <el-tab-pane></el-tab-pane>
    <el-tab-pane label="日志" name="first">
      <log/>
    </el-tab-pane>
    <el-tab-pane label="异常日志" name="second">
      <error-log/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import log from './log'
import errorLog from './errorLog'
export default {
  name: 'index',
  components: { log , errorLog },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
<style>
</style>
