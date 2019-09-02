<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-spacer></v-spacer>
      <v-flex xs12 xl6>
        <v-card>
          <v-toolbar color="secondary pt-2">
            <v-text-field v-model="instanceSearch" prepend-icon="search" label="Search" clearable></v-text-field>
          </v-toolbar>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 lg6 v-for="instance in filteredInstances" :key="instance.id">
        <v-card dark color="primary">
          <v-card-title class="primary subheading pt-1 pb-0 pr-0">
            <span class="title">{{instance.name}}</span>
            <span
              class="subheading font-weight-thin font-italic text-truncate"
            >- {{instance.tags.join(', ')}}&nbsp;</span>
            <v-spacer></v-spacer>
            <v-chip small outline disabled :color="instance.status" class="caption">instance</v-chip>
          </v-card-title>
          <cpod-card-title-floating>State</cpod-card-title-floating>
          <v-stepper v-model="instance.stateStepper" style="background: transparent">
            <v-stepper-header>
              <div class="step" v-for="(state, index) in instance.states" :key=index>
                  <v-stepper-step
                    color="secondary"
                    :step="index + 1"
                    :complete="(index + 1 ) <= instance.stateStepper">{{ state.name }}</v-stepper-step>
                  <v-divider></v-divider>
              </div>
            </v-stepper-header>
          </v-stepper>
          <cpod-card-title-floating>Processes</cpod-card-title-floating>
          <cpod-card-title-floating>EndPoints</cpod-card-title-floating>
          <v-layout row wrap>
            <v-flex px-3 py-1 xs12 sm6 md3 v-for="ep in instance.endPoints" :key="ep.id">
              <v-card color="primary lighten-1">
                <v-card-title class="subheading pt-1 pb-0 pr-0">
                  <span class="subheading">{{ep.name}}</span>
                  <v-spacer></v-spacer>
                  <v-chip small outline disabled :color="ep.status" class="caption"></v-chip>
                </v-card-title>
                <v-card-actions v-if="ep.status === 'green' && ep.apps" class="pb-0">
                  <v-select
                    color="secondary"
                    :items="ep.apps"
                    item-text="name"
                    item-value="url"
                    v-model="ep.selectedApp"
                    label="Select"
                    class="px-2"
                  ></v-select>
                  <v-btn
                    small
                    round
                    color="secondary"
                    :disabled="!ep.selectedApp"
                    :href="ep.selectedApp"
                    target="_blank"
                  >Go</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
          <cpod-card-title-floating>Tasks</cpod-card-title-floating>
          <v-layout row wrap>
            <v-flex px-3 py-1 xs12 sm6 md3 v-for="task in instance.tasks" :key="task.id">
              <v-btn small block color="secondary" dark @click="EXEC_TASK({instance: instance, task: task})">{{task}}</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import cpodCardTitleFloating from "@/components/cpodCardTitleFloating";
import _ from "lodash";

export default {
  name: "Instances",
  components: {
    cpodCardTitleFloating
  },
  data: () => ({
    instanceSearch: ""
  }),
  computed: {
    ...mapGetters(["instances"]),
    filteredInstances: function() {
      if (!this.instanceSearch) return this.instances;

      return _.filter(this.instances, instance => {
        return _.some(instance.tags, tag => {
          return _.startsWith(tag, this.instanceSearch.toLowerCase());
        });
      });
    }
  },
  methods: {
    ...mapActions("instances", ["EXEC_TASK"])
  },
};
</script>
