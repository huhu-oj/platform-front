<template>
  <el-container>
    <el-header>
      <navbar/>
    </el-header>
    <el-main>
      <!--      <div>{{ test.title }}</div>-->
      <el-statistic title="测验分数" :value="testResult.score"/>
      <el-row justify="center">
        <el-col :span="24">
          <v-chart :option="option" autosize class="chart"/>
          <v-chart :option="option1" autosize class="chart"/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import navbar from "@/components/navbar/index.vue";
import VChart from "vue-echarts";
import {getRecord} from "@/api/test";

import {uniqueArr} from "@/utils";

export default {
  name: "TestResultDetail",
  components: {
    navbar, VChart
  },
  props: ['id'],
  computed: {
    test() {
      if (!this.testResult) return
      return this.testResult.test
    },
    examinationPaper() {
      if (!this.test) return
      return this.test.examinationPaper
    },
    examinationPaperProblems() {
      if (!this.examinationPaper) return
      return this.examinationPaper.examinationPaperProblems
    },
    problems() {
      if (!this.examinationPaperProblems) return
      return this.examinationPaperProblems.map(epp => epp.problem)
    },
    answerRecords() {
      if (!this.test) return
      return this.test.answerRecords
    },
    option() {
      if (!this.examinationPaperProblems) return
      if (!this.answerRecords) return
      //统计
      const problems = this.examinationPaperProblems
      const ARGroup = this.answerRecords.groupBy(ar => ar.problem.title)
      const data0 = problems.map(p => {
        const title = p.problem.title
        if (!ARGroup[title]) {
          return {
            title,
            '未通过': 0,
            '已通过': 0
          }
        }
        const acCount = ARGroup[title].filter(ar => ar.executeResult.id === 1).length
        const unacCount = ARGroup[title].length - acCount
        return {
          title,
          '未通过': unacCount,
          '已通过': acCount
        }
      })
      return {
        legend: {},
        tooltip: {},
        dataset: [
          {
            // 提供一份数据。
            dimensions: ['title', '未通过', '已通过'],
            source: data0
          },
        ],

        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {type: 'category'},
        // 声明一个 Y 轴，数值轴。
        yAxis: {},
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。

        series: [{
          // name: '未通过',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
        }, {
          // name: '未通过',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
        }]
      }
    },
    option1() {

      if (!this.examinationPaperProblems) return
      if (!this.answerRecords) return
      const problems = this.examinationPaperProblems
      //知识点名称
      const knowledgeNames = uniqueArr(problems.map(p => p.problem.problemKnowledges || [])
          .reduce((a, b) => a.concat(b)).map(k => k && k.knowledge.name))
      //回答正确的题目
      const rightProblemTitles = this.answerRecords.filter(ar=>ar.executeResult.id === 1).map(ar=>ar.problem.title)
      //全部题目通过的情况
      //遍历知识点获得权重累加和
      const data1 = knowledgeNames.map(name => {
        const weight = problems.map(p => p.problem.problemKnowledges)
            .reduce((a, b) => a.concat(b))
            .filter(k => k.knowledge.name === name)
            .map(k => k.weight)
        let rightWeight = []
        try {
          rightWeight = problems.filter(p => rightProblemTitles.indexOf(p.problem.title) !== -1)
              .map(p => p.problem.problemKnowledges)
              .reduce((a, b) => a.concat(b))
              .filter(k => k.knowledge.name === name)
              .map(k => k.weight)
        } catch (e) {
          // console.log(e)
        }
        let percent = Math.floor(rightWeight.reduce((a, b) => a + b, 0) / weight.reduce((a, b) => a + b, 0) *10000)/100
        if (!isFinite(percent)) {
          percent = 0
        }
        return {
          knowledgeName: name,
          '知识点掌握程度': percent
        }
      })

      return {
        legend: {},
        tooltip: {},
        dataset: [
          {
            // 提供一份数据。
            dimensions: ['knowledgeName', '知识点掌握程度'],
            source: data1
          },
        ],

        series: [{
          type: 'bar',
          label: {
            show: true
          },
        }],
        // 设置 x 轴和 y 轴的配置
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      }
    }
  },
  data() {
    return {
      testResult: {},

    }
  },
  methods: {
    getTestResult() {
      getRecord(this.id).then(data => {
        data.test = JSON.parse(data.testJsonStr || {})
        this.testResult = data
      })
    },
  },
  mounted() {
    this.getTestResult()
    // this.getTest()
  }
}
</script>

<style scoped>
.chart {
  height: 50vh;
}
</style>
