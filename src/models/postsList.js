import { findPost } from '@/services/write';

export default {
  namespace: 'postsList',
  state: null,
  effects: {
    *findPostByID({ id }, { call, put }) {
      const { data } = yield call(findPost, id);
      const { post } = data;
      yield put({
        type: 'write/saveCurrent',
        post,
      });
    },
  },
};
