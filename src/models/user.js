import request from '../request';

export default {
  state: {
    info: window.USER || null
  },
  actions: {
    async sendCode(ctx, email) {
      await request.post('/captcha', { email });
    },
    async login({ commit }, params) {
      const { data } = await request.post('/login', params);
      commit('loginDone', data);
    }
  },
  reducers: {
    loginDone(state, info) {
      return { ...state, info };
    }
  }
};
