import Vue from "vue";
import Vuetify from "vuetify/lib";
import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import Clipboard from 'v-clipboard';

import "vuetify/src/stylus/app.styl";

import Default from "@/layouts/Default.vue";
import Public from "@/layouts/Public.vue";

Vue.config.productionTip = false;

Vue.component("default-layout", Default);
Vue.component("public-layout", Public);

Vue.use(Vuetify, {
  iconfont: "md",
  theme: {
    primary: '#164564',
    secondary: '#6dbd46',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
});

Vue.use(Clipboard);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
