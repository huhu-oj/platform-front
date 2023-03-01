<template>
  <div v-if="test.length !== 0">
    <el-card v-for="item in test" class="test">
      <span>{{item.name}}</span>
    </el-card>
  </div>
  <div v-else >
    <span style="height: 200px;display: flex;flex-direction: column;justify-content: center;align-items: center">暂无测验</span>
  </div>

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
        this.test = data.content
      })
    }
  },
  mounted() {
    this.getMyTests()
  }
}
</script>

<style scoped>
.test {
  margin: 20px auto;
}
</style>
