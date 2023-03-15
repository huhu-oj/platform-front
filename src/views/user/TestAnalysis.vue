<template>
  <!--单场测验统计-->
  <v-chart :option="testData" class="chart"/>
<!--  我的已结束的测验对比-->

</template>

<script>
import {getForTeacher as getTest} from '@/api/test'
import VChart from "vue-echarts";
import {checkTestStatus, uniqueArr, uniqueObjArray} from "@/utils";
import WebSocketService from "@/utils/websocket";
import {getByIds} from "@/api/user";
export default {
  //如果有给测验id，则显示单场测验的统计，不然实现测验对比
  name: "TestAnalysis",
  props: ['id'],
  components: {
    VChart
  },
  computed: {
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
    testData() {
      if (!this.answerRecords) return
      if (!this.users) return
      //分组answerRecord
      const ARGroup = this.answerRecords.groupBy(ar => ar.userId)
      const userDeptMap = new Map()
      this.users.forEach(u=>{
        userDeptMap.set(u.id+'',u.deptId)
      })
      // console.log(userDeptMap)
      const deptIds = uniqueArr(this.users.map(u=>u.deptId))
      // console.log(deptIds)
      const result = []
      for (let i = 0; i < deptIds.length; i++) {
        result.push([])
      }
      // console.log(result)
      //按部门分类
      Object.entries(ARGroup).forEach(([userId, ar]) => {
        const averageCompletion = this.averageCompletion(ar);
        const averageCorrect = this.averageCorrect(ar);
        //获取对应部门
        const deptId = userDeptMap.get(userId);
        result[deptIds.indexOf(deptId)].push([averageCompletion, averageCorrect])
      })
      console.log(result)

      //组装序列
      const series = []
      for (let i = 0; i < deptIds.length; i++) {
        series.push({
          symbolSize: 10,
          data: result[i],
          type: 'scatter'
        })
      }
      return {
        title: [
          {
            text: '学生做题分布情况',
            left: 'center',
            textStyle: {
              fontSize: 16,
            },
          },
          {
            text: '完成率高，正确率高',
            z: 1,
            textAlign: 'right',
            left: '94%',
            top: '5%',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#999',
            },
          },
          {
            text: '完成率高，正确率低',
            z: 1,
            textAlign: 'right',
            left: '94%',
            bottom: '8%',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#999',
            },
          },
          {
            text: '完成率低，正确率低',
            z: 1,
            textAlign: 'left',
            left: '9%',
            bottom: '8%',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#999',
            },
          },
          {
            text: '完成率低，正确率高',
            z: 1,
            textAlign: 'left',
            left: '9%',
            top: '5%',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#999',
            },
          },
        ],
        tooltip: {
          showDelay: 0,
          formatter: (params) => {
            if (params.value.length > 1) {
              return `${params.seriesName}:<br/>${(params.value[0]).toFixed(2)}%${(params.value[1]).toFixed(2)}%`;
            }
            return false;
          },
        },
        xAxis: {
          type: 'value',
          name: '完成率',
          nameLocation: 'center',
          nameGap: 25,
          min: 0,
          max: 100,
          splitLine: {show: false}, // 隐藏网格线
          axisLine: {
            symbol: ['none', 'arrow'], // 坐标轴箭头样式
            symbolSize: [6, 15], // 坐标轴箭头大小
            lineStyle: {
              color: '#ccc' // 坐标轴颜色
            },
            onZero: true // x轴过原点
          },
          axisLabel: {
            show: true, // 显示刻度标签
            formatter: function (value) { // 自定义坐标轴刻度文本内容
              return Math.abs(value)
            }
          },
          splitNumber: 10 // 刻度数量
        },
        yAxis: {
          type: 'value',
          name: '正确率',
          nameLocation: 'center',
          nameGap: 25,
          min: 0,
          max: 100,
          splitLine: {show: false},
          axisLine: {
            symbol: ['none', 'arrow'],
            symbolSize: [6, 15],
            lineStyle: {
              color: '#ccc'
            },
            onZero: true // y轴过原点
          },
          axisLabel: {

            show: true,
            formatter: function (value) {
              return Math.abs(value)
            }
          },
          splitNumber: 10
        },
        series: series,
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '5%',
          containLabel: true,
          show: true,
          borderColor: '#ccc'
        }
      }
    },
  },
  data() {
    return {
      test: {},
      testClient: null,
      users: null
    }
  },

  methods: {
    getTest() {
      getTest(this.id).then(data => {
        this.test = data.content[0]
        this.test.answerRecords = this.test.answerRecords.filter(ar=>{
          return new Date(ar.createTime)<new Date(this.test.endTime)
        })
        //获取用户
        getByIds(uniqueArr(this.test.answerRecords.map(ar=>ar.userId))).then(data=>{
          this.users = data
        })
        if (checkTestStatus(this.test) !== 0) {
          return
        }
        this.listenAnswerRecordChange()
      })
    },
    averageCompletion(answerRecords) {
      if (!this.problems) return
      //一场测验的完成率
      const problemCount = this.problems.length
      const submitProblemCount = uniqueObjArray(answerRecords.map(ar => ar.problem), 'id').length
      return submitProblemCount / problemCount * 100
    },
    averageCorrect(answerRecords) {
      if (!this.problems) return
      //一场测验的正确率
      const problemCount = this.problems.length
      const correctProblemCount = uniqueObjArray(answerRecords.filter(ar => ar.executeResult.id === 1).map(ar => ar.problem), 'id').length
      return correctProblemCount / problemCount * 100
    },
    listenAnswerRecordChange() {

      this.testClient = WebSocketService.connect(`/test/${this.id}`)
      this.testClient.onmessage =  message=>{
        this.getTest()
      }
    }
  },
  created() {
    this.getTest()
  },
  beforeUnmount() {
    this.testClient.close()
  }

}
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>
