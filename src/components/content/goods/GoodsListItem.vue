<template>
   <div class="goods-item" @click="itemClick" >
     <!-- @load 监听图片是否加载完 -->
     <!--  v-lazy 图片懒加载 需安装插件后使用-->
    <img v-lazy="getImg" alt="" @load="imageLoad">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name:'GoodsListItem',
  props:{
    // 接收父组件GoodList.vue 传过来的 good-item,也为对象类型
    goodsItem:{
      type: Object,
      default(){
        return{}
      }
    }
  },
  methods: {
    imageLoad(){
      //利用路由来发射事件，让每个事件各自管理
      // if(this.$route.path.indexOf('/home')){
      //   this.$bus.$emit('homeItemImageLoad') //发射到事件总线
      // }else if(this.$route.path.indexOf('/detail')){
      //   this.$bus.$emit('detailItemImageLoad') //发射到事件总线
      // }

      // 用事件总线 $bus 发射事件 Home组件 mounted中进行监听
      this.$bus.$emit('itemImageLoad')
    },
    itemClick(){
      // 点击图片之后跳转到详情页
      this.$router.push('/detail/'+this.goodsItem.iid)
    }
  },
  computed:{
    // 写一个方法,用来绑定图片信息,来区别是首页的推荐图片还是详情页推荐的图片
    getImg(){
      return(
        this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
      );
   }
 }
}
</script>

<style scoped>
.goods-item {
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>