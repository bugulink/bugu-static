import request from '../request';

const SIZE = 20;

export default {
  state: {
    list: [],
    count: 0,
    offset: 0
  },
  actions: {
    async getList({ commit, select }, isReload) {
      const offset = isReload ? 0 : select().offset;
      const { data } = await request.post('/files', {
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
    getListDone(state, { offset, count, rows, isReload }) {
      const list = isReload ? rows : [...state.list, ...rows];
      return {
        ...state,
        offset,
        count,
        list
      };
    },
    selectAll(state, selected) {
      const list = state.list.map(f => ({ ...f, selected }));
      return { ...state, list };
    },
    select(state, id) {
      const list = state.list.map(f => {
        if (f.id === id) {
          return { ...f, selected: !f.selected };
        }
        return f;
      });
      return { ...state, list };
    }
  }
};
