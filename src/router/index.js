import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import answerRecord from "@/views/user/AnswerRecord.vue";
import myTest from "@/views/user/MyTest.vue";
import problem from "@/views/problem"
import answerRecordDetail from "@/views/user/AnswerRecordDetail.vue";
import loginView from "@/views/LoginView.vue";
import examinationPaper from "@/views/problem/ExaminationPaper";
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
    component: loginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
