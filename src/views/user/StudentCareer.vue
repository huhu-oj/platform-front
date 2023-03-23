<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-statistic title="测验总数" :value="testCount"/>
      </el-col>
      <el-col :span="8">
        <el-statistic title="平均完成率" :value="averageCompletion"/>
      </el-col>
      <el-col :span="8">
        <el-statistic title="平均正确率" :value="averageCorrect"/>
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <el-row>
      <el-col :span="24">
        <v-chart :option="careerData" autosize class="chart"/>
      </el-col>
    </el-row>
  </el-card>

</template>

<script>
import {getRecords, getRecordsForTeacher} from "@/api/test";
import {uniqueObjArray, parseTime} from "@/utils";

import VChart from "vue-echarts";

export default {
  name: "StudentCareer",
  components: {
    VChart
  },
  props: ['studentId'],
  computed: {
    testCount() {
      return this.testRecords.length
    },
    tests() {
      if (!this.testCount) return
      return this.testRecords.map(record => record.test)
    },
    examinationPapers() {
      if (!this.tests) return
      return this.tests.map(test => test.examinationPaper)
    },
    examinationPaperProblems() {
      if (!this.examinationPapers) return
      return this.examinationPapers.map(p => p.examinationPaperProblems)
    },
    problems() { //这是二维数组
      if (!this.examinationPaperProblems) return
      return this.examinationPaperProblems.map(epps => epps.map(epp => epp.problem))
    },
    answerRecords() { //这是二维数组
      if (!this.testCount) return
      return this.tests.map(test => test.answerRecords)
    },
    averageCompletion() {
      if (!this.problems) return
      if (!this.answerRecords) return
      //统计平均完成率
      let result = 0
      this.problems.forEach((ps, i) => {
        //一场测验的完成率
        const problemCount = ps.length
        const submitProblemCount = uniqueObjArray(this.answerRecords[i].map(ar => ar.problem), 'id').length
        result += submitProblemCount / problemCount
      })
      return (result / this.problems.length * 100).toFixed(2) + '%'
    },
    averageCorrect() {
      if (!this.problems) return
      if (!this.answerRecords) return
      //统计平均完成率
      let result = 0
      this.problems.forEach((ps, i) => {
        //一场测验的完成率
        const problemCount = ps.length
        const correctProblemCount = uniqueObjArray(this.answerRecords[i].filter(ar => ar.executeResult.id === 1).map(ar => ar.problem), 'id').length
        result += correctProblemCount / problemCount
      })
      return (result / this.problems.length * 100).toFixed(2) + '%'
    },
    careerData() {
      let data0 = []
      if (this.tests) {
        data0 = this.tests.map((test, i) => {
          const startTime = test.startTime
          const score = this.testRecords[i].score
          const problemCount = this.problems[i].length
          const correctProblemCount = uniqueObjArray(this.answerRecords[i].filter(ar => ar.executeResult.id === 1).map(ar => ar.problem), 'id').length
          return {
            '时间': parseTime(startTime, `{y}-{m}-{d} ${test.title}`),
            '分数': score,
            '正确率': correctProblemCount / problemCount * 100
          }
        })

        //分数归一化处理
        const maxScore = Math.max(data0.map(d => d.score))
        const minScore = Math.min(data0.map(d => d.score))
        data0.forEach(d => {
          if (maxScore - minScore === 0) return
          d.score = (d.score - minScore) / (maxScore - minScore)
        })
        console.log(data0)
      }
      return {
        legend: {},
        tooltip: {},
        dataset: [
          {
            // 提供一份数据。
            dimensions: ['时间', '分数', '正确率'],
            source: data0
          },
        ],
        dataZoom: [
          {
            type: 'slider'
          },
          {
            type: 'inside'
          }
        ],
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。

        series: [{
          type: 'bar',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
        }, {
          type: 'line',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
        }]
      }
    }
  },
  data() {
    return {
      testRecords: [],
    }
  },
  watch: {
    studentId(newVal) {
      console.log(newVal)
      this.getStudentRecords()
    }
  },
  methods: {
    getRecords() {
      getRecords().then(data => {
        data.forEach(d => {
          d.test = JSON.parse(d.testJsonStr)
        })
        this.testRecords = data
      })
    },
    getStudentRecords() {
      getRecordsForTeacher(this.studentId).then(data => {
        data.forEach(d => {
          d.test = JSON.parse(d.testJsonStr)
        })
        this.testRecords = data
      })
    }
  },
  created() {

    if (!this.studentId) {
      this.getRecords()
    } else {
      this.getStudentRecords()
    }
  }
}
</script>

<style scoped>
.chart {
  height: 50vh;
}
</style>