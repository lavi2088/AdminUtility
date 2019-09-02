<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex>
        <v-card-title class="title">Appearance</v-card-title>
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 md6>
                <v-card-title class="title">Theme</v-card-title>
                <v-card-text>
                  <v-switch primary label="Dark" :input-value="settings.theme.dark" @change="TOGGLE('THEME')"></v-switch>
                </v-card-text>
              </v-flex>
              <v-flex xs12 md6>
                <v-card-title class="title">Navigation</v-card-title>
                <v-card-text>
                  <v-switch label="Mini" primary :input-value="settings.nav.mini" @change="TOGGLE('NAV_MINI')"></v-switch>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex>
        <v-card-title class="title">Actions</v-card-title>
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 md6>
                <v-card-actions>
                  <div>Session Cache &nbsp;&nbsp;&nbsp;</div>
                  <v-btn small class="secondary" @click="CLEAR()">Clear</v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapGetters(["settings"])
  },
  methods: {
    ...mapActions(["TOGGLE", "CLEAR"])
  }
};
</script>