const defaultState = () => {
  return {
    links: []
  };
};

const getters = {
  all: state => state.links
};

const mutations = {
  SET: function(state, links) {
    state.links = links;
  }
};

const actions = {
  RESET: async function({ dispatch }) {
    await dispatch("GET");
  },
  GET: async function({ commit, rootState }) {
    await rootState.devops
      .axios("/schemas/links")
      .then(response => commit("SET", response.data));
  }
};

export default {
  namespaced: true,
  state: defaultState(),
  getters,
  mutations,
  actions
};
