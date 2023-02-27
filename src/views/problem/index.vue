<template>
  <el-container class="container">
    <el-header>
      <navbar/>
    </el-header>
    <el-main >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-tabs type="border-card" >
            <el-tab-pane label="题目描述" class="test" >
              <div style="margin-bottom: 20px">1.两束之后</div>
              <el-space wrap>
                <el-tag>数字</el-tag>
                <el-tag>标签</el-tag>
                <el-tag>数字</el-tag>
                <el-tag>数字</el-tag>
              </el-space>
              <el-divider/>
              <div style="height: 900px">123</div>
              <el-collapse v-model="activeHint" accordion>
                <el-collapse-item :title="'提示'+item.id" :name="item.id" v-for="item in hintList">
                  {{item.description}}
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="题解">
              <solution/>
            </el-tab-pane>
            <el-tab-pane label="提交记录">
              <el-table :data="answerRecords">
                <el-table-column prop="createTime" label="提交时间"/>
                <el-table-column prop="language" label="语言"/>
                <el-table-column prop="executeResult.name" label="提交结果"/>
                <el-table-column prop="note" label="备注">
                  <template #default="scope">
                    <span v-if="scope.row.note === null">添加备注</span>
                    <span v-else>{{scope.row.note}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col v-if="codeEditVisible" :span="12" >
          <div style="display: flex">
            <el-select v-model="languageId" placeholder="Select">
              <el-option
                  v-for="item in languageList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
            <div style="display: flex;flex-grow: 1"></div>
            <el-button>设置</el-button>
            <el-button>全屏</el-button>
          </div>
          <div style="display: flex">
            <code-edit :value="code" :height="height" style="width: 100%"></code-edit>
          </div>
        </el-col>
        <el-col v-else :span="12">
          <el-button>关闭</el-button>
          <solution-detail/>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="vcenter">
      <el-row :gutter="20">
        <el-col :span="12" style="display: flex;padding: 0 10px">
          <el-button>题目列表</el-button>
          <div style="display: flex;flex-grow: 5"></div>
          <el-button>随机一题</el-button>
          <div style="display: flex;flex-grow: 1"></div>
          <el-button-group class="ml-4">
            <el-button >上一题</el-button>
            <el-button disabled>1/23</el-button>
            <el-button >下一题</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="12" style="display: flex;padding: 0 10px">
          <el-button>控制台</el-button>
          <div style="display: flex;flex-grow: 1"></div>
          <el-button>执行代码</el-button>
          <el-button type="success">提交</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>
<script>
import codeEdit from "@/components/CodeEdit/index.vue";
import 'codemirror/mode/clike/clike'
import navbar from "@/components/navbar/index.vue";
import solution from "@/views/solution/index.vue";
import solutionDetail from "@/views/solution/SolutionDetail.vue";
export default {
  components: {
    codeEdit,navbar,solution,solutionDetail
  },
  data() {
    return {
      codeEditVisible: false,
      height: document.documentElement.clientHeight - 180 + 'px',
      languageId: null,
      languageList: [
        {id:1,name: 'python'},
        {id:2,name: 'java'},
        {id:3,name: 'go'},
      ],
      code: `123`,
      hintList: [
        {id:1,description: '123'},
        {id:2,description: '1234'},
        {id:3,description: '1235'},
      ],
      activeHint: 1,
      answerRecords: [
        {
          id:1,
          createTime: '123',
          language: 'java',
          executeResult: {
            name: '通过'
          },
          note: '123'
        },
        {
          id:1,
          createTime: '123',
          language: 'java',
          executeResult: {
            name: '通过'
          },
          note: null
        },
        {
          id:1,
          createTime: '123',
          language: 'java',
          executeResult: {
            name: '通过'
          },
          note: '123'
        },
      ]
    }
  }
}
</script>
<style>
.container {
  /*overflow: hidden;*/
  height: 100%;
}
.vcenter {
  display: flex;
  /*垂直排列*/
  flex-direction: column;
  justify-content: center;
}
.test {
  flex-direction: column;
  background-color: rgb(246, 248, 250);
  /*-webkit-box-flex: 1;*/
  /*flex-grow: 1;*/
  overflow-y: auto;
  position: relative;
  padding: 4px 8px;
  display: flex;
}

.scroll {
  overflow: scroll;
  /*height: 100%;*/
}

.left {
  overflow: scroll;
  height: 100%;
}

.right {
  height: 100%;
}
</style>