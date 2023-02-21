<template>
  <el-container class="container">
    <el-header>
      <el-menu
          mode="horizontal"
          :ellipsis="false"
      >
<!--        <div class="flex-grow1"/>-->
        <el-menu-item>LOGO</el-menu-item>
        <div class="flex-grow6"/>
        <el-menu-item>Processing Center</el-menu-item>
        <el-sub-menu>
          <template #title>123</template>
        </el-sub-menu>
<!--        <div class="flex-grow1"/>-->
      </el-menu>
    </el-header>
    <el-main class="main">
      <el-row>
        <el-col :span="12" class="left">
            <el-tabs type="border-card" style="">
              <el-scrollbar>
              <el-tab-pane label="User" style="overflow: auto">User
                <div style="height: 900px">123</div>
              </el-tab-pane>
              <el-tab-pane label="Config">Config</el-tab-pane>
              <el-tab-pane label="Role">Role</el-tab-pane>
              <el-tab-pane label="Task">Task</el-tab-pane>
              </el-scrollbar>
            </el-tabs>
        </el-col>
        <el-col :span="12" class="left">
          123
        </el-col>
      </el-row>
    </el-main>
    <el-footer>123</el-footer>
  </el-container>
</template>
<script>
export default {

}
</script>
<style>
.container {
  overflow: hidden;
  height: 100%;
}
.main {
  overflow: hidden;
  /*height: 100%;*/
}
.left {
  /*overflow: hidden;*/
  /*height: 100%;*/
}
.right {
  height: 100%;
}
</style>