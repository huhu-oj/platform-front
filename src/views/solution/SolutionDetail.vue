<template>
  <div style="height: calc(100vh - 190px)">
    <el-scrollbar>
      <h1 >{{ solution.problem.title }}</h1>
      <el-space wrap>
        <el-tag v-for="item in solution.labels">{{item.name}}</el-tag>
      </el-space>
      <el-divider/>
      <!--  <div v-html="solution.descriptionHtml"></div>-->
      <mavon-editor
          v-model="solution.description"
          :subfield="false"
          :defaultOpen="'preview'"
          :editable="false"
          :toolbarsFlag="false"
          :boxShadow="false"
      />
    </el-scrollbar>
  </div>

</template>

<script>
import { mavonEditor } from 'mavon-editor'
import {get as getSolution} from '@/api/solution'
export default {
  name: "SolutionDetail",
  components: {
    mavonEditor
  },
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
