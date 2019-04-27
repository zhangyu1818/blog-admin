export default {
  namespace: 'write',

  state: {
    current: null,
  },
  reducers: {
    saveCurrent(state, { post }) {
      // eslint-disable-next-line no-param-reassign
      state.current = post;
      return state;
    },
  },
};
