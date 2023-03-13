<template>
  <el-container class="container">
    <el-header>
      <navbar>
        <template #center v-if="testStatus === 0">
          <div style="display: flex;flex-grow: 1"/>
          <el-countdown title="离测验结束还有" :value="testCountdown" @finish="submitTest" />
          <div style="display: flex;flex-grow: 1"/>
        </template>
      </navbar>
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
            <el-tab-pane label="题解" name="solution" v-if="testStatus === 1" style="height: calc(100vh - 231px)">
              <el-scrollbar>
                <solution :problemId="problem.id" @show-detail="showSolution" :refresh="solutionKey"/>
              </el-scrollbar>
              <el-button type="primary" circle size="large" style="position:absolute; bottom: 10px; right: 10px" @click="rightSideVisible = 'solutionAdd'">
                <template #icon><Plus/></template>
              </el-button>
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
        <el-col v-if="rightSideVisible === 'codeEdit'" :span="12" >
          <div style="display: flex">
            <el-select
                v-model="languageId"
                placeholder="Select"
                @change="changeLanguageTemplate"
            >
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
        <el-col v-else-if="rightSideVisible === 'solutionDetail'" :span="12">
          <el-button @click="rightSideVisible = 'codeEdit'">关闭</el-button>
          <solution-detail :solution="solutionDetail"/>
        </el-col>
        <el-col v-else-if="rightSideVisible === 'solutionAdd'" :span="12">
          <div style="display: flex">
            <el-button @click="rightSideVisible = 'codeEdit'">关闭</el-button>
            <div style="display: flex;flex-grow: 1"></div>
            <el-button type="success" @click="addSolution">提交</el-button>
          </div>
          <el-form>
            <el-form-item label="标题">
              <el-input v-model="solution.title"/>
            </el-form-item>
            <el-form-item label="标签" prop="label">
              <el-select
                  v-model="solution.labels"
                  value-key="id"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  placeholder="关联标签"
              >
                <el-option
                    v-for="item in labelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                />
              </el-select>
            </el-form-item>
            <mavon-editor
                v-model="solution.description"
                :boxShadow="false"
            />
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="vcenter">
      <el-row :gutter="20">
        <el-col :span="12" style="display: flex;padding: 0 10px" v-if="testProblems">
          <el-button @click="problemListVisible = true">题目列表</el-button>
          <div style="display: flex;flex-grow: 5"></div>
<!--          <el-button>随机一题</el-button>-->
          <div style="display: flex;flex-grow: 1"></div>
          <el-button-group class="ml-4">
            <el-button @click="toProblem(problemIndex-1)">上一题</el-button>
            <el-button disabled v-if="testProblems">{{problemIndex+1}}/{{problemCount}}</el-button>
            <el-button @click="toProblem(problemIndex+1)">下一题</el-button>
          </el-button-group>
        </el-col>
        <el-col v-else :span="12"></el-col>
        <el-col :span="12" v-if="rightSideVisible === 'codeEdit'" style="display: flex;padding: 0 10px">
          <el-button v-if="testStatus === 0" @click="submitTest">交卷</el-button>
          <div style="display: flex;flex-grow: 1"></div>
          <el-button @click="testCode">执行代码</el-button>
          <el-button type="success" @click="submitCode">提交</el-button>
        </el-col>
        <el-col v-else :span="12"></el-col>

      </el-row>
    </el-footer>
  </el-container>
  <el-drawer
    v-model="problemListVisible"
    direction="ltr"
    size="20%"
  >
    <el-table :data="testProblems" @row-click="toProblemById">
      <el-table-column property="title" align="center" label="题目"  />
    </el-table>
  </el-drawer>
</template>
<script>
import navbar from "@/components/navbar/index.vue";
import solution from "@/views/solution/index.vue";
import solutionDetail from "@/views/solution/SolutionDetail.vue";
import Codemirror from 'codemirror-editor-vue3';
import { Edit, Plus } from '@element-plus/icons-vue'
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
import {get as getTest,saveRecord,getRecord} from '@/api/test'
import {get as getSolutions,save as saveSolution} from '@/api/solution'
import {get as getProblemById} from '@/api/problem'
import {get as getAnswerRecords} from '@/api/answerRecord'
import {get as getLabelList} from '@/api/label'
import {judge, test} from "@/api/judge";
import {ElNotification} from "element-plus";
import {debounce} from "@/utils";
export default {
  components: {
    navbar,solution,solutionDetail,Codemirror,mavonEditor,Edit,Plus
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
      rightSideVisible: 'codeEdit',
      height: document.documentElement.clientHeight - 240,
      languageId: null,
      languageList: [],
      labelList: [],
      problem: {},
      solution: {},
      solutionKey: 0,
      test: null,
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
    testProblems() {
      if (!this.testExaminationPaper) {
        return
      }
      return this.testExaminationPaper.examinationPaperProblems.map(data=>data.problem)
    },
    testExaminationPaper() {
      if (!this.test) {
        return
      }
      return this.test.examinationPaper
    },
    testCountdown() {
      if (!this.test) {
        return Date.now()
      }
      return Date.parse(this.test.endTime)
    },
    problemCount() {
      return this.testProblems.length
    },
    problemIndex() {
      return this.testProblems.findIndex(p=>{
        return p.id === this.problem.id
      })
    },
    testStatus() {
      if (!this.test) {
        return
      }
      return this.checkTestStatus(this.test)
    }
  },
  methods: {
    changeLanguageTemplate(languageId) {
      this.code = this.languageList.filter(language=>language.id === languageId)[0].compileStatement
    },
    submitTest() {
      const testRecord = {
        testId: this.test.id
      }
      saveRecord(testRecord).then(data=>{
        if (data === false) {
          ElNotification.error("提交失败")
        }
        this.$router.push({
          path: `/test_result/${this.test.id}`,
        })
      })
    },
    getLabelList() {
      getLabelList().then(data=>{
        this.labelList = data
      })
    },
    addSolution() {
      this.solution.problem = this.problem
      saveSolution(this.solution).then(data=>{
        this.solutionKey++
        this.showSolution(data)
        this.rightSideVisible = 'solutionDetail'
      })
    },
    toProblemById(row) {
     this.$router.push({
        path: `/problem/${row.id}`,
        query: {examId: this.test.id}
      })
    },
    toProblem(problemIndex) {
      if (problemIndex>=this.problemCount || problemIndex < 0) {
        return
      }
      const problemId = this.testProblems[problemIndex].id
      this.$router.push({
        path: `/problem/${problemId}`,
        query: {examId: this.test.id}
      })
    },
    submitCode() {
      let answerRecordToJudge = {
        code: this.code,
        languageId: this.languageId,
        problemId: this.problem.id,
        testId: this.test.id
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
      let answerRecordToJudge = {
        code: this.code,
        languageId: this.languageId,
        input: this.codeConsole.testCase
      }
      test(answerRecordToJudge).then(data=>{

        this.codeConsole.error = data.error
        this.codeConsole.log = data.log
        this.codeConsole.show = 'console'
        this.codeConsole.tab = 'executeResult'
      })
    },
    getProblem(callback) {
      let problemId = this.id
      if (!problemId) {
        problemId = this.testProblems[0].id
      }
      getProblemById(problemId).then(data=>{
        this.problem = data.content[0]
        callback(problemId)
      })
    },
    getLanguageList() {
      getLanguageList().then(data=>{
        this.languageList = data.content
      })
    },
    getSolutions() {
      getSolutions(this.problem.id).then(data=>{
        console.log(data)
        this.solutions = data
      })
    },
    getAnswerRecords() {
      let outOfDate = null
      if (this.checkTestStatus(this.test) === 0) {
            outOfDate = this.test.id
            this.checkSubmitTest()
      }
      getAnswerRecords(this.problem.id,null,outOfDate).then(answerRecordData=>{
        this.answerRecords = answerRecordData.content
      })
    },
    showSolution(item) {
      this.solutionDetail = item
      this.rightSideVisible = 'solutionDetail'
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
    checkTestStatus(test) {
      if (!test.enabled) {
        return 1
      }
      const currentTime = Date.parse(new Date())
      const startTime = Date.parse(test.startTime)
      const endTime = Date.parse(test.endTime)
      if (currentTime < startTime) {
        return -1
      } else if (currentTime > startTime && currentTime < endTime) {
        return 0
      } else {
        return 1
      }
    },
    clearData() {
     this.leftTab = null
     this.solutionDetail = {}
     this.rightSideVisible = 'codeEdit'
     this.height = document.documentElement.clientHeight - 240
     // this.languageId = null
     // this.languageList = []
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

    },
    loadData() {
      const examId = this.$route.query.examId
      const answerRecordId = this.$route.query.answerRecordId
      if (answerRecordId) {
        //已交卷情况
        getAnswerRecords(null,answerRecordId).then(data=>{
          this.code = data.content[0].code
          getTest(data.content[0].testId).then(testData => {
            this.test = testData.content[0]
            this.getProblem(problemId=>{
              getAnswerRecords(problemId).then(answerRecordData=>{
                this.answerRecords = answerRecordData.content
              })
            })
          })
        })
        return
      }
      if (examId) {
        //未交卷情况
        getTest(examId).then(testData => {
          this.test = testData.content[0]
          let outOfDate = null
          //已交卷情况判断
          if (this.checkTestStatus(this.test) === 0) {
            outOfDate = examId
            this.checkSubmitTest()
          }
          this.getProblem(problemId=>{
            getAnswerRecords(problemId,null,outOfDate).then(answerRecordData=>{
              this.answerRecords = answerRecordData.content
            })
          })
        })
        return
      }
      ElNotification.error("非法情况")
      this.$router.back(1)
    },
    checkSubmitTest() {
      getRecord(this.test.id).then(data=>{
        if (data) {
          ElNotification.warning("你已经完成过作答")
          this.$router.back(1)
        }
      })
    },
  },
  mounted() {
    this.loadData()
    this.getLanguageList()
    this.getLabelList()
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
        // this.getExaminationPaper()
        this.loadData()
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
.v-note-wrapper{
  /*max-height: calc(100vh - 300px);*/
}
</style>
