<template>
  <el-container class="container">
    <el-header>
      <navbar/>
    </el-header>
    <el-main >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-tabs type="border-card" v-model="leftTab">
            <el-tab-pane label="题目描述" style="height: calc(100vh - 231px)">
              <el-scrollbar >
                <div style="margin-bottom: 20px">{{ problem.title }}</div>
                <el-space wrap>
                  <el-tag v-for="item in problem.labels">{{item.name}}</el-tag>
                </el-space>
                <el-divider/>
                <mavon-editor
                    v-model="problem.description"
                    :subfield="false"
                    :defaultOpen="'preview'"
                    :editable="false"
                    :toolbarsFlag="false"
                    :boxShadow="false"
                />
                <el-collapse v-model="activeHint" accordion  style="width: 100%">
                  <el-collapse-item :title="'提示'+(index+1)" :name="item.id" v-for="(item,index) in problem.hints">
                    {{item.description}}
                  </el-collapse-item>
                </el-collapse>
              </el-scrollbar>

            </el-tab-pane>
            <el-tab-pane label="题解" style="height: calc(100vh - 231px)">
              <el-scrollbar>
                <solution :problemId="problem.id" @show-detail="showSolution"/>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="提交记录" name="submitRecord" style="height: calc(100vh - 231px)">
              <el-scrollbar>
              <el-table :data="answerRecords">
                <el-table-column prop="createTime" label="提交时间"/>
                <el-table-column prop="language.name" label="语言"/>
                <el-table-column prop="executeResult.name" label="提交结果">
                  <template #default="scope">
                    <el-link type="primary" :href="`/answer_record_detail/${scope.row.id}`">{{scope.row.executeResult.name }} </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="note" label="备注">
                  <template #default="scope">
                    <span v-if="!scope.row.note">添加备注</span>
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
          <div >
              <codemirror
                  v-model:value="code"
                  :options="options"
                  :height="height"
              />
          </div>
          <div style="position:relative; height: 45px">
            <el-collapse class="bottom-fix" v-model="codeConsole.show" accordion >
              <el-collapse-item title="控制台" name="console">
                <el-tabs type="border-card" v-model="codeConsole.tab">
                  <el-tab-pane label="测试用例" name="testCase">
                    <el-input type="textarea" v-model="codeConsole.testCase" resize="none" rows="3"/>
                  </el-tab-pane>
                  <el-tab-pane label="执行结果" name="executeResult">
                    <div>
                      <div v-if="codeConsole.log">
                        <el-input type="textarea" readonly :rows="6" v-model="codeConsole.log"></el-input>
                      </div>
                      <div v-else-if="codeConsole.error">
                        <el-input type="textarea" readonly :rows="6" v-model="codeConsole.error"></el-input>
                      </div>
                      <div v-else class="vcenter" style="text-align: center">
                        请先运行您的代码
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-collapse-item>
            </el-collapse>
          </div>

        </el-col>
        <el-col v-else :span="12">
          <el-button @click="codeEditVisible = true">关闭</el-button>
          <solution-detail :solution="solutionDetail"/>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="vcenter">
      <el-row :gutter="20">
        <el-col :span="12" style="display: flex;padding: 0 10px" v-if="examinationPaper.problems">
          <el-button @click="problemListVisible = true">题目列表</el-button>
          <div style="display: flex;flex-grow: 5"></div>
<!--          <el-button>随机一题</el-button>-->
          <div style="display: flex;flex-grow: 1"></div>
          <el-button-group class="ml-4">
            <el-button @click="toProblem(problemIndex-1)">上一题</el-button>
            <el-button disabled v-if="examinationPaper.problems">{{problemIndex+1}}/{{problemCount}}</el-button>
            <el-button @click="toProblem(problemIndex+1)">下一题</el-button>
          </el-button-group>
        </el-col>
        <el-col v-else :span="12"></el-col>
        <el-col :span="12" style="display: flex;padding: 0 10px">
<!--          <el-button>控制台</el-button>-->
          <div style="display: flex;flex-grow: 1"></div>
          <el-button @click="testCode">执行代码</el-button>
          <el-button type="success" @click="submitCode">提交</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
  <el-drawer
    v-model="problemListVisible"
    direction="ltr"
    size="20%"
  >
    <el-table :data="examinationPaper.problems" @row-click="toProblemById">
      <el-table-column property="title" align="center" label="题目"  />
    </el-table>
  </el-drawer>
</template>
<script>
import navbar from "@/components/navbar/index.vue";
import solution from "@/views/solution/index.vue";
import solutionDetail from "@/views/solution/SolutionDetail.vue";
import Codemirror from 'codemirror-editor-vue3';
import { mavonEditor } from 'mavon-editor'
// 编辑器代码格式
import 'codemirror/mode/javascript/javascript.js';
// 自动刷新
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/fold/foldcode'
// 主题
import 'codemirror/theme/dracula.css';

import {get as getLanguageList} from '@/api/language'
import {get as getSolutions} from '@/api/solution'
import {get as getProblemById} from '@/api/problem'
import {get as getAnswerRecords} from '@/api/answerRecord'
import {get as getExaminationPaper } from '@/api/examinationPaper'
import {judge, test} from "@/api/judge";
import {ElNotification} from "element-plus";
import {debounce} from "@/utils";
export default {
  components: {
    navbar,solution,solutionDetail,Codemirror,mavonEditor
  },
  props: ['id'],
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
        indentUnit: 4,
        readOnly: false, // 只读
        showCursorWhenSelecting: true,
        firstLineNumber: 1,
        matchBrackets: true,//括号匹配
        autocapitalize:true,
      },
      leftTab: null,
      solutionDetail: {},
      codeEditVisible: true,
      height: document.documentElement.clientHeight - 240,
      languageId: null,
      languageList: [],
      problem: {},
      examinationPaper: {},
      problemListVisible: false,
      code: ``,
      activeHint: 0,
      answerRecords: [],
      codeConsole: {
        show: null,
        tab: 'testCase',
        testCase: '',
        error: null,
        log: null,
      }
    }
  },
  computed: {
    problemCount() {
      return this.examinationPaper.problems.length
    },
    problemIndex() {
      return this.examinationPaper.problems.findIndex(p=>{
        return p.id === this.problem.id
      })
    }
  },
  methods: {
    toProblemById(row) {
     this.$router.push({
        path: `/problem/${row.id}`,
        query: {examId: this.examinationPaper.id}
      })
    },
    toProblem(problemIndex) {
      if (problemIndex>this.problemCount || problemIndex < 0) {
        return
      }
      const problemId = this.examinationPaper.problems[problemIndex].id
      this.$router.push({
        path: `/problem/${problemId}`,
        query: {examId: this.examinationPaper.id}
      })
    },
    submitCode() {
      let answerRecordToJudge = {
        code: this.code,
        languageId: this.languageId,
        problemId: this.problem.id
      }
      judge(answerRecordToJudge).then(data=>{
        this.codeConsole.error = data.error
        this.codeConsole.log = data.log
        this.codeConsole.show = 'console'
        this.codeConsole.tab = 'executeResult'

        this.leftTab = 'submitRecord'
        this.getAnswerRecords()

      })
    },
    judgeTest() {
      test(this.code,this.codeConsole.testCase).then(data=>{

        this.codeConsole.error = data.error
        this.codeConsole.log = data.log
        this.codeConsole.show = 'console'
        this.codeConsole.tab = 'executeResult'
      })
    },
    getProblem() {
      let problemId = this.id
      if (!problemId) {
        problemId = this.examinationPaper.problems[0].id
      }
      getProblemById(problemId).then(data=>{
        this.problem = data.content[0]
        this.getAnswerRecords()
      })
    },
    getExaminationPaper() {
      const examId = this.$route.query.examId
      if (!examId) {
        return
      }
      console.log(examId)
      getExaminationPaper(examId).then(data=>{
        this.examinationPaper = data.content[0]
        this.getProblem()
      })
    },
    getLanguageList() {
      getLanguageList().then(data=>{
        this.languageList = data.content
      })
    },
    getSolutions() {
      getSolutions(this.problem.id).then(data=>{
        this.solutions = data
      })
    },
    getAnswerRecords() {
      getAnswerRecords(this.problem.id).then(data=>{
        this.answerRecords = data.content
      })
    },
    getAnswerRecord() {
      if (this.$route.query.answerRecordId) {
        getAnswerRecords(null,this.$route.query.answerRecordId).then(data=>{
          this.code = data.content[0].code
        })
      }
    },
    showSolution(item) {
      this.solutionDetail = item
      this.codeEditVisible = false
    },
    testCode() {
      if (this.codeConsole.testCase.length === 0) {
        ElNotification.error({
          title: '测试用例不能为空',
          duration: 5000
        })
        this.codeConsole.show = 'console'
        this.codeConsole.tab = 'testCase'
        return
      }
      this.judgeTest()
    },
    clearData() {
     this.leftTab = null
     this.solutionDetail = {}
     this.codeEditVisible = true
     this.height = document.documentElement.clientHeight - 240
     this.languageId = null
     this.languageList = []
     this.problem = {}
     this.examinationPaper = {}
     this.problemListVisible = false
     this.code = ``
     this.activeHint = 0
     this.answerRecords = []
     this.codeConsole = {
        show: null,
        tab: 'testCase',
        testCase: '',
        error: null,
        log: null,
      }

    }
  },
  mounted() {
    this.getAnswerRecord()
    this.getLanguageList()
    this.getExaminationPaper()
    window.addEventListener('resize', debounce(() => {
      if (this.height) {
        this.height = document.documentElement.clientHeight - 240
      }
    }, 100))
  },
  created() {
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        // 对路由变化做出响应...
        this.clearData()
        this.getExaminationPaper()
      }
    )
  }
}
</script>
<style>
.bottom-fix {
  position:absolute;
  bottom: 0;
  width: 100%;
}
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

:deep(.el-textarea__inner) {
  background-color: rgba(255,0,0,0.4);

}
:deep(.el-scrollbar__wrap--hidden-default) {
  --el-scrollbar-opacity: 0
}
:deep(.el-scrollbar) {
  --el-scrollbar-opacity: 0
}
</style>
