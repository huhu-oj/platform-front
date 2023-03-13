<template>
  <el-dialog :close-on-click-modal="false"  v-model="formVisible" title="修改题解" width="80%">
    <el-form>
    <el-form-item label="标题">
      <el-input v-model="form.title"/>
    </el-form-item>
    <el-form-item label="标签" prop="label">
      <el-select
          v-model="form.labels"
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
        v-model="form.description"
        :boxShadow="false"
    />
  </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="formVisible = false">取消</el-button>
      <el-button type="primary" @click="updateSolution">确认</el-button>
    </div>
  </el-dialog>
  <el-container>
    <el-header >
<!--      <el-button @click="addSolution">添加</el-button>-->
    </el-header>
    <el-main>
  <el-table :data="solutions">
    <el-table-column prop="title" show-overflow-tooltip label="题解名称"/>
    <el-table-column prop="description" show-overflow-tooltip label="描述"/>
    <el-table-column prop="labels" label="标签">
      <template #default="scope">
        <el-tag
            v-for="item in scope.row.labels"
        >{{item.name}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="openCU(scope.row)">修改</el-button>
        <el-popconfirm title="确认删除" @confirm="delSolution(scope.row)">
          <template #reference>
            <el-button size="small" type="danger" >删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  </el-main>
  </el-container>

</template>

<script>
import {getMySolutions as getSolutions,update,del} from '@/api/solution'
import {get as getLabelList} from '@/api/label'
import {ElNotification} from "element-plus";
import {mavonEditor} from "mavon-editor";
export default {
  name: "SolutionManage",
  components: {
    mavonEditor
  },
  data() {
    return {
      solutions: [],
      formVisible: false,
      form: { title:null, description: null, labels:[] },
      labelList: []
    }
  },
  methods: {
    getSolutions() {
      getSolutions().then(data=>{
        this.solutions = data.content
      })
    },
    openCU(solution) {
      this.form = solution
      this.formVisible = true
    },
    updateSolution() {
      update(this.form).then(data=>{
        ElNotification.success("更新成功")
        this.formVisible = false
      })
    },
    delSolution() {
      del(this.form.id).then(data=>{
        ElNotification.success("删除成功")
      })
    },
    getLabelList() {
      getLabelList().then(data=>{
        this.labelList = data
      })
    }
  },
  created() {
    this.getSolutions()
    this.getLabelList()
  }
}
</script>

<style scoped>

</style>