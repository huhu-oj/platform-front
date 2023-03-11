<template>
  <el-card>
    <el-row>
      <el-col :span="18">
        <div style="display: flex">
          <el-select v-model="executeResultId">
            <el-option v-for="item in executeResultList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"/>
          </el-select>
          <el-input ></el-input>
        </div>
        <el-table :data="answerRecords">
<!--          <el-table-column prop="id" label="编号"/>-->
          <el-table-column prop="problem.title" label="所属题目"/>
          <el-table-column prop="submitCount" type="expand">
            <template #default="props">
              <el-table :data="props.row.records">
                <el-table-column prop="executeResult.name" label="状态"/>
                <el-table-column prop="createTime" label="创建时间"/>
                <el-table-column prop="language.name" label="语言"/>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="text" @click="$router.push(`/answer_record_detail/${scope.row.id}`)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
<!--        <el-pagination layout="prev, pager, next" :total="50"/>-->
      </el-col>
      <el-col :span="6">
        <v-chart :option="answerRecordStat" class="chart" autoresize />
<!--        <div ref="answerRecordStatChart" style="width: 100%;height: 400px"></div>-->
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
import "core-js/actual/array/group-by";
import VChart from 'vue-echarts'
import 'echarts'
import {uniqueObjArray } from '@/utils'
import {get as getExecuteResultList} from '@/api/executeResult'
import {getAll as getAllAnswerRecords} from '@/api/answerRecord'
export default {
  name: "AnswerRecord",
  components: {
    VChart,
  },
  data() {
    return {
      executeResultId: null,
      executeResultList: [],
      answerRecords: [],
      answerRecordStat: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          // data: {},
        },
        dataset: [
          { source: [ ] },
          { source: [ ] },
          { source: [ ] },
          { source: [ ] }
        ],
        series: [
          {
            datasetIndex: 0,
            name: '题目',
            type: 'pie',
            radius: ['75%','95%'],
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
          },
          {
            datasetIndex: 1,
            name: '语言',
            type: 'pie',
            radius: ['50%','74%'],
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
          },
          {
            datasetIndex: 2,
            name: '标签',
            type: 'pie',
            radius: ['25%','49%'],
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
          },
          {
            datasetIndex: 3,
            name: '判题结果',
            type: 'pie',
            radius: [0,'24%'],
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
          }
        ],
      }
      // chart: null
    }
  },
  methods: {
    getExecuteResultList() {
      getExecuteResultList().then(data=>{
        this.executeResultList = data.content
      })
    },
    getAnswerRecords() {
      getAllAnswerRecords().then(data=>{
        let content = data
        let result = []
        let problems = uniqueObjArray(content.map(ar=>ar.problem),'id')
        problems.forEach(problem=>{
          let records = content.filter(ar=>ar.problem.id === problem.id)
          result.push({
            problem,
            records
          })
        })
        this.answerRecords = result
        //统计通过未通过的题目
        const acProblemCount = uniqueObjArray(content.filter(ar=>ar.executeResult.id === 1).map(ar=>ar.problem),'id').length
        const unacProblemCount = uniqueObjArray(content.map(ar=>ar.problem),'id').length - acProblemCount
        const data0 = [
          {name: '已通过', value: acProblemCount},
          {name: '未通过', value: unacProblemCount},
        ]
        const data1 = []
        const languageGroup = content.groupBy(ar => ar.language.name)
        for (let language in languageGroup) {
          data1.push({
            name: language,
            value: languageGroup[language].length
          })
        }
        const data2 = []
        let labels = []
        content.map(ar=>ar.problem.labels).map(l=>labels = labels.concat(l))
        const labelGroup = labels.groupBy(l => l.name)
        for (let label in labelGroup) {
          data2.push({
            name: label,
            value: labelGroup[label].length
          })
        }

        const data3 = []
        const executeResultGroup = content.groupBy(ar => ar.executeResult.name)
        for (let er in executeResultGroup ) {
          data3.push({
            name: er,
            value: executeResultGroup[er].length
          })
        }
        //统计
        this.answerRecordStat.dataset[0].source = data0
        this.answerRecordStat.dataset[1].source = data1
        this.answerRecordStat.dataset[2].source = data2
        this.answerRecordStat.dataset[3].source = data3
      })
    }
  },
  mounted() {

  },
  created() {
    this.getExecuteResultList()
    this.getAnswerRecords()
  }
}
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>
