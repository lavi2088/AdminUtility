<template>
  <v-container grid-list-xs>
    <v-layout row wrap>
      <v-flex>
        <v-card dark color="secondary" class="py-2">
          <v-card-text class="headline">
            Ciao,
            <span class="font-weight-bold">{{auth.username}}</span>!
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  created() {
    setTimeout(() => this.$store.dispatch("auth/LOGOUT"), 900);
  },
  computed: {
    ...mapGetters(["auth"])
  }
};
</script>
