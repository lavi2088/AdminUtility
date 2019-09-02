<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-spacer></v-spacer>
      <v-flex xs12 xl6>
        <v-card>
          <v-toolbar color="secondary pt-2">
            <v-text-field v-model="serversSearch" prepend-icon="search" label="Search" clearable></v-text-field>
          </v-toolbar>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-for="server in filteredServers" :key="server.id">
      <v-flex>
        <v-card dark color="primary">
          <v-card-title class="primary">
            <span class="title">{{server.name | toTitle}}</span>
            <span
              class="subheading font-weight-thin font-italic text-truncate"
            >- {{server.tags.join(', ')}}&nbsp;</span>
          </v-card-title>
          <v-container v-if="server.urls" class="primary fluid lighten-1">
            <v-layout row wrap>
              <v-flex d-flex xs12 sm6 lg4 pa-1 v-for="url in server.urls" :key="url.id">
                <v-card max-width="100%" color="primary">
                  <v-card-title class="subheading pt-1 pb-0 pr-0">
                    <div class="text-truncate">{{ url.description | toTitle }}</div>
                    <v-spacer></v-spacer>
                    <v-chip
                      small
                      outline
                      disabled
                      color="primary lighten-2"
                      class="caption"
                    >{{url.type}}</v-chip>
                  </v-card-title>
                  <v-card-title class="text-truncate font-italic font-weight-light caption pa-0">
                    <v-layout row>
                      <v-flex xs11 overflow-hidden>
                        <v-tooltip right color="secondary">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              flat
                              small
                              color="secondary"
                              target="_blank"
                              :href="url.url"
                              v-on="on"
                            >
                              <div class="caption">{{url.url}}&nbsp;</div>
                            </v-btn>
                          </template>
                          <span>Open New Tab</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex>
                        <v-tooltip left color="secondary">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              flat
                              small
                              icon
                              color="secondary"
                              v-clipboard="() => url.url"
                              v-on="on"
                            >
                              <v-icon small>share</v-icon>
                            </v-btn>
                          </template>
                          <span>Copy To Clipboard</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-text class="primary lighten-1">
            <v-tooltip right color="secondary">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" flat small color="secondary" class="ml-0">
                  <code v-clipboard="() => server.ssh">{{server.ssh = sshString(server)}}</code>
                </v-btn>
              </template>
              <span>Copy To Clipboard</span>
            </v-tooltip>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "Servers",
  data: () => ({
    serversSearch: ""
  }),
  filters: {
    toTitle: function(value) {
      return _.startCase(value);
    }
  },
  methods: {
    sshString(server) {
      return server.securityType === "PEM"
        ? `ssh -i \${PEM} ${server.users[0]}@${server.ip}`
        : `ssh -P ${server.port} ${server.users[0]}@${server.ip}`;
    }
  },
  computed: {
    ...mapGetters(["servers"]),
    filteredServers: function() {
      if (!this.serversSearch) return this.servers;

      return _.filter(this.servers, server => {
        return _.some(server.tags, tag => {
          return _.startsWith(tag, this.serversSearch.toLowerCase());
        });
      });
    }
  }
};
</script>