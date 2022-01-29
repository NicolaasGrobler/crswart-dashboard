import Vue from 'vue'
import App from './App.vue'
// Import vue router
import router from './router'
// Import vuex store
import store from './store'
// Import Buefy
import Buefy from 'buefy';
import './assets/scss/index.scss';


// Initialize Buefy
Vue.use(Buefy);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
