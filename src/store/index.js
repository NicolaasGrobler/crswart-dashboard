// Import dependencies
import Vue from "vue";
import Vuex from "vuex";
import titles from "../data/titles.json";
import roles from "../data/roles.json";
import file_extensions from "../data/file_extensions.json";

// Initialize vuex
Vue.use(Vuex);

// Create and export store
export default new Vuex.Store({
  // Define state
  state: {
    titles,
    roles,
    file_extensions,
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
