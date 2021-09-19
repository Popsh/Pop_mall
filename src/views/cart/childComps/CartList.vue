<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item
        v-for="(item, index) in cartList"
        :item-info="item"
        :key="index"
      />
    </scroll>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Scroll from "components/common/scroll/Scroll";
import CartListItem from "./CartListItem";
export default {
  name:'CartList',
  components:{
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(["cartList"]),
  },
  activated() {
    // 在vue对象存活的情况下，
    // 进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据等

    this.$refs.scroll.refresh();
  },
}
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px - 49px - 40px);
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>