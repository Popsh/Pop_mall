<template>
  <div class="goods">
    <!-- 遍历goods 拿到里面的item 传到goodlistitem 也就是 :good-item='item'  -->
    <goods-list-item v-for="(item,index) in goods" :goods-item='item' :key="index"/>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem'

export default {
  name:'GoodsList',
  components: { GoodsListItem },
  props:{
    // 接收 home.vue 父组件传过来的goods 且为对象类型
    goods:{
      type: Array,
      default(){
        return[]
      }
    }
  }
}
</script>

<style scoped>
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    padding: 2px;
  }

</style>