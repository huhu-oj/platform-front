<template>
  <el-menu router>
    <slot name="head"/>
    <el-menu-item index="/answer">
      <span>做题分析</span>
    </el-menu-item>
    <el-menu-item index="/my-test">
      <span>我的测验</span>
    </el-menu-item>
    <el-divider/>
    <el-menu-item>
      <span>个人空间</span>
    </el-menu-item>
    <el-menu-item>
      <span>测验分析</span>
    </el-menu-item>
    <slot name="tail"/>
  </el-menu>
</template>

<script>
export default {
}
</script>

<style scoped>

</style>