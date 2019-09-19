import { login, getInfo } from '@/api/user'
import { getLoginInfo, getLoginUserId, setLoginInfo, removeLoginInfo } from '@/utils/login'
import { resetRouter } from '@/router'

const state = {
  user: null,
  login: null,
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_LOGIN: (state, login) => {
    state.login = login
  },
  SET_ALL: (state, data) => {
    state = Object.assign(state,data);
  },
  UNSET_ALL: (state) => {
    state = {
      user: null,
      login: null,
    };
  },
};

const actions = {
  // user login
  login({ commit }, input) {
    return new Promise((resolve, reject) => {
      login({input:input}).then(response => {
        const { data } = response;
        commit('SET_ALL', data);
        setLoginInfo(data.user.id,data.login.token);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('UNSET_ALL');
      removeLoginInfo();
      resetRouter();
      resolve()
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(getLoginUserId()).then(response => {
        const { data } = response;
        if (!data) {
          reject('异地登录，请重新登录')
        }
        commit('SET_USER', data);
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

