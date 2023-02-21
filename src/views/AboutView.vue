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
      <el-container>
        <el-aside width="50%">
          <el-tabs type="border-card" >
            <el-tab-pane label="User" >
              User
              <div style="height: 900px">123</div>
              123
            </el-tab-pane>
            <el-tab-pane label="User">
              <div style="height: 900px">123</div>
              dsadsad
            </el-tab-pane>
            <el-tab-pane label="User" class="scroll">
              <el-scrollbar>
                User
                <div style="height: 900px">123</div>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="User" class="scroll">
              <el-scrollbar>
                User
                <div style="height: 900px">123</div>
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>
        </el-aside>
        <el-main>123</el-main>
      </el-container>
    </el-main>
    <el-footer>123</el-footer>
  </el-container>
</template>
<script>
export default {}
</script>
<style>
.container {
  overflow: hidden;
  height: 100vh;
}

.main {
  flex: 1;
  flex-shrink: 0;
  /*height: 0;*/
  width: 100%;
  display: flex;
}

.scroll {
  overflow: scroll;
  /*height: 100%;*/
}

.left {
  overflow: scroll;
  height: 100%;
}

.right {
  height: 100%;
}
</style>