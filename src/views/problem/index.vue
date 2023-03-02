<template>
  <el-container class="container">
    <el-header>
      <navbar/>
    </el-header>
    <el-main >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-tabs type="border-card">
            <el-tab-pane label="题目描述" style="height: calc(100vh - 231px)">
              <el-scrollbar>
                <div style="margin-bottom: 20px">{{ problem.title }}</div>
                <el-space wrap>
                  <el-tag v-for="item in problem.labels">{{item.name}}</el-tag>
                </el-space>
                <el-divider/>
                <div v-html="problem.descriptionHtml" ></div>
                <el-collapse v-model="activeHint" accordion class="bottom-fix" style="width: 100%">
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
            <el-tab-pane label="提交记录" style="height: calc(100vh - 231px)">
              <el-scrollbar>
              <el-table :data="answerRecords">
                <el-table-column prop="createTime" label="提交时间"/>
                <el-table-column prop="language.name" label="语言"/>
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
                        {{codeConsole.log}}
                      </div>
                      <div v-if="codeConsole.error">
                        {{codeConsole.error}}
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
          <solution-detail  :solution="solutionDetail"/>
        </el-col>
      </el-row>
    </el-main>
    <el-footer class="vcenter">
      <el-row :gutter="20">
        <el-col :span="12" style="display: flex;padding: 0 10px">
          <el-button>题目列表</el-button>
          <div style="display: flex;flex-grow: 5"></div>
<!--          <el-button>随机一题</el-button>-->
          <div style="display: flex;flex-grow: 1"></div>
          <el-button-group class="ml-4">
            <el-button >上一题</el-button>
            <el-button disabled>1/23</el-button>
            <el-button >下一题</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="12" style="display: flex;padding: 0 10px">
<!--          <el-button>控制台</el-button>-->
          <div style="display: flex;flex-grow: 1"></div>
          <el-button @click="testCode">执行代码</el-button>
          <el-button type="success" @click="submitCode">提交</el-button>
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
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/fold/foldcode'
// 主题
import 'codemirror/theme/dracula.css';

import {get as getLanguageList} from '@/api/language'
import {get as getSolutions} from '@/api/solution'
import {get as getProblemById} from '@/api/problem'
import {get as getAnswerRecords} from '@/api/answerRecord'
import {judge, test} from "@/api/judge";
import {ElNotification} from "element-plus";
import {debounce} from "@/utils";

export default {
  components: {
    navbar,solution,solutionDetail,Codemirror
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
      solutionDetail: {},
      codeEditVisible: true,
      height: document.documentElement.clientHeight - 240,
      languageId: null,
      languageList: [],
      problem: {},
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
      activeHint: 1,
      answerRecords: [],
      codeConsole: {
        show: null,
        tab: null,
        testCase: '',
        error: null,
        log: null,
      }
    }
  },
  computed: {
  },
  methods: {

    judge() {
      judge(this.answerRecordToJudge).then(data=>{

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
      getProblemById(this.id).then(data=>{
        this.problem = data.content[0]
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
        getAnswerRecords(this.$route.query.answerRecordId).then(data=>{
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
    }
  },
  mounted() {
    this.getProblem()
    this.getAnswerRecord()
    this.getLanguageList()
    this.getAnswerRecords()
    window.addEventListener('resize', debounce(() => {
      if (this.height) {
        this.height = document.documentElement.clientHeight - 240
      }
    }, 100))
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


</style>
