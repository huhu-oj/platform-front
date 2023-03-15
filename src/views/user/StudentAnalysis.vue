<template>

  <el-container>
    <el-header>
      <el-select
          v-model="studentId"
        filterable
        remote
        reserve-keyword
        placeholder="请输入学生姓名"
        :remote-method="searchUser"
        :loading="loading"
      >
        <el-option
          v-for="item in userList"
          :key="item.id"
          :value="item.id"
          :label="item.nickName"
        />
      </el-select>
    </el-header>
    <el-main>
      <student-career :student-id="this.studentId"/>
    </el-main>
  </el-container>
</template>

<script>
import StudentCareer from "@/views/user/StudentCareer.vue";
import {getByUsername} from "@/api/user";

export default {
  name: "StudentAnalysis",
  components: {StudentCareer},

  data() {
    return {
      studentId: null,
      userList: [],
      loading: false
    }
  },
  methods: {
    searchUser(name) {
      this.loading = true
      getByUsername(name).then(data=>{
        this.loading = false
        this.userList = data
      })
    }
  }
}
</script>

<style scoped>

</style>