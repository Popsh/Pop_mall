// 导出之后我们使用mapGetters,让其他组件可以直接使用这个属性
export default {
  cartLength(state) {
    return state.cartList.length;
  },
  cartList(state) {
    return state.cartList;
  }
};
