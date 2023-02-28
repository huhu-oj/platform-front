<template>
  <el-menu
      mode="horizontal"
      :ellipsis="false"
  >
    <slot name="left"></slot>
    <div class="vcenter logo">huhuOJ平台</div>
    <div class="flex-grow6"/>
    <el-menu-item>Processing Center</el-menu-item>
    <el-sub-menu>
      <template #title>
        <el-avatar  :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'" />
      </template>
      <template #default>
        <user-menu>
          <template #tail>
            <el-divider/>
            <el-menu-item>退出登录</el-menu-item>
          </template>
        </user-menu>
      </template>
    </el-sub-menu>
    <slot name="right"></slot>
  </el-menu>
</template>

<script>
import userMenu from "@/components/UserMenu/index.vue";
export default {
  components: {
    userMenu
  },
  methods: {
    getUserInfo() {

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
