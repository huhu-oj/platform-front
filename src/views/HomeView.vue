<template>
  <el-container>
    <el-header>
      <el-menu
          mode="horizontal"
          :ellipsis="false"
      >
        <div class="flex-grow1"/>
        <el-menu-item>LOGO</el-menu-item>
        <div class="flex-grow6"/>
        <el-menu-item>Processing Center</el-menu-item>
        <el-sub-menu>
          <template #title>123</template>
        </el-sub-menu>
        <div class="flex-grow1"/>
      </el-menu>
    </el-header>
    <el-row justify="center">
      <el-col :span="18">
        <el-container>
          <el-aside width="20%">
            <div class="user-info">
              <el-image style="width: 100px; height: 100px"
                        :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" fit="fill"/>
              <div>无糖学霸</div>
            </div>
            <el-divider/>
            <el-menu>
              <el-menu-item>
                <el-icon>
                  <icon-menu/>
                </el-icon>
                <span>Navigator Two</span>
              </el-menu-item>
              <el-divider/>
              <el-menu-item>
                <el-icon>
                  <document/>
                </el-icon>
                <span>Navigator Three</span>
              </el-menu-item>
              <el-menu-item>
                <el-icon>
                  <setting/>
                </el-icon>
                <span>Navigator Four</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
<!--            <div style="height: 900px"></div>-->
          </el-main>
        </el-container>

      </el-col>

    </el-row>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>

export default {
  name: 'HomeView',
}
</script>
<style>
.user-info {
  /*display: inline-block;*/
  display: flex;
  /*垂直排列*/
  flex-direction: column;
  align-items: center; /*由于flex-direction: column，因此align-items代表的是水平方向*/
  justify-content: center; /*由于flex-direction: column，因此justify-content代表的是垂直方向*/
}

.flex-grow1 {
  flex-grow: 1;
}

.flex-grow2 {
  flex-grow: 2;
}

.flex-grow3 {
  flex-grow: 3;
}

.flex-grow4 {
  flex-grow: 4;
}

.flex-grow5 {
  flex-grow: 5;
}

.flex-grow6 {
  flex-grow: 6;
}

.el-divider--horizontal {
  width: 90% !important;
  margin: 5px auto !important;
}
</style>
