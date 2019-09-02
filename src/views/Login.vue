<template>
  <v-app :dark="settings.theme.dark">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm6 md4>
            <v-card class="elevation-12" light>
              <v-toolbar color="primary" height="150">
                <v-img contain max-height="100" :src="require('@/assets/logo.png')"></v-img>
              </v-toolbar>
              <v-alert dense type="error" :value="auth.error" class="my-0">
                {{auth.error}}
              </v-alert>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    name="Username"
                    label="Username"
                    type="text"
                    size="20"
                    autocomplete="none"
                    v-model="user.username"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="Password"
                    label="Password"
                    type="password"
                    size="30"
                    autocomplete="current-password"
                    v-model="user.password"
                    @keyup.enter="LOGIN(user)"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="LOGIN(user)">Login</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-fab-transition>
      <v-btn fab fixed bottom right @click.stop="TOGGLE('THEME')">
        <v-icon>invert_colors</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    user: {
      username: "",
      password: ""
    }
  }),
  computed: {
    ...mapGetters(["settings", "auth"])
  },
  methods: {
    ...mapActions("auth", ["LOGIN"]),
    ...mapActions(["TOGGLE"])
  }
};
</script>