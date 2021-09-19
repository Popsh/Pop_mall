<template>
<!-- 选中不选中的问题，一定是在模型改变的  -->
  <div class="check-button" :class="{ check: IsCheck }">
    <img src="~assets/img/cart/tick.svg" />
  </div>
</template>
<script>
export default {
  name: "CheckButton",
  props: {
    // IsCheck 商品是否选中 应该在商品模型里面修改
    // 也就是 mutations 里面 给商品payloa添加一个check属性
    // payload.checked = false;
    IsCheck: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.check-button {
  position: relative;
  margin: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #ccc;
  cursor: pointer;
}
.check {
  background-color: var(--color-tint);
  border-color: var(--color-tint);
}
</style>
