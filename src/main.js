import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueLazyLoad from "vue-lazyload";
import FastClick from "fastclick";
import store from "./store";
import toast from "components/common/toast";
Vue.config.productionTip = false;

// 给 $bus设置原型 $bus就是一个vue实例
Vue.prototype.$bus = new Vue();

// 使用图片的懒加载
Vue.use(VueLazyLoad);
//安装toast插件
Vue.use(toast);
//解决移动端的300ms延迟
FastClick.attach(document.body);

new Vue({
  // 挂载路由
  router,
  store,
  render: h => h(App)
}).$mount("#app");
