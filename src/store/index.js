// Import dependencies
import Vue from "vue";
import Vuex from "vuex";

// Initialize vuex
Vue.use(Vuex);

// Create and export store
export default new Vuex.Store({
  // Define state
  state: {
    count: 0,
  },
  // Define mutations
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});
