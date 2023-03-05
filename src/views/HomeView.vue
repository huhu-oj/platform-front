<template>
  <el-container>
    <el-header>
      <navbar>
        <template #left>
          <div style="display: flex;flex-grow: 1"></div>
        </template>
        <template #right>
          <div style="display: flex;flex-grow: 1"></div>
        </template>
      </navbar>
    </el-header>
    <el-row justify="center" style="margin-top: 20px">
      <el-col :span="18">
        <el-container>
          <el-aside width="20%">
            <div class="user-info">
              <el-image style="width: 100px; height: 100px"
                        :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" fit="fill"/>
              <div>{{user.nickName}}</div>
            </div>
            <el-divider/>
            <user-menu/>
          </el-aside>
          <el-main>
            <router-view/>
          </el-main>
        </el-container>
      </el-col>

    </el-row>
    <el-footer class="user-footer">Footer</el-footer>
  </el-container>
</template>

<script>
import userMenu from "@/components/UserMenu/index.vue";
import navbar from "@/components/navbar/index.vue";

import {mapGetters} from "vuex";
export default {
  name: 'HomeView',
  components: {
    navbar,userMenu
  },
  computed: {
    ...mapGetters([
        'user'
    ])
  },
  methods: {
    getUser() {

    }
  }
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
.user-footer {
  text-align: center;
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
