<template>
  <el-container>
    <el-header>
      <navbar>
        <template #left>
          <div style="display: flex;flex-grow: 1"></div>
        </template>
        <template #right>
          <div style="display: flex;flex-grow: 1"></div>
        </template>
      </navbar>
    </el-header>
    <el-row justify="center">
      <el-col :span="18">
        <h3>题目</h3>
        <h1>提交记录</h1>
        <div class="border">
          <div style="display: flex">
            <div>0 / 57 个通过测试用例</div>

            <div style="flex-grow: 1"></div>

            <div>
              <div>状态:
                <span>编译出错</span>
              </div>
              <div>提交时间:
                <span>5 个月前</span>
              </div>
            </div>

          </div>
          <div class="border error">
            <span>Line 4: error: missing return statement } ^</span>
          </div>
        </div>
        <el-divider/>
        <div style="display: flex">
          <div>
            <h2>提交的代码:</h2>
            <div>语言:
              <span>java</span>
            </div>
          </div>
          <div style="flex-grow: 1"></div>
          <div>
            <span>备注：123</span>
            <el-button type="success">编辑代码</el-button>
          </div>
        </div>
        <div>
          <code-edit :value="code"/>
        </div>
        <div style="text-align: center">返回</div>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import navbar from "@/components/navbar/index.vue";
import codeEdit from "@/components/CodeEdit/index.vue";
export default {
  name: "ProblemDetail",
  components: {
    navbar,codeEdit
  },
  data() {
    return {
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        //return null;
    }
}`
    }
  }
}
</script>

<style scoped>
.border {
  border: 1px solid black;
  width: 100%;
}
.error {
  border-color: red;
  background-color: rgba(255,0,0,0.5);
}
</style>