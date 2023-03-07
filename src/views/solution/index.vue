<template>
  <div v-if="solutions.length !== 0">
    <el-card shadow="never" v-for="item in solutions" @click="$emit('showDetail',item)">
      <el-avatar :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"></el-avatar>
      <span>{{item.title}}</span>
    </el-card>
  </div>

  <div v-else style="height: 200px;display: flex;flex-direction: column;justify-content: center;align-items: center">暂无题解</div>
</template>

<script>
import {get as getSolutions} from '@/api/solution'
export default {
  props: {
    problemId: {
      type: Number,
      required: true
    }
  },
  emits: ['showDetail'],
  data() {
    return {
      solutions: []
    }
  },
  watch: {
    //正确给 cData 赋值的 方法
    problemId(newVal,oldVal){
      console.log(newVal)
      newVal && this.getSolutions(); //newVal存在的话执行
    }
  },
  methods: {
    getSolutions() {
      getSolutions(this.problemId).then(data=>{
        this.solutions = data.content
      })
    },

  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
