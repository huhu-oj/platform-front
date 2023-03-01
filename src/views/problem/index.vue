<template>
  <el-container class="container">
    <el-header>
      <navbar/>
    </el-header>
    <el-main style="overflow: hidden">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-tabs type="border-card" >
            <el-tab-pane label="题目描述" style="height: calc(100vh - 231px)">
              <el-scrollbar>
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
              </el-scrollbar>

            </el-tab-pane>
            <el-tab-pane label="题解" style="height: calc(100vh - 231px)">
              <el-scrollbar>
                <solution/>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="提交记录" style="height: calc(100vh - 231px)">
              <el-scrollbar>
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
              </el-scrollbar>
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
            <codemirror v-model:value="code" :options="options"/>
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
import navbar from "@/components/navbar/index.vue";
import solution from "@/views/solution/index.vue";
import solutionDetail from "@/views/solution/SolutionDetail.vue";
import Codemirror from 'codemirror-editor-vue3';
// 编辑器代码格式
import 'codemirror/mode/javascript/javascript.js';
// 自动刷新
import 'codemirror/addon/display/autorefresh';
// 主题
import 'codemirror/theme/dracula.css';

import {get as getLanguageList} from '@/api/language'
import {get as getHints} from '@/api/hint'
import {get as getSolutions} from '@/api/solution'
import {get as getProblem} from '@/api/problem'
import {get as getAnswerRecords} from '@/api/answerRecord'
import {judge, test} from "@/api/judge";

export default {
  components: {
    navbar,solution,solutionDetail,Codemirror
  },
  data() {
    return {
      options: {
        autorefresh: true,
        smartIndent: true,
        tabSize: 4,
        mode: 'application/json',
        theme: 'dracula',
        line: true,
        viewportMargin: Infinity,
        highlightDifferences: true,
        autofocus: false,
        indentUnit: 2,
        readOnly: false, // 只读
        showCursorWhenSelecting: true,
        firstLineNumber: 1,
        matchBrackets: true,//括号匹配
      },
      codeEditVisible: true,
      height: document.documentElement.clientHeight - 180,
      languageId: null,
      languageList: [
        {id:1,name: 'python'},
        {id:2,name: 'java'},
        {id:3,name: 'go'},
      ],
      code: `package love.huhu.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlatformServerApplication {


    public static void main(String[] args) {
        SpringApplication.run(PlatformServerApplication.class, args);
    }

}
`,
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
  },
  methods: {
    judge() {
      judge(this.answerRecordToJudge).then(data=>{

      })
    },
    test() {
      test(this.answerRecordToJudge).then(data=>{

      })
    },
    getHints() {
      getHints(this.problem.id).then(data=>{
        this.hints = data
      })
    },
    getProblem() {
      getProblem(this.problem.id).then(data=>{
        this.problem = data
      })
    },
    getLanguageList() {
      getLanguageList().then(data=>{
        this.languageList = data
      })
    },
    getSolutions() {
      getSolutions(this.problem.id).then(data=>{
        this.solutions = data
      })
    },
    getAnswerRecords() {
      getAnswerRecords().then(data=>{
        this.answerRecords = data
      })
    }
  }
}
</script>
<style>
.container {
  /*overflow: hidden;*/
  height: 100%;
  width: 100%;
  /*position: fixed;*/
}
.vcenter {
  display: flex;
  /*垂直排列*/
  flex-direction: column;
  justify-content: center;
}

.scroll {
  /*overflow: scroll;*/
  height: 100%
}

.left {
  overflow: scroll;
  height: 100%;
}

.right {
  height: 100%;
}
</style>
