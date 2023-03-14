<template>
<!--单场测验统计-->
  <v-chart :option="testData" class="chart"/>
</template>

<script>
import {getForTeacher as getTest} from '@/api/test'
import VChart from "vue-echarts";
import {uniqueObjArray} from "@/utils";
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
      return this.examinationPaperProblems.map(epp=>epp.problem)
    },
    answerRecords() {
      if (!this.test) return
      return this.test.answerRecords
    },
    testData() {
      if (!this.answerRecords) return
      //分组answerRecord
      const result = []
      const ARGroup = this.answerRecords.groupBy(ar=>ar.userId);
      Object.entries(ARGroup).forEach(([userId, ar]) => {
        const averageCompletion = this.averageCompletion(ar);
        const averageCorrect = this.averageCorrect(ar);
        result.push([averageCompletion,averageCorrect])
      })
      console.log(result)
      return  {
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
            left: '95%',
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
            textAlign: 'center',
            left: '90%',
            top: '85%',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#999',
            },
          },
          {
            text: '完成率低，正确率低',
            z: 1,
            textAlign: 'center',
            left: '25%',
            top: '85%',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#999',
            },
          },
          {
            text: '完成率低，正确率高',
            z: 1,
            textAlign: 'center',
            left: '25%',
            top: '7%',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#999',
            },
          },
        ],
        grid: {
          top: '10%',
          left: '3%',
          right: '7%',
          bottom: '1%',
          containLabel: true,
        },
        tooltip: {
          showDelay: 0,
          formatter: (params) => {
            if (params.value.length > 1) {
              return `${params.seriesName}:<br/>${(params.value[0]*100).toFixed(2)}%${(params.value[1]*100).toFixed(2)}%`;
            }
            return false;
          },

        },
        xAxis: [{
          type: 'value',
          name: '完成率',
          scale: true,
          splitLine: {
            show: false,
          },
          data: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }],
        yAxis: [{
          type: 'value',
          scale: true,
          name: '正确率',
          splitLine: {
            show: false,
          },
          max: '1',
        }],
        series: [
          {
            z: 3,
            type: 'scatter',
            symbolSize: 12,
            itemStyle: {
              normal: {
                color: '#EF535C',
              },
            },
            data: result
          },
          {
            name: 'wu',
            type: 'scatter',
            data: [[0.5, 0]],
            itemStyle: {
              normal: {
                color: '#999',
              },
            },
            markLine: {
              data: [
                {
                  type: 'average',
                  name: 'wu',
                  valueIndex: 0,
                },
              ],
            },

          },
          {
            name: 'six',
            type: 'scatter',
            data: [[0, 0.5]],
            itemStyle: {
              normal: {
                color: '#999',
              },
            },
            markLine: {
              data: [
                {
                  type: 'average',
                  name: 'six',
                },
              ],
              label: {
                show: false,
              },
            },
          },
        ],
      };
    }
  },
  data() {
    return {
      test: {}
    }
  },

  methods: {
    getTest() {
      getTest(this.id).then(data=>{
        this.test = data.content[0]
      })
    },
    averageCompletion(answerRecords) {
      if (!this.problems) return
        //一场测验的完成率
        const problemCount = this.problems.length
        const submitProblemCount = uniqueObjArray(answerRecords.map(ar=>ar.problem),'id').length
        return submitProblemCount/problemCount
    },
    averageCorrect(answerRecords) {
      if (!this.problems) return
        //一场测验的完成率
        const problemCount = this.problems.length
        const correctProblemCount = uniqueObjArray(answerRecords.filter(ar=>ar.executeResult.id === 1).map(ar=>ar.problem),'id').length
        return correctProblemCount/problemCount
    },
  },
  created() {
    this.getTest()
  }

}
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>