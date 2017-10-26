// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import fastclick from 'fastclick';
import lazyLoad from 'vue-lazyload';

import './common/less/index.less';

Vue.use(lazyLoad, {
  loading: require('common/img/default.png')
});

Vue.config.productionTip = false;
fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
