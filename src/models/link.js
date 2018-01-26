import request from '../request';

const SIZE = 20;

export default {
  state: {
    files: [],
    list: [],
    count: 0,
    offset: 0
  },
  actions: {
    async getList({ commit, select }, isReload) {
      const offset = isReload ? 0 : select().offset;
      const { data } = await request.post('/links', {
        offset,
        limit: SIZE
      });
      commit('getListDone', {
        ...data,
        isReload,
        offset: offset + SIZE
      });
    }
  },
  reducers: {
    getListDone(state, {
      offset, count, rows, files, isReload
    }) {
      const list = isReload ? rows : [...state.list, ...rows];
      const tmp = isReload ? files : [...state.files, ...files];
      return {
        ...state,
        files: tmp,
        offset,
        count,
        list
      };
    }
  }
};
