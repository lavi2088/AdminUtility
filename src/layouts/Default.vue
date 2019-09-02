<template>
  <v-app :dark="settings.theme.dark">
    <v-navigation-drawer
      class="secondary"
      style="display:flex;flex-direction:column;"
      v-model="settings.nav.model"
      :mini-variant="settings.nav.mini"
      mobile-break-point="960"
      floating
      overflow
      app
      dark
    >
      <v-toolbar color="primary">
        <v-list-tile-action>
          <v-icon @click.stop="settings.nav.model = !settings.nav.model">menu</v-icon>
        </v-list-tile-action>
        <v-toolbar-title>
          <v-btn flat @click="redirect()">
            <v-img contain :src="require('@/assets/logo.png')"></v-img>
          </v-btn>
        </v-toolbar-title>
      </v-toolbar>
      <v-list>
        <v-list-tile v-for="link in nav.local" :key="link.id" :to="{path: link.name}">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile v-for="link in nav.remote" :key="link.id" :to="{path: link.name}">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-spacer></v-spacer>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile v-for="link in nav.bottom" :key="link.id" :to="{path: link.name}">
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-footer class="justify-center" inset color="primary">
        &copy; 2019
        <span v-if="!settings.nav.mini" class="font-weight-medium">&nbsp;CPOD</span>
      </v-footer>
    </v-navigation-drawer>
    <v-toolbar clipped-left absolute app dark color="primary">
      <v-toolbar-side-icon @click.stop="settings.nav.model = !settings.nav.model"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-spacer class="hidden-sm-and-up"></v-spacer>
      <v-btn flat class="mr-5" @click="redirect()">
        <v-img contain :src="require('@/assets/logo.png')"></v-img>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat @click="redirect('settings')">{{auth.username}}</v-btn>
    </v-toolbar>
    <v-content>
      <v-fade-transition mode="out-in">
        <slot/>
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    nav: {
      local: [
        { icon: "code", name: "code" },
        { icon: "build", name: "build" },
        { icon: "send", name: "test" }
      ],
      remote: [
        { icon: "web", name: "instances" },
        { icon: "apps", name: "servers" },
        { icon: "link", name: "links" }
      ],
      bottom: [
        { icon: "settings", name: "settings" },
        { icon: "exit_to_app", name: "logout" }
      ]
    }
  }),
  computed: {
    ...mapGetters(["settings", "auth"])
  },
  methods: {
    redirect(name = "home") {
      this.$router.push(name);
    }
  }
};
</script>

<style>
* {
  text-transform: none !important;
}
</style>