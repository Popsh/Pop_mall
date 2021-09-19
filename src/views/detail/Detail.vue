<template>
  <div id="detail" >
    <!-- 1.封装一个detail-nav-bar 点击切换滑到对应的信息 @titleClick监听-->
    <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"></detail-nav-bar>

    <!-- 用scroll组件进行滚动 -->
    <!-- 这里再监听scroll滚动,来完成滑动到什么主题对应什么标题 -->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 2.封装一个detailswiper 传入数据-->
      <detail-swiper :top-images="topImages"/>
      <!-- 3.商品信息展示组件detailbaseInfo -->
      <detail-base-info :goods="goods"/>
      <!-- 4.商店信息展示组件 detailshopinfo -->
      <detail-shop-info :shop="shop"/>
      <!-- 5.商品图片信息展示组件 detailgoodsinfo -->
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <!-- 6.商品参数信息展示组件 detailparaminfo -->
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <!-- 7.商品评论信息展示组件 detailcommentInfo -->
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <!-- 8.商品推荐的图片和之前 goodlist 组件中一样 所以直接使用该组件 而不使用DetailRecommedInfo -->
      <goods-list ref="recommend" :goods="recommendList" ></goods-list>
    </scroll> 
    <!-- 9.返回顶部  并在contentScroll设置滑动到什么位置显示-->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- 10.底部导航栏 -->
    <detail-bottom-bar @addToCart='addToCart'/>
  </div>
</template>

<script>
 import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  
  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop"

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
  import { debounce } from "@/common/utils.js";
  import { itemListenerMixin} from "@/common/mixin.js";
  import { mapActions } from "vuex";


export default {
name:'Detail',
components:{
  DetailNavBar,
  DetailSwiper,
  DetailBaseInfo,
  DetailShopInfo,
  DetailGoodsInfo,
  DetailParamInfo,
  Scroll,
  DetailCommentInfo,
  GoodsList,
  DetailBottomBar,
  BackTop
},
mixins: [itemListenerMixin],
data() {
  return {
    topImages:[],
    goods:{},
    shop:{},
    detailInfo:{},
    paramInfo:{},
    commentInfo:{},
    recommendList:[],
    themeTopYs: [],
    getThemeTopY: null,
    currentIndex: 0,
    message: "",
    show: false,
    isShowBackTop: false,
  }
},
created() {
  // 1. 在组件创建的时候保存传入的id
  this.iid = this.$route.params.iid
 
 // 2. 根据iid请求详情页数据 
  getDetail(this.iid).then(res =>{
    // 1.获取顶部轮播图片数据
    // console.log(res);
    const data = res.result;
    // console.log(data);
      this.topImages = data.itemInfo.topImages

    // 2.获取商品信息 创建对象
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

    // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

    // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

    // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

    // 6.获取评论信息
      if(data.rate.cRate != 0){
        this.commentInfo = data.rate.list[0];
      }

  })
  
  // 3.获取推荐商品列表 重新发送请求
  getRecommend().then((res,err) =>{
    if(err) return;
    this.recommendList = res.data.list
    //console.log(this.recommendList );
  })
  
  //4.给getThemeTopY进行赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // Number.Max_VALUE 来设定一个大的区间 用于判定滑动到什么区间执行相应的判定
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    }, 100);
},
destroyed() {
    //.取消全局事件的监听 $bus.$off
    this.$bus.$off("itemImageLoad", this.ItemImgListener);
},
 methods: {
      ...mapActions(["addCart"]),
     
     imageLoad() {
        this.$refs.scroll.refresh()

        //图片加载完之后进行回调，结果才是正确的
        this.getThemeTopY();
      },
      // 点击标题切换到对应的主题
      titleClick(index){
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
      },
      // 滚动到什么主题切换成对应的标题
      contentScroll(position){
        // console.log(position);
        //1.获取y值
        const positionY = -position.y;
        const length = this.themeTopYs.length;

        //2.positionY和主题中值进行对比
        for (let i = 0; i < length - 1; i++) {
          // this.currentIndex !== i 是为了减少多次打印index的值
        if (
            this.currentIndex !== i &&
            i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]
        ) {
          // 假设themeTopYs为[0,222,555,789,max] 分别对应那个四个标题
          // 当滚动到 positionY 在 222~555 之间时将当前索引值保存下来 也就是1 
          // 之后再将索引值赋值给对应的 navbar标题 进行切换
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }
        // 判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000
      },
      // 点击返回顶部
      backClick(){
         this.$refs.scroll.scrollTo(0, 0)
      },
      // 添加到购物车
      addToCart(){
        // 1.获取购物车需要展示的信息
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.iid = this.iid;
        product.price = this.goods.realPrice;
        
        // 2.将商品添加到购物车  $store.dispatch 被触发的action 会返回一个promise
         this.$store.dispatch('addCart', product).then(res=>{
           console.log(res);
           this.$toast.show(res, 1500);
         })
        
      // 这里还可以使用 mapActions 映射方法 将vuex中的 actions中的方法在组件中直接使用 
      //   this.addCart(product).then((res) => {
      //     this.$toast.show(res, 1500);
      // });
      },
     
    },
}
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav{
   position: relative;
    z-index: 9;
    background-color: #fff;
}
.content {
  /* 除去头部 内容区自动撑满整个频幕  min-height: calc(100% - 40px); */
     height: calc(100% - 44px - 49px);
  }
</style>
