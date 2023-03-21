import { login, getInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'
// import vuexEsm from "vuex";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  reset(state) {
    state.token = null
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 调用 @/api/user 下的 login 方法，该方法里面包含了自己要修改的登录接口（拿到token 方便用户后续的访问）
      login(userInfo).then(response => {
        // const token = JSON.parse(response.data).token
        const token = response.data.token
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response
  //
  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }
  //
  //       const { name, avatar } = data
  //
  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  // remove token
    logout({ commit, state }) {
      // 将cookie里面的 'user-token' 对应的值设置为 ''，相当于清除cookie 缓存
      commit('SET_TOKEN', '')
      removeToken()
      // 重置路由，将路由设置为登录的路由
      // resetRouter()
      window.location.href = '/login'
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

