import router from "@/router";

const defaultState = {
  username: undefined,
  error: ""
};

const mutations = {
  SET(state, user) {
    state.username = user.username;
    state.error = user.error;
  }
};

const actions = {
  LOGIN: async function(context, user) {
    context.rootState.devops.axios
      .post("/auth/login", {
        username: user.username,
        password: user.password
      })
      .then(async () => {
        context.commit("SET", { username: user.username, error: "" });
        await context.dispatch("INIT", true, { root: true });
        router.push("home");
      })
      .catch(err => {
        if (err.response) context.state.error = err.response.data;
        else context.state.error = err;
      });
  },
  LOGOUT: function(context) {
    context.rootState.devops.axios
      .post("/auth/logout")
      .then(() => {
        context.dispatch("CLEAR", true, { root: true });
        router.push("login");
      })
      .catch(err => {
        console.error("Error logging out", err);
      });
  },
  PING: async function(context, params) {
    await context.rootState.devops.axios.post("/auth/ping").catch(err => {
      if (err.response) context.state.error = err.response.data;
      else context.state.error = err;

      context.dispatch("CLEAR", true, { root: true });

      if (!params.isRouter) router.push("login");
    });
  }
};

export default {
  namespaced: true,
  state: { ...defaultState },
  getters: {},
  mutations,
  actions
};
