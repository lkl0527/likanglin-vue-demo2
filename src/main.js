// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import routes from './router'
// import router from './router'
// import ApiPlugin from '@/plugin/apis';
// import AjaxPlugin from '@/plugin/AjaxPlugin';

import xdomain from 'xdomain/src/index'
xdomain({
  slaves:{
    'http://localhost:12319':'/proxy.html'
  }
})
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);

const router = new VueRouter({routes})


// Vue.use(ApiPlugin);
// Vue.use(AjaxPlugin);
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
