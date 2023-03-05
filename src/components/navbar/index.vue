<template>
  <el-menu
      mode="horizontal"
      :ellipsis="false"
  >
    <slot name="left"></slot>
    <div class="vcenter logo">huhuOJ平台</div>
    <div class="flex-grow6"/>
    <el-menu-item>通知</el-menu-item>
    <el-sub-menu>
      <template #title>
        <el-avatar  :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" />
      </template>
      <template #default>
        <user-menu>
          <template #tail>
            <el-divider/>
            <el-menu-item index="" @click="open">退出登录</el-menu-item>
          </template>
        </user-menu>
      </template>
    </el-sub-menu>
    <slot name="right"></slot>
  </el-menu>
</template>

<script>
import userMenu from "@/components/UserMenu/index.vue";
import { ElMessageBox } from 'element-plus'
import {mapGetters} from "vuex";
export default {
  components: {
    userMenu
  },
  computed: {
    ...mapGetters([
        'user'
    ])
  },
  methods: {
    getUserInfo() {

    },
    open() {
      ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    }
  }
}
</script>

<style scoped>
.flex-grow6 {
  flex-grow: 6;
}
.logo {
  font-size: 30px;
}
</style>
