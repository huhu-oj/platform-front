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
        <h3>{{answerRecord.problem.title}}</h3>
        <h1>提交记录</h1>
        <div class="border">
          <div style="display: flex">
            <div>{{answerRecord.passNum}} / {{ totalCase }} 个通过测试用例</div>

            <div style="flex-grow: 1"></div>

            <div>
              <div>状态:
                <span>{{ answerRecord.executeResult.name }}</span>
              </div>
              <div>提交时间:
                <span>{{ answerRecord.createTime }}</span>
              </div>
            </div>

          </div>
          <div class="error" v-if="answerRecord.error">
            <el-input type="textarea" :rows="6" readonly resize="none" v-model="answerRecord.error"></el-input>
          </div>
        </div>
        <el-divider/>
        <div style="display: flex">
          <div>
            <h2>提交的代码:</h2>
            <div>语言:
              <span>{{ answerRecord.language.name }}</span>
            </div>
          </div>
          <div style="flex-grow: 1"></div>
          <div>
            <el-link v-if="!answerRecord.note && !answerRecord.noteEditVisible" @click="answerRecord.noteEditVisible = true">添加备注</el-link>
            <el-input v-else-if="answerRecord.noteEditVisible" v-model="answerRecord.note" @blur="changeNote(answerRecord)"/>
            <span v-else @click="answerRecord.noteEditVisible = true">{{answerRecord.note}}</span>
            <el-button type="success" @click="toProblem">编辑代码</el-button>
          </div>
        </div>
        <div style="display: flex">
          <codemirror v-model:value="answerRecord.code" :options="options"/>

        </div>
        <div style="text-align: center">
          <el-button @click="$router.back(1)" text="plain">返回</el-button>
        </div>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import navbar from "@/components/navbar/index.vue";
import {get as getAnswerRecord, update as updateNote} from '@/api/answerRecord'
import Codemirror from 'codemirror-editor-vue3';
// 编辑器代码格式
import 'codemirror/mode/javascript/javascript.js';
// 自动刷新
import 'codemirror/addon/display/autorefresh';
export default {
  name: "AnswerRecordDetail",
  components: {
    navbar,Codemirror
  },
  computed: {
    totalCase() {
      return this.answerRecord.passNum+this.answerRecord.notPassNum
    }
  },
  props: ['id'],
  data() {
    return {
      answerRecord: {
        problem: {},
        executeResult: {},
        language: {}
      },
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
        readOnly: true, // 只读
        showCursorWhenSelecting: true,
        firstLineNumber: 1,
        matchBrackets: true,//括号匹配
      },
    }
  },
  methods: {
    changeNote(answerRecord) {
      updateNote(answerRecord).then(_=>{
        answerRecord.noteEditVisible = false
      })
    },
    getAnswerRecord() {
      getAnswerRecord(null, this.id).then(data=>{
        this.answerRecord = data.content[0]
        console.log(this.answerRecord)
      })
    },
    toProblem() {
      this.$router.push({path: `/problem/${this.answerRecord.problem.id}`,query: {answerRecordId: this.id}})
    }
  },
  mounted() {
    this.getAnswerRecord()
  }
}
</script>

<style scoped>
.border {
  border: 1px solid black;
  width: 100%;
}
.error {
  /*border-color: red;*/
  /*background-color: rgba(255,0,0,0.5);*/
}
:deep(.el-textarea__inner) {
  background-color: rgba(255,0,0,0.4);

}
</style>
