<template>
  <el-row :gutter="20" justify="center" style="align-items: center;height: 100%">
    <el-col :span="8">
      <el-card @keyup.enter="login">
        <template #header>
          <h1 style="text-align: center">HUHUOJ</h1>
        </template>
        <el-form :model="form" status-icon :rules="rules" ref="form">
          <el-form-item prop="username">
            <el-input type="text" v-model="form.username" autocomplete="off"
                      placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input show-password v-model="form.password"
                    placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item prop="graphicCodeStr">
            <el-input v-model="form.graphicCodeStr"
                      placeholder="输入图形验证码">
              <template #suffix>
                <el-image :src="photoSrc" data-original="photoSrc" @click="refreshCode"/>
              </template>
            </el-input>

          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="login">
              登录
            </el-button>
            <el-button @click="resetForm('user')">
              重置
            </el-button>
          </el-form-item>
        </el-form>

      </el-card>
    </el-col>
  </el-row>


</template>

<script>


import {getCode, login} from "@/api/auth"
import Cookies from 'js-cookie'

export default {

  data() {

    return {
      photoSrc: '',
      form: {
        username: '',
        password: '',
        graphicCodeStr: '',
        graphicCodeId: '',

      },
      rules: {
        username: [
          {required: true, message: '账号不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', transform: value => value ? value.trim() : '', trigger: 'blur'}
        ],
        graphicCodeStr: [
          {required: true, message: '请输入验证码', transform: value => value ? value.trim() : '', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.form.password = "";
      this.refreshCode();
    },
    login() {

      login(this.form).then(data=>{
        //todo 登录后行为
        this.$router.push('/')
      }).catch(err=>{

      })
    },

    refreshCode() {
      getCode().then(res => {
        this.photoSrc = res.img
        this.form.graphicCodeId = res.uuid

      })
    },
  },
  created() {
    this.refreshCode()
  }

}

</script>

<style scoped>


</style>