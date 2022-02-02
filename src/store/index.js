// Import dependencies
import Vue from "vue";
import Vuex from "vuex";

// Initialize vuex
Vue.use(Vuex);

// Create and export store
export default new Vuex.Store({
  // Define state
  state: {
    user: {
      roles: [],
    },
  },
  // Define mutations
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
});
