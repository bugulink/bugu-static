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
      const { data } = await request.post('/links', {
        offset,
        limit: SIZE
      });
      const fileMap = {};
      data.files.forEach((file) => {
        const id = file.link_id;
        if (!fileMap[id]) {
          fileMap[id] = [];
        }
        fileMap[id].push(file);
      });
      data.rows.forEach((link) => {
        link.files = fileMap[link.id] || [];
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
      offset, count, rows, isReload
    }) {
      const list = isReload ? rows : [...state.list, ...rows];
      return {
        ...state,
        offset,
        count,
        list
      };
    }
  }
};
