<template>
  <el-card v-for="item in test" class="test">
    <span>{{item.name}}</span>
  </el-card>
</template>

<script>
import {get as getMyTests} from '@/api/test'
export default {
  name: "MyTest",
  data() {
    return {
      test: [
        {name: '测试1'},
        {name: '测试2'},
        {name: '测试3'},
      ]
    }
  },
  methods: {
    getMyTests() {
      getMyTests().then(data=>{
        this.test = data
      })
    }
  }
}
</script>

<style scoped>
.test {
  margin: 20px auto;
}
</style>
