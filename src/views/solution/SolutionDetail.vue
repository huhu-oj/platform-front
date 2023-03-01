<template>
  <div style="margin-bottom: 20px">1.两束之后</div>
  <el-space wrap>
    <el-tag>数字</el-tag>
    <el-tag>标签</el-tag>
    <el-tag>数字</el-tag>
    <el-tag>数字</el-tag>
  </el-space>
  <el-divider/>
</template>

<script>
import {get as getSolution} from '@/api/solution'
export default {
  name: "SolutionDetail",
  data() {
    return {
      solution: {},
    }
  },
  methods: {
    getSolution() {
      getSolution(this.solution.id).then(data=>{
        this.solution = data
      })
    }
  }
}
</script>

<style scoped>

</style>
