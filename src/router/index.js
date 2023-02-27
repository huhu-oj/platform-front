import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import answerRecord from "@/views/user/AnswerRecord.vue";
import myTest from "@/views/user/MyTest.vue";
import problem from "@/views/problem"
import answerRecordDetail from "@/views/user/AnswerRecordDetail.vue";
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
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
    path: '/problem',
    component: problem
  },
  {
    path: '/answer_record_detail',
    component: answerRecordDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
