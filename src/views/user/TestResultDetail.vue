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
          <v-chart :option="option" autosize class="chart"/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import navbar from "@/components/navbar/index.vue";
import VChart from "vue-echarts";
import {get as getTest, getRecord} from "@/api/test";
export default {
  name: "TestResultDetail",
  components: {
    navbar,VChart
  },
  props: ['id'],
  data() {
    return {
      testResult: {},
      test: {},
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '已通过',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: '未通过',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Affiliate Ad',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'Video Ad',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
            name: 'Search Engine',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
    }
  },
  methods: {
    getTestResult() {
      getRecord(this.id).then(data=>{
        data.testJsonStr = JSON.parse(data.testJsonStr || {})
        this.testResult = data
      })
    },
    getTest() {
      getTest(this.id).then(data=>{
        this.test = data.content[0]

        //统计
        const problems = this.test.examinationPaper.examinationPaperProblems
        this.option.xAxis.data = problems.map(p=>p.problem.title)
        // this.option.dataset.dimensions= problems.map(p=>p.problem.title)
        const data0 = [
          {}
        ]
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
.chart {
  height: 100vh;
}
</style>
