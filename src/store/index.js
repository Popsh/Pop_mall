import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
// 1.安装插件
Vue.use(Vuex);
// 2.创建store对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addCounter(state, payload) {
      payload.count++;
    },
    addToCart(state, payload) {
      // payload.checked = false; 默认商品没有被选中
      payload.checked = false;
      state.cartList.push(payload);
    }
  },
  actions: {
    // 加入购物车时，需要判断cartList是否有该商品
    // 有该商品则该商品的数量+1，没有则加入新商品
    addCart(context, payload) {
      // actions可以返回一个 Promise 当点击加入购物车时可以返回resolve结果
      return new Promise((resolve, reject) => {
        // 1.查找之前的数据是否有该商品
        let oldProduct = context.state.cartList.find(
          item => item.iid === payload.iid
        );
        // 2.判断oldProduct
        if (oldProduct) {
          // oldProduct.count += 1 这个要写在mutation里面合理
          context.commit("addCounter", oldProduct);
          resolve("当前的商品数量+1");
        } else {
          payload.count = 1;
          // context.state.cartList.push(payload) 这个也要写在mutation里
          context.commit("addToCart", payload);
          resolve("添加了新的商品");
        }
      });
    }
  },
  getters
});

// 3.导出 store 挂载到App
export default store;
