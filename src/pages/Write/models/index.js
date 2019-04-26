export default {
  namespace: 'write',

  state: {
    current: null,
  },

  reducers: {
    saveCurrent(state, action) {
      const current = action;
      console.log(current);
    },
  },
};
