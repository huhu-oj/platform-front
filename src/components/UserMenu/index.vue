<template>
  <el-menu router>
    <slot name="head"/>
    <el-menu-item index="/answer" v-if="userRoles.indexOf('学生') !== -1">
      <span>做题分析</span>
    </el-menu-item>
    <el-menu-item index="/answer/teacher" v-if="userRoles.indexOf('老师') !== -1">
      <span>学生做题分析</span>
    </el-menu-item>
    <el-menu-item index="/my-test">
      <span>我的测验</span>
    </el-menu-item>
    <el-divider/>
    <el-menu-item>
      <span>个人空间</span>
    </el-menu-item>
    <el-menu-item index="/test/student" v-if="userRoles.indexOf('学生') !== -1">
      <span>测验分析</span>
    </el-menu-item>
    <el-menu-item index="/test/teacher" v-if="userRoles.indexOf('老师') !== -1">
      <span>测验分析</span>
    </el-menu-item>
    <slot name="tail"/>
  </el-menu>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters([
        "userRoles"
    ])
  }
}
</script>

<style scoped>

</style>
