import Vue from "vue";
import axios from "axios";

class WS {
  constructor(opts) {
    this.username = opts.username;
    this.url = opts.url;
    this.socket = undefined;
    this.token = undefined;
    this.requests = [];

    this.connect(opts.username, opts.password);
  }

  isAvailable() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  close() {
    if (this.isAvailable()) this.socket.close();
  }

  send(msg) {
    if (this.isAvailable()) this.socket.send(JSON.stringify(msg));
  }

  async connect(username, password) {
    if (this.isAvailable()) {
      console.warn(this.username + ": already connected");
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.info(this.username + ": websocket connected");
      this.send({
        web_logon_request: { username: username, password: password }
      });
    };

    this.socket.onmessage = message => {
      const jsonMsg = JSON.parse(message.data);
      this.msgHandler(jsonMsg);
    };
  }

  async msgHandler(response) {
    const type = Object.keys(response)[0];
    switch (type) {
      case "web_logon_response":
        console.info(this.username + ": session established");
        this.token = response[type].cpod_web_session_id;
        break;
      default:
        var req = this.requests.find(
          req => req.id === response[type].request_id
        );
        if (!req) {
          console.error(
            "Failed to find request for response: ",
            response[type]
          );
          return;
        }
        req.response = response[type];
        break;
    }
  }
}

class Session {
  constructor(session) {
    this.name = session.name;
    this.requestId = 0;

    this.ws = new WS({
      username: session.username,
      password: session.password,
      url: "ws://127.0.0.1:5099/router/ws"
    });
  }
}

class Instance {
  constructor(instance) {
    for (const key in instance) {
      this[key] = instance[key];
    }
    this.isAvailable = false;
    this.schema = {
      search: null,
      requests: []
    };
    this.schemaSearch = null;
    this.activeSession = null;
    this.sessions = [];
    this.stateStepper = 3;
    this.states = [
      {name: "start", completed: false},
      {name: "preopen", completed: false},
      {name: "open", completed: false},
      {name: "eod", completed: false},
      {name: "closed", completed: false}
    ];
  }
}

const mutations = {
  SAVE(state) {
    state;
  },
  ADD_INSTANCE: (state, instance) => {
    Vue.set(state, instance.name, new Instance(instance));
  },
  ADD_SESSION: (state, params) => {
    state[params.instance.name].sessions.push(new Session(params.session));
  },
  TOGGLE_SESSION: (state, params) => {
    if (!params.session) state[params.instance.name].activeSession = null;
    else state[params.instance.name].activeSession = params.session.ws.token;
  },
  INCREMENT_REQUEST_ID: (state, params) => {
    ++state[params.instance.name].sessions[params.id].requestId;
  },
  ADD_REQUEST: (state, params) => {
    state[params.instance.name].sessions[params.id].ws.requests.push({
      name: params.request.name,
      id: state[params.instance.name].sessions[params.id].requestId,
      params: { ...params.request.params },
      schema: { ...params.request.params },
      selected: true,
      response: {}
    });
  }
};

const actions = {
  RESET: async function({ state, dispatch }) {
    await dispatch("GET_INSTANCES");
    await Object.values(state).forEach(async instance => {
      await dispatch("GET_SCHEMA", instance);
      await dispatch("GET_STATUS", instance);
    });
  },
  GET_INSTANCES: async function({ commit, rootState }) {
    await rootState.devops.axios("/schemas/instances").then(response => {
      response.data.forEach(instance => commit("ADD_INSTANCE", instance));
    });
  },
  GET_SCHEMA: async function(context, instance) {
    if (instance.name !== "dev") return;
    // Keep until axios is instance specific

    await axios.get("http://127.0.0.1:5099/router/schema").then(response => {
      instance.schema.requests = response.data;
      instance.isAvailable = true;
      context.commit("SAVE");
    });
  },
  GET_STATUS: async function(context, instance) {
    await context.rootState.devops.axios
      .get(`/instances/${instance.name}/status`, { timeout: 5000 })
      .then(response => {
        instance.status = response.data.status;
        instance.endPoints = response.data.endPoints;
      });
  },
  SEND_SELECTED: function(context, session) {
    session.ws.requests.forEach(req => {
      if (!req.selected) return;

      req.params.sender_comp_id = session.ws.username;
      req.params.cpod_web_session_id = session.ws.token;
      req.params.request_id = req.id;

      session.ws.send({ [req.name]: req.params });
    });
  },
  REMOVE_SELECTED: function({ commit }, session) {
    session.ws.requests = session.ws.requests.filter(req => !req.selected);
    commit("SAVE");
  },
  REMOVE_SESSION: function({ commit }, params) {
    params.instance.sessions = params.instance.sessions.filter(
      session => session.name !== params.session.name
    );
    if (params.instance.sessions.length === 0)
      params.instance.activeSession = null;
    commit("SAVE");
  },
  ADD_REQUEST: ({ commit }, params) => {
    let session = params.instance.sessions.findIndex(
      session =>
        params.instance.activeSession &&
        session.ws.token === params.instance.activeSession
    );
    if (session < 0) {
      console.warn("No session with token: " + params.token);
      return;
    }
    commit("INCREMENT_REQUEST_ID", { instance: params.instance, id: session });
    commit("ADD_REQUEST", {
      instance: params.instance,
      id: session,
      request: params.request
    });
  },
  EXEC_TASK: async function(context, params) {
    console.debug("Params for execution: ", params);
  },
};

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations,
  actions
};
