<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-spacer></v-spacer>
      <v-flex xs12 xl6>
        <v-card>
          <v-toolbar color="secondary pt-2">
            <v-text-field v-model="linkSearch" prepend-icon="search" label="Search" clearable></v-text-field>
          </v-toolbar>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-for="link in filteredLinks" :key="link.id">
      <v-flex>
        <v-card dark color="primary">
          <v-card-title class="primary subheading pt-1 pb-0 pr-0">
            <span class="title">{{link.name}}</span>
            <span
              class="subheading font-weight-thin font-italic text-truncate"
            >- {{link.tags.join(', ')}}&nbsp;</span>
            <v-spacer></v-spacer>
            <v-chip small outline disabled color="primary lighten-2" class="caption">link</v-chip>
          </v-card-title>
          <v-card-title class="text-truncate font-italic font-weight-light caption pa-0">
            <v-layout row>
              <v-flex xs11 overflow-hidden>
                <v-tooltip right color="secondary">
                  <template v-slot:activator="{ on }">
                    <v-btn flat small color="secondary" target="_blank" :href="link.url" v-on="on">
                      <div class="caption">{{link.url}}&nbsp;</div>
                    </v-btn>
                  </template>
                  <span>Open New Tab</span>
                </v-tooltip>
              </v-flex>
              <v-flex>
                <v-tooltip left color="secondary">
                  <template v-slot:activator="{ on }">
                    <v-btn flat small icon color="secondary" v-clipboard="() => link.url" v-on="on">
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
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "Links",
  data: () => ({
    linkSearch: ""
  }),
  computed: {
    ...mapGetters(["links"]),
    filteredLinks: function() {
      if (!this.linkSearch) return this.links;

      return _.filter(this.links, link => {
        return _.some(link.tags, tag => {
          return _.startsWith(tag, this.linkSearch.toLowerCase());
        });
      });
    }
  }
};
</script>
