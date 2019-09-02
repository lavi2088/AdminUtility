import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import axios from "axios";

import auth from "@/store/modules/auth";
import links from "@/store/modules/links";
import servers from "@/store/modules/servers";
import instances from "@/store/modules/instances";

Vue.use(Vuex);

const defaultState = {
  devops: {
    axios: axios.create({
      baseURL: process.env.VUE_APP_DEVOPS_AXIOS_BASE_URL,
      timeout: process.env.VUE_APP_DEVOPS_AXIOS_TIMEOUT_MS,
      withCredentials: process.env.VUE_APP_DEVOPS_AXIOS_WITH_CREDENTIALS
    })
  },
  settings: {
    theme: {
      dark: true
    },
    nav: {
      model: null,
      mini: false
    },
    data: {
      clear: true
    }
  }
};

const getters = {
  auth: state => state.auth,
  settings: state => state.settings,
  links: state => state.links.links,
  servers: state => state.servers.servers,
  instances: state => state.instances
};

const mutations = {
  SAVE(state) {
    state;
  },
  TOGGLE(state, setting) {
    switch (setting) {
      case "THEME":
        state.settings.theme.dark = !state.settings.theme.dark;
        break;
      case "NAV_MINI":
        state.settings.nav.mini = !state.settings.nav.mini;
        break;
      default:
        console.error(
          "The following setting toggle does not exist: " + setting
        );
        break;
    }
  }
};

const actions = {
  TOGGLE: function(context, setting) {
    context.commit("TOGGLE", setting);
  },
  INIT: async function(context) {
    await context.dispatch("links/RESET");
    await context.dispatch("servers/RESET");
    await context.dispatch("instances/RESET");
  },
  CLEAR: function(context, all = false) {
    if (all) {
      window.sessionStorage.clear();
      return;
    }

    //const savedAuth = _.clone(this.state.auth);
    const savedAuth = { ...this.state.auth };
    window.sessionStorage.clear();
    //Object.assign(this.state, defaultState);
    Object.assign(this.state.auth, savedAuth);
    context.commit("SAVE");
  }
};

const vuexLocal = new VuexPersistence({
  key: "cpodx-devops",
  storage: window.sessionStorage,
  reducer: state => ({
    auth: state.auth,
    settings: state.settings,
    links: state.links.links,
    servers: state.servers.servers,
    instances: state.instances
  })
});

export default new Vuex.Store({
  modules: { auth, links, servers, instances },
  state: { ...defaultState },
  getters,
  mutations,
  actions,
  plugins: [vuexLocal.plugin]
});
