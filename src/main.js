import Vue from 'vue'
import App from './App.vue'
// Import vue router
import router from './router'
// Import vuex store
import store from './store'
// Import Buefy
import Buefy from 'buefy';
import './assets/scss/index.scss';
import '@mdi/font/css/materialdesignicons.css'
// Import fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBold } from '@fortawesome/free-solid-svg-icons'
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons'
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { faAlignRight } from '@fortawesome/free-solid-svg-icons'
import { faHeading } from '@fortawesome/free-solid-svg-icons'
import { faHighlighter } from '@fortawesome/free-solid-svg-icons'
import { faItalic } from '@fortawesome/free-solid-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import { faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { faListOl } from '@fortawesome/free-solid-svg-icons'

// Create fontawesome library
library.add(faBold, faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faHeading, faHighlighter, faItalic, faLink, faQuoteLeft, faStrikethrough, faListUl, faListOl)

// Register fontawesome icon component
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Import Axios
import axios from 'axios';

// Import title mixin
import titleMixin from './mixins/titleMixin'

// Setup title mixin
Vue.mixin(titleMixin)

// Set Axios baseURL
axios.defaults.baseURL = "http://localhost:3000/";

// Set Axios headers to include JWT token in each request
axios.interceptors.request.use(
  (config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    config.data = {
      ...config.data,
      refreshToken: localStorage.getItem("refreshToken"),
    };
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// Set Axios response interceptor to handle refresh token
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.data.error.name == "TokenExpiredError") {
      await axios.post("auth/refresh-token").then((response) => {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        error.config.headers.authorization = `Bearer ${response.data.accessToken}`;
        error.config.data = {
            refreshToken: response.data.refreshToken,
            ...error.config.data,
        };
      });

      return axios.request(error.config);
    } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
    }
    return Promise.reject(error);
  }
);

// Initialize Buefy
Vue.use(Buefy);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
