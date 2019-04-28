import { findPost } from '@/services/write';
import router from 'umi/router';

export default {
  namespace: 'postsList',
  state: null,
  effects: {
    *findPostByID({ id }, { call, put }) {
      try {
        const { data } = yield call(findPost, id);
        const { post } = data;
        yield put({
          type: 'write/saveCurrent',
          post,
        });
        router.push('/posts/write');
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
  },
};
