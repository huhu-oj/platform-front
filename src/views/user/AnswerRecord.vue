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
                <el-table-column prop="id" label="编号"/>
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
        <el-pagination layout="prev, pager, next" :total="50"/>
      </el-col>
      <el-col :span="6">
        <div ref="answerRecordStatChart" style="width: 100%;height: 400px"></div>
      </el-col>
    </el-row>

  </el-card>
</template>

<script>
import * as echarts from 'echarts';
import { debounce } from '@/utils'
import {get as getExecuteResultList} from '@/api/executeResult'
import {get as getAnswerRecords} from '@/api/answerRecord'
export default {
  name: "AnswerRecord",
  data() {
    return {
      executeResultId: null,
      executeResultList: [],
      answerRecords: [],
      answerRecordStat: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          type: 'scroll',
          top: 0,
          // bottom: 0
        },
        dataset: [
          {
            source: [
              { value: 1548, name: '数组' },
              { value: 775, name: '二叉树' },
              { value: 679, name: '动态规划' }
            ]
          },
          {
            source: [
              { value: 1548, name: '量子力学' },
              { value: 1775, name: '动态规划' },
              { value: 679, name: '九宫格' }
            ]
          },
          {
            source: [
              { value: 10, name: 'python' },
              { value: 20, name: 'java' },
              { value: 20, name: 'go' }
            ]
          },
          {
            source: [
              { value: 5, name: '已通过' },
              { value: 10, name: '未通过' }
            ]
          },
        ],
        series: [
          {
            name: '标签',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '24%'],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            encode: {
              itemName: 'name',
              tooltip: '{a} <br/>{b}: {@value} ({d}%)'
            },
            datasetIndex: 0
          },
          {
            name: '知识点',
            type: 'pie',
            selectedMode: 'single',
            radius: ['25%', '49%'],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            datasetIndex: 1

          },
          {
            name: '语言',
            type: 'pie',
            radius: ['50%', '74%'],
            labelLine: {
              length: 30
            },
            label: {
              show: false
            },
            datasetIndex: 2

          },
          {
            name: '题目',
            type: 'pie',
            radius: ['75%', '95%'],
            labelLine: {
              length: 30
            },
            label: {
              show: false
            },
            datasetIndex: 3

          },

        ]
      },
      chart: null
    }
  },
  methods: {
    getExecuteResultList() {
      getExecuteResultList().then(data=>{
        this.executeResultList = data.content
      })
    },
    getAnswerRecords() {
      getAnswerRecords().then(data=>{
        let content = data.content
        console.log(content)
        let result = []

        const uniqueFunc = (arr, uniId)=>{
          const res = new Map();
          return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
        }

        let problems = uniqueFunc(content.map(ar=>ar.problem),'id')
        problems.forEach(problem=>{
          let records = content.filter(ar=>ar.problem.id === problem.id)
          result.push({
            problem,
            records
          })
        })

        this.answerRecords = result
      })
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.answerRecordStatChart)
    this.chart.setOption(this.answerRecordStat)
    window.addEventListener('resize', debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100))
  },
  created() {
    this.getExecuteResultList()
    this.getAnswerRecords()
  }
}
</script>

<style scoped>

</style>
