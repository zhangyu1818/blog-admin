import { addPost } from '@/services/write';

export default {
  namespace: 'write',

  state: {
    current: null,
    categories: [],
    tags: [],
  },

  effects: {
    *addPost({ data }, { call, put }) {
      const response = yield call(addPost, data);
      console.log(response);
    },
  },

  reducers: {},
};
