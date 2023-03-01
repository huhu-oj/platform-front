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
      answerRecords: [
        {
          id: 1,
          problem: {name:'两数之后'},
          submitCount: 4,
          records: [
            {id:1,createTime:'123',language:'java'},
            {id:2,createTime:'123',language:'java'},
            {id:3,createTime:'123',language:'java'},
            {id:4,createTime:'123',language:'java'}
          ]
        },
        {
          id: 2,
          submitCount: 4,
          problem: {name:'数组求和'},
          records: [
            {id:1,createTime:'123',language:'java'},
            {id:2,createTime:'123',language:'java'},
            {id:3,createTime:'123',language:'java'},
            {id:4,createTime:'123',language:'java'}
          ]
        }
      ],
      answerRecordStat: {
        title: {

        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
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
        let problems = new Set(content.map(ar=>ar.problem))
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
