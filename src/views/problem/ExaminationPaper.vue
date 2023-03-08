<template>
  <el-container>
    <el-header>
      <navbar/>
    </el-header>
    <el-main>
      <el-row justify="center" align="middle" gutter="20">
        <el-col :span="18">
          <el-steps :active="step" finish-status="finish" simple style="margin-bottom: 20px">
            <el-step title="未到测验时间" />
            <el-step title="测验开始" />
            <el-step title="测验已结束" />
          </el-steps>

          <mavon-editor
              v-model="test.examinationPaper.description"
              :subfield="false"
              :defaultOpen="'preview'"
              :editable="false"
              :toolbarsFlag="false"
              :boxShadow="false"
          />
          <div >
            <span v-if="step+1 === 1">测验未开始</span>
            <el-button v-if="step+1 === 2" @click="toProblem">进入测验</el-button>
            <el-button v-if="step+1 === 3" @click="toProblem">查看题目</el-button>
          </div>
<!--          <el-button @click="step++">下一阶段</el-button>-->
        </el-col>
      </el-row>
    </el-main>
    <el-footer>

    </el-footer>
  </el-container>

</template>

<script>
import navbar from "@/components/navbar";
import {get as getTest,getRecord} from '@/api/test'
import { mavonEditor } from 'mavon-editor'
import { ElNotification } from "element-plus";

export default {
  name: "ExaminationPaper",
  components: {
    navbar,mavonEditor
  },
  props: ['id'],
  data() {
    return {
      test: { examinationPaper: {problems: []}},
      step: 0,
    }
  },
  methods: {
    getTestInfo() {
      getTest(this.id).then(data=>{
        this.test = data.content[0]
        //判断阶段
        if (!this.test.enabled) {
          this.step = 2
          return
        }
        const currentTime = Date.parse(new Date())
        const startTime = Date.parse(this.test.startTime)
        const endTime = Date.parse(this.test.endTime)
        if (currentTime < startTime) {
          this.step = 0
        } else if (currentTime > startTime && currentTime < endTime) {
          this.step = 1
        } else {
          this.step = 2
        }
      })
    },
    toProblem() {
      this.$router.push({
            path: `/problem`,
            query: {examId: this.test.id}
          })
    }
  },
  created() {
    this.getTestInfo()
  }
}
</script>

<style scoped>

</style>
