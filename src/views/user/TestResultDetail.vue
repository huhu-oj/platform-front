<template>
  <el-container>
    <el-header>
      <navbar/>
    </el-header>
    <el-main>
      <el-row justify="center">
        <el-col :span="12">
          <div>{{ test.title }}</div>
          <el-statistic title="测验分数" :value="testResult.score"/>
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

import "core-js/actual/array/group-by";
import {uniqueArr, uniqueObjArray} from "@/utils";

export default {
  name: "TestResultDetail",
  components: {
    navbar, VChart
  },
  props: ['id'],
  computed: {
    test() {
      return this.testResult.testJsonStr || {}
    }
  },
  data() {
    return {
      testResult: {},
      option: {
        legend: {},
        tooltip: {},
        dataset: [
          {
            // 提供一份数据。
            dimensions: ['title', '未通过', '已通过'],
            source: []
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
      },
      option1: {
        legend: {},
        tooltip: {},
        dataset: [
          {
            // 提供一份数据。
            dimensions: ['knowledgeName', '知识点掌握程度'],
            source: [ ]
          },
        ],

        series: [{
          type: 'bar',
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
      },
    }
  },
  methods: {
    getTestResult() {
      getRecord(this.id).then(data => {
        data.testJsonStr = JSON.parse(data.testJsonStr || {})
        this.testResult = data

        const test = data.testJsonStr

        //统计
        const problems = test.examinationPaper.examinationPaperProblems
        const ARGroup = test.answerRecords.groupBy(ar => ar.problem.title)
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
        //知识点名称
        const knowledgeNames = uniqueArr(problems.map(p => p.problem.problemKnowledges || []).reduce((a, b) => a.concat(b)).map(k => k && k.knowledge.name))
        //回答正确的题目
        const rightProblemTitles = data0.filter(p => p['已通过'] > 0).map(p => p.title)
        //全部题目通过的情况
          //遍历知识点获得权重累加和
         const data1 = knowledgeNames.map(name => {
            const weight = problems.map(p => p.problem.problemKnowledges).reduce((a, b) => a.concat(b)).filter(k => k.knowledge.name === name).map(k => k.weight)
           console.log(problems.filter(p => rightProblemTitles.indexOf(p.problem.title) !== -1).map(p => p.problem.problemKnowledges).reduce((a, b) => a.concat(b),[[]]));
           let rightWeight = []
               try {
                 rightWeight = problems.filter(p => rightProblemTitles.indexOf(p.problem.title) !== -1).map(p => p.problem.problemKnowledges).reduce((a, b) => a.concat(b)).filter(k => k.knowledge.name === name).map(k => k.weight)
               } catch (e) {
                 // console.log(e)
               }
            return {
              knowledgeName: name,
              '知识点掌握程度': (Math.floor(weight.reduce((a, b) => a + b,0) / rightWeight.reduce((a, b) => a + b,0) * 10000) / 100)
            }
          })

        console.log(data1)
        this.option.dataset[0].source = data0
        this.option1.dataset[0].source = data1
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
