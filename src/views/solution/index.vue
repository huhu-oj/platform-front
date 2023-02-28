<template>
  <el-card shadow="never" v-for="item in solutions">
    <el-avatar :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"></el-avatar>
    <span>{{item.title}}</span>
  </el-card>
</template>

<script>
import {get as getSolutions} from '@/api/solution'
export default {
  data() {
    return {
      solutions: [
        {
          id:1,
          title: '123',
          description: '132123',
          user: {
            id:1,
            name: 'ren',
            avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          }
        },
        {
          id:2,
          title: '12312',
          description: '13212312',
          user: {
            id:1,
            name: 'ren',
            avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          }
        },
        {
          id:1,
          title: '123',
          description: '132123',
          user: {
            id:1,
            name: 'ren',
            avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          }
        },
      ]
    }
  },
  methods: {
    getSolutions() {
      getSolutions(this.problem.id).then(data=>{
        this.solutions = data
      })
    }
  }
}
</script>

<style scoped>

</style>
