<template>
  <el-container>
    <el-header>
      <navbar/>
    </el-header>
    <el-main>
      <el-row justify="center">
        <el-col :span="12" >
          <div>{{test.title}}</div>
          <el-statistic title="测验分数" :value="testResult.score" />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import navbar from "@/components/navbar/index.vue";
import {get as getTest, getRecord} from "@/api/test";
export default {
  name: "TestResultDetail",
  components: {
    navbar
  },
  props: ['id'],
  data() {
    return {
      testResult: {},
      test: {}
    }
  },
  methods: {
    getTestResult() {
      getRecord(this.id).then(data=>{
        this.testResult = data
      })
    },
    getTest() {
      getTest(this.id).then(data=>{
        this.test = data.content[0]
      })
    }
  },
  mounted() {
    this.getTestResult()
    this.getTest()
  }
}
</script>

<style scoped>

</style>