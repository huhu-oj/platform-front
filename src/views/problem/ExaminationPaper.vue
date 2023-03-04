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
          <div v-html="examinationPaper.descriptionHtml"/>
          <div v-if="step+1 === 1">
            <span>测验未开始</span>
          </div>
          <div v-if="step+1 === 2">
            <el-button @click="toProblem">进入测验</el-button>
          </div>
          <div v-if="step+1 === 3">
            <el-button @click="toProblem">查看题目</el-button>
          </div>
          <el-button @click="step++">下一阶段</el-button>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>

    </el-footer>
  </el-container>

</template>

<script>
import navbar from "@/components/navbar";
import {get as getPaper} from '@/api/examinationPaper'
export default {
  name: "ExaminationPaper",
  components: {
    navbar
  },
  props: ['id'],
  data() {
    return {
      examinationPaper: {},
      step: 0,
    }
  },
  methods: {
    getPaperInfo() {
      getPaper(this.id).then(data=>{
        this.examinationPaper = data.content[0]
      })
    },
    toProblem() {
      this.$router.push({
            path: `/problem/${this.examinationPaper.problems[0].id}`,
            query: {examId: this.examinationPaper.id}
          })
    }
  },
  created() {
    this.getPaperInfo()
  }
}
</script>

<style scoped>

</style>
