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
        <el-table :data="data">
          <el-table-column prop="id" label="编号"/>
          <el-table-column prop="problem.name" label="所属题目"/>
          <el-table-column prop="submitCount" type="expand">
            <template #default="props">
              <el-table :data="props.row.record">
                <el-table-column prop="id" label="编号"/>
                <el-table-column prop="createTime" label="创建时间"/>
                <el-table-column prop="language" label="语言"/>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="text">查看详情</el-button>
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
export default {
  name: "AnswerRecord",
  data() {
    return {
      executeResultId: null,
      executeResultList: [
        {id: 1,name:'通过'},
        {id: 2,name:'未通过'},
      ],
      data: [
        {
          id: 1,
          problem: {name:'两数之后'},
          submitCount: 4,
          record: [
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
          record: [
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
  mounted() {
    this.chart = echarts.init(this.$refs.answerRecordStatChart)
    this.chart.setOption(this.answerRecordStat)
    window.addEventListener('resize', debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100))
  }
}
</script>

<style scoped>

</style>