<template>
  <el-dialog :close-on-click-modal="false"  v-model="formVisible" :title="formTitle" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model="form.description" :rows="3" type="textarea" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="试卷" prop="examinationPaper">
        <el-select v-model="form.examinationPaper" value-key="id" filterable placeholder="Select">
          <el-option
              v-for="item in examinationPaperList"
              :key="item.id"
              :label="item.name"
              :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="form.startTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" style="width: 370px;" />
      </el-form-item>
      <el-form-item label="关联单位" prop="depts" v-if="formTitle === '新增'">
        <el-tree
            ref="deptTree"
            :data="deptDatas"
            :load="getDeptDatas"
            :props="defaultProps"
            :expand-on-click-node="false"
            v-model="form.depts"
            lazy
            show-checkbox
            @check-change="handleDeptChange"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="formVisible = false">取消</el-button>
      <el-button type="primary" @click="submitCU">确认</el-button>
    </div>
  </el-dialog>
  <el-container>
    <el-header v-if="userRoles.indexOf('老师') !== -1">
      <el-button @click="addTest">添加</el-button>
    </el-header>

    <el-header v-if="userRoles.indexOf('学生') !== -1">
      <el-select v-model="testStatus">
        <el-option label="未开始" :value="-1"/>
        <el-option label="进行中" :value="0"/>
        <el-option label="已结束" :value="1"/>
      </el-select>
    </el-header>
    <el-main>
<!--      <el-button @click="manager = !manager">管理</el-button>-->
      <el-table v-if="userRoles.indexOf('老师') !== -1" :data="tests" @row-click="toTestAnalysis">
        <el-table-column prop="title" label="测验名称"/>
        <el-table-column prop="examinationPaper.name" label="使用试卷"/>
        <el-table-column prop="startTime" label="开始时间"/>
        <el-table-column prop="endTime" label="结束时间"/>
        <el-table-column prop="enabled" label="状态">
          <template #default="scope">
            <el-tag type="success" v-if="checkTestStatus(scope.row) === -1">未开始</el-tag>
            <el-tag v-if="checkTestStatus(scope.row) === 0">进行中</el-tag>
            <el-tag type="info" v-if="checkTestStatus(scope.row) === 1">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" :disabled="checkTestStatus(scope.row) !== -1" @click="updateTest(scope.row)">修改</el-button>
             <el-popconfirm title="确认删除" @confirm="delTest(scope.row)">
               <template #reference>
                 <el-button v-if="checkTestStatus(scope.row) === -1" size="small" type="danger" >删除</el-button>
                 <el-button v-if="checkTestStatus(scope.row) === 1" :disabled="checkTestStatus(scope.row) === 1" size="small" type="danger" >删除</el-button>
               </template>
             </el-popconfirm>
            <el-popconfirm title="确认结束当前测验" @confirm="endTest(scope.row)">
              <template #reference>
                <el-button v-if="checkTestStatus(scope.row) === 0" size="small" type="danger" >结束</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="userRoles.indexOf('学生') !== -1">
        <div v-if="tests.length !== 0" v-for="item in tests">
          <el-card v-show="checkTestStatus(item) === testStatus" class="test">
            <el-row>
              <el-link class="title" @click="toExaminationPaper(item.id)">{{item.title}}</el-link>
              <el-col style="display: flex">
                <el-tag type="success" v-if="checkTestStatus(item) === -1">未开始</el-tag>
                <el-tag v-if="checkTestStatus(item) === 0">进行中</el-tag>
                <el-tag type="info" v-if="checkTestStatus(item) === 1">已结束</el-tag>
                <div style="flex-grow: 1"/>
                <el-link :href="`/test_result/${item.id}`" v-if="showTestDetail(item.id)">详情统计</el-link>
              </el-col>
            </el-row>

          </el-card>
        </div>
        <div v-else >
          <span style="height: 200px;display: flex;flex-direction: column;justify-content: center;align-items: center">暂无测验</span>
        </div>
      </div>


    </el-main>
  </el-container>


</template>

<script>
import {get as getMyTests,getForTeacher, save as saveTest, update as updateTest, del as delTest,getRecords} from '@/api/test'
import {getDepts} from "@/api/system/dept";
import {get as getExaminationPaper} from '@/api/examinationPaper'
import {checkTestStatus, parseTime} from '@/utils'
import {ElNotification} from "element-plus";
import { mapGetters } from 'vuex'
export default {
  name: "MyTest",
  computed: {
    ...mapGetters([
        "roles","userRoles"
    ]),

  },
  data() {
    return {
      manager: false,
      tests: [],
      testStatus: 0,
      testDetails: [],
      formVisible: false,
      formTitle: '新增',
      form: { id: null, title: null, description: null, examinationPaper: null, startTime: parseTime(new Date(),null), endTime: null, enabled: true, depts:[] },
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        // description: [
        //   { required: true, message: '备注不能为空', trigger: 'blur' }
        // ],
        examinationPaper: [
          { required: true, message: '试卷不能为空', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
        ],
        depts: [
          { required: true, message: '至少关联一个单位', trigger: 'blur' }
        ]
      },
      examinationPaperList: [],
      deptDatas: [],
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
    }
  },
  methods: {
    checkTestStatus(data) {
      return checkTestStatus(data)
    },
    showTestDetail(testId) {
      if (this.testDetails.length === 0) {
        return false
      }
      return this.testDetails.some(d=>d.testId === testId)
    },
    toTestAnalysis(row) {
      this.$router.push(`/teacher/test-analysis/${row.id}`)
    },
    toExaminationPaper(examId) {
      this.$router.push({
        path: `/exam/${examId}`
      })
    },
    getMyTests() {
      if (this.userRoles.indexOf('老师') !== -1) {
        getForTeacher().then(data=>{
          this.tests = data.content
        })
      }
      if (this.userRoles.indexOf('学生') !== -1) {
        console.log(this.userRoles)
        getMyTests().then(data=>{
          this.tests = data.content
        })
      }
    },
    getMyRecords() {
      getRecords().then(data=>{
        this.testDetails = data
      })
    },
    addTest() {
      this.formTitle = '新增'
      this.form = { id: null, title: null, description: null, examinationPaper: null, startTime: Date.now(), endTime: null, enabled: true, depts:[] }
      this.formVisible = true
    },

    updateTest(row) {
      this.formTitle = '修改'
      this.formVisible = true
      this.form = row
    },
    delTest(row) {
      delTest(row.id).then(data=>{
        ElNotification.success({
          title: "删除测验成功"
        })
        this.getMyTests()
      })
    },
    endTest(row) {
      row.enabled = false
      updateTest(row).then(data=>{
        ElNotification.success("已结束当前测验")
        this.getMyTests()
      })
    },
    getDeptDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getDepts(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.deptDatas = res.content
          }
        })
      }, 100)
    },
    handleDeptChange() {
      this.form.depts = this.$refs.deptTree.getCheckedNodes()
      console.log(this.form.depts)
    },
    submitCU() {
      if (this.formTitle === '新增') {
        saveTest(this.form).then(data=>{
          this.formVisible = false
          ElNotification.success({
            title: "新增测验成功"
          })
          this.getMyTests()
        })
      }else {
        updateTest(this.form).then(data=>{
          this.formVisible = false

          ElNotification.success({
            title: "修改测验成功"
          })
          this.getMyTests()
        })
      }
    },
    getExaminationPapers() {
      getExaminationPaper().then(data=>{
        this.examinationPaperList = data.content
      })
    },
    changeEnabled(data, val, op) {
      this.$confirm('此操作将 "' + op + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateTest(data).then(res => {
          this.$notify({title: op + '成功'})
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  },
  mounted() {
    this.getMyTests()
    this.getMyRecords()
    this.getExaminationPapers()
  }
}
</script>

<style scoped>
.test {
  margin: 20px auto;
}
.title {
  display: block;
  font-size: 20px;

}
</style>
