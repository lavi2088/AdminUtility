import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

import Home from "./views/Home.vue";
import Login from "./views/Login.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.VUE_APP_PUBLIC_PATH,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { layout: "public" }
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: "/test",
      name: "test",
      component: () =>
        import(/* webpackChunkName: "test" */ "@/views/Test.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/instances",
      name: "instances",
      component: () =>
        import(/* webpackChunkName: "instances" */ "@/views/Instances.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/servers",
      name: "servers",
      component: () =>
        import(/* webpackChunkName: "servers" */ "@/views/Servers.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/links",
      name: "links",
      component: () =>
        import(/* webpackChunkName: "links" */ "@/views/Links.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/logout",
      name: "logout",
      component: () =>
        import(/* webpackChunkName: "logout" */ "@/views/Logout.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/settings",
      name: "settings",
      component: () =>
        import(/* webpackChunkName: "settings" */ "@/views/Settings.vue"),
      meta: { requiresAuth: true }
    },
    { path: "/*", redirect: { name: "home" } }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (!from.name && to.name === "login") { next(); return; }
  if (from.name === "logout") { next(); return; }

  await store.dispatch("auth/PING", { isRouter: true });
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.state.auth.error === "") {
      if (!from.name) await store.dispatch("INIT");
      next();
    } else {
      next({ name: "login" });
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (store.state.auth.error === "") {
      next({ name: "home" });
    } else {
      next();
    }
  }
});

export default router;
