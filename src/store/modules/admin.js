import { login, logout, getInfo } from '@/api/admin'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // 管理员登陆
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const data = response.data
        const tokenStr = data.tokenPrefix + data.token
        setToken(tokenStr)
        commit('SET_TOKEN', tokenStr)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取管理员信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response.data
        const admin = data.admin
        const roles = data.roles
        const permissions = data.permissions
        commit('SET_NAME', admin.username)
        commit('SET_AVATAR', admin.avatar)
        commit('SET_ROLES', roles)
        commit('SET_PERMISSIONS', permissions)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 管理员退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
