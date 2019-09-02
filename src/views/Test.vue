<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex>
        <v-card dark color="primary lighten-1" min-height="500">
          <v-tabs dark color="primary" slider-color="secondary">
            <!-- Tabs -->
            <v-tab>Instances</v-tab>
            <v-tab
              v-for="instance in instances"
              :key="instance.id"
              :disabled="!instance.isAvailable"
              ripple
            >{{instance.name}}</v-tab>
            <!-- Content -->
            <v-tab-item>
              <v-flex d-flex>TODO: Instances Overview</v-flex>
            </v-tab-item>
            <v-tab-item v-for="instance in instances" :key="instance.id">
              <v-flex xs12 xl6>
                <v-card>
                  <v-toolbar color="secondary pt-2">
                    <v-text-field
                      v-model="instance.schema.search"
                      prepend-icon="search"
                      label="Search (Coming Soon)"
                      append-outer-icon="refresh"
                      clearable
                      @click:append-outer="loadSchema(instance)"
                    ></v-text-field>
                  </v-toolbar>
                </v-card>
              </v-flex>
              <v-flex>
                <v-expansion-panel dark expand>
                  <v-expansion-panel-content class="primary">
                    <div slot="actions">
                      <v-icon>arrow_drop_down</v-icon>
                    </div>
                    <div slot="header">Requests ({{instance.schema.requests.length}})</div>
                    <v-card style="overflow-y: auto; max-height: 210px">
                      <v-expansion-panel>
                        <v-expansion-panel-content
                          v-for="request in instance.schema.requests"
                          :key="request.name"
                          class="primary lighten-1 py-0"
                          lazy
                        >
                          <div slot="header">
                            <v-btn
                              v-if="instance.activeSession"
                              color="secondary"
                              small
                              @click.stop
                              @click="addRequest(instance, request)"
                            >Add</v-btn>
                            {{request.name}}
                          </div>
                          <v-card>
                            <v-card-text class="secondary overflow-hidden py-0">
                              <v-layout
                                row
                                class="overflow-y-hidden secondary"
                                style="overflow-x: auto !important"
                              >
                                <v-flex
                                  v-for="(param, name, id) in request.params"
                                  :key="id"
                                  px-2
                                  style="min-width: 200px"
                                >
                                  <v-text-field
                                    :id="name"
                                    :label="name"
                                    v-model="request.params[name]"
                                    clearable
                                  ></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-card>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-flex>
              <v-flex>
                <v-card dark color="primary lighten-1 mb-3">
                  <v-tabs dark color="primary" slider-color="secondary">
                    <!-- Tabs -->
                    <v-tab @click="toggleSession(instance, undefined)">Sessions</v-tab>
                    <v-tab
                      v-for="session in instance.sessions"
                      :key="session.id"
                      ripple
                      @click="toggleSession(instance, session)"
                    >{{session.name}}</v-tab>
                    <v-tab @click="toggleSession(instance, undefined)">
                      <v-icon color="secondary">add</v-icon>
                    </v-tab>
                    <v-spacer></v-spacer>
                    <!-- Content -->
                    <v-tab-item></v-tab-item>
                    <v-tab-item v-for="(session, sessionId) in instance.sessions" :key="session.id">
                      <v-card flat>
                        <v-toolbar dense flat color="primary">
                          <v-checkbox
                            primary
                            hide-details
                            height="5"
                            v-if="session.ws.requests.length" 
                            :input-value="session.ws.requests.every(req => req.selected)"
                            :value="session.ws.requests.every(req => req.selected)"
                            :indeterminate="session.ws.requests.some(req => req.selected) && !session.ws.requests.every(req => req.selected)"
                            @click.stop="toggleSelected(session)"
                          ></v-checkbox>
                          <v-spacer></v-spacer>
                          <v-btn flat icon color="secondary" v-if="session.ws.requests.length" @click="sendSelected(session)">
                            <v-icon>send</v-icon>
                          </v-btn>
                          <v-btn flat icon color="secondary" v-if="session.ws.requests.length" @click="removeSelected(session)">
                            <v-icon>delete</v-icon>
                          </v-btn>
                          <v-btn
                            flat
                            icon
                            color="secondary"
                            @click="removeSession(instance, session)"
                          >
                            <v-icon>clear</v-icon>
                          </v-btn>
                        </v-toolbar>
                        <v-expansion-panel>
                          <v-expansion-panel-content
                            v-for="request in instances[instance.name].sessions[sessionId].ws.requests"
                            :key="request.id"
                            lazy
                            class="primary lighten-1"
                          >
                            <div slot="header">
                              <v-checkbox
                                v-model="request.selected"
                                :label="request.name"
                                height="5"
                                @click.stop="request.selected = !request.selected"
                              ></v-checkbox>
                            </div>
                            <v-card color="secondary">
                              <v-subheader>Params</v-subheader>
                              <v-card-text class="secondary overflow-hidden py-0">
                                <v-layout
                                  row
                                  class="overflow-y-hidden secondary"
                                  style="overflow-x: auto !important"
                                >
                                  <v-flex
                                    v-for="(param, name, id) in request.params"
                                    :key="id"
                                    px-2
                                    style="min-width: 200px"
                                  >
                                    <v-text-field
                                      :id="name"
                                      :label="name"
                                      v-model="request.params[name]"
                                      clearable
                                    ></v-text-field>
                                  </v-flex>
                                </v-layout>
                              </v-card-text>
                              <v-subheader>Response</v-subheader>
                              <v-card-text
                                class="secondary overflow-hidden pt-0"
                              >{{JSON.stringify(request.response, null, 2)}}</v-card-text>
                            </v-card>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-card>
                    </v-tab-item>
                    <v-tab-item>
                      <v-layout row wrap>
                        <v-flex offset-xs2 xs8>
                          <v-card class="primary lighten-1">
                            <v-card-text>
                              <v-form>
                                <v-text-field
                                  prepend-icon="title"
                                  name="Name"
                                  label="Session Name"
                                  type="text"
                                  size="20"
                                  autocomplete="none"
                                  v-model="newSession.name"
                                  autofocus
                                  clearable
                                ></v-text-field>
                                <v-text-field
                                  prepend-icon="person"
                                  name="Username"
                                  label="Username"
                                  type="text"
                                  size="20"
                                  autocomplete="none"
                                  v-model="newSession.username"
                                  clearable
                                ></v-text-field>
                                <v-text-field
                                  :id="instance.name+'password'"
                                  prepend-icon="lock"
                                  name="Password"
                                  label="Password"
                                  type="password"
                                  size="30"
                                  autocomplete="current-password"
                                  v-model="newSession.password"
                                  @keyup.enter="addSession(instance)"
                                  clearable
                                ></v-text-field>
                              </v-form>
                            </v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="success" @click="addSession(instance)">Add</v-btn>
                              <v-spacer></v-spacer>
                            </v-card-actions>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-tab-item>
                  </v-tabs>
                </v-card>
              </v-flex>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  data() {
    return {
      newSession: {
        name: "",
        username: "",
        password: ""
      }
    };
  },
  async created() {
    await this.$store.dispatch("instances/RESET");
  },
  filters: {
    toTitle: function(value) {
      return _.startCase(value);
    }
  },
  computed: {
    ...mapGetters(["instances"])
  },
  methods: {
    loadSchema(instance) {
      this.$store.dispatch("instances/GET_SCHEMA", instance);
    },
    addSession(instance) {
      if (
        this.newSession &&
        this.newSession.name.length &&
        this.newSession.username.length &&
        this.newSession.password.length
      ) {
        this.$store.commit("instances/ADD_SESSION", {
          instance: instance,
          session: this.newSession
        });
      } else {
        console.error(
          "Missing details for creating new session: ",
          this.newSession
        );
      }
      this.newSession = {
        name: "",
        username: "",
        password: ""
      };
    },
    toggleSession(instance, session) {
      this.$store.commit("instances/TOGGLE_SESSION", {
        instance: instance,
        session: session
      });
    },
    addRequest(instance, req) {
      this.$store.dispatch("instances/ADD_REQUEST", {
        instance: instance,
        request: req
      });
    },
    toggleSelected(session) {
      if (session.ws.requests.every(req => req.selected))
        session.ws.requests.map(req => (req.selected = false));
      else session.ws.requests.map(req => (req.selected = true));
    },
    sendSelected(session) {
      this.$store.dispatch("instances/SEND_SELECTED", session);
    },
    removeSelected(session) {
      this.$store.dispatch("instances/REMOVE_SELECTED", session);
    },
    removeSession(instance, session) {
      this.$store.dispatch("instances/REMOVE_SESSION", {
        instance: instance,
        session: session
      });
    }
  }
};
</script>

<style>
.v-expansion-panel__header {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
