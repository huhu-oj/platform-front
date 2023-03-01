<template>
  <div style="margin-bottom: 20px">{{ solution.problem.title }}</div>
  <el-space wrap>
    <el-tag v-for="item in solution.labels">{{item.name}}</el-tag>
  </el-space>
  <el-divider/>
  <div v-html="solution.descriptionHtml"></div>
</template>

<script>
import {get as getSolution} from '@/api/solution'
export default {
  name: "SolutionDetail",
  props: {
    solution: {
      required:true,
      type: Object,
    }
  },
  data() {
    return {
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
