import request from '../request';
import { message } from '../utils';

export default {
  state: {
    info: window.USER || null,
    visible: false,
    capacity: {
      total: 0,
      used: 0
    }
  },
  actions: {
    async sendCode(ctx, email) {
      await request.post('/captcha', { email });
    },
    async login({ commit }, params) {
      const { data } = await request.post('/login', params);
      commit('loginDone', data);
    },
    async getCapacity({ commit }, visible) {
      commit('visible', visible);
      if (!visible) return;
      try {
        const { data } = await request.post('/user/capacity');
        commit('capacityDone', data);
      } catch (e) {
        message.error('Get capacity failed!');
      }
    }
  },
  reducers: {
    visible(state, visible) {
      return { ...state, visible };
    },
    capacityDone(state, capacity) {
      return { ...state, capacity };
    },
    loginDone(state, info) {
      return { ...state, info };
    }
  }
};
