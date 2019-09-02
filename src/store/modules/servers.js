const defaultState = () => {
  return {
    servers: []
  };
};

const getters = {
  all: state => state.servers
};

const mutations = {
  SET: function(state, servers) {
    state.servers = servers;
  }
};

const actions = {
  RESET: async function({ dispatch }) {
    await dispatch("GET");
  },
  GET: async function({ commit, rootState }) {
    await rootState.devops
      .axios("/schemas/servers")
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
