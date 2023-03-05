import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import answerRecord from "@/views/user/AnswerRecord.vue";
import myTest from "@/views/user/MyTest.vue";
import problem from "@/views/problem"
import answerRecordDetail from "@/views/user/AnswerRecordDetail.vue";
import loginView from "@/views/LoginView.vue";
import examinationPaper from "@/views/problem/ExaminationPaper";


import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '',
        redirect: 'my-test'
      },
      {
        path: 'answer',
        component: answerRecord
      },
      {
        path: 'my-test',
        component: myTest
      }
    ]
  },
  {
    path: '/problem/:id',
    component: problem,
    props: true
  },
  {
    path: '/problem',
    component: problem,
    props: true
  },
  {
    path: '/answer_record_detail/:id',
    component: answerRecordDetail,
    props: true
  },
  {
    path: '/exam/:id',
    component: examinationPaper,
    props: true
  },
  {
    path: '/login',
    component: loginView,
    props: true
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(()=>{
          next()
        }).catch(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})


router.afterEach(() => {
  NProgress.done() // finish progress bar
})

export default router
