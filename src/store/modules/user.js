import { login, getInfo, logout } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

import {encrypt} from "@/utils/rsaEncrypt";
import {deepClone} from "@/utils";

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    userRoles: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_ROLES: (state, roles) => {
      state.userRoles = roles
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const data = deepClone(userInfo)
      //加密密码
      data.password = encrypt(data.password)
      return login(data).then(res => {
        setToken(res.token)
        commit('SET_TOKEN', res.token)
        setUserInfo(res.user, commit)
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    },

  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  console.log(res.user.roles)
  if (res.user.roles.length === 0) {
    commit('SET_USER_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_USER_ROLES', res.user.roles.map(role=>role.name))
  }
  commit('SET_USER', res.user)
}

export default user
