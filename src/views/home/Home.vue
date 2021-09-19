<template>
<div id="home" class="wrapper">
  <!-- 导航栏 -->
  <nav-bar class="home-nav">
    <div slot="center">购物街</div>
  </nav-bar>
  <!-- 多复制一份tab-control组件，当滚动到某一位置时出现其他位置隐藏-->
  <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFixed"/>

 <!--   @scroll="contentScroll" 监听scroll子组件发射的事件,并定义contentScroll函数 -->
 <!--  :probe-type="3" 向scroll子组件传递 protype值为3 子组件通过prop接收 -->
 <!-- :pull-up-load="true" 向scroll子组件传递pullupload的值为true-->
 <!--  @pullingUp="loadMore" 监听scroll子组件发射的pulling事件并写loadmore方法-->
  <scroll class="content" ref="scroll" 
  :probe-type="3"   
  @scroll="contentScroll"
  :pull-up-load="true"
  @pullingUp="loadMore">
  <!-- 轮播图 封装到了 HomeSwiper里面-->
  <!-- @swiperImageLoad="swiperImageLoad" 监听homeswiper发射的事件 -->
  <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
  <recommend-view :recommends="recommends"/>
  <feature-view/>
  <tab-control :titles="['流行', '新款', '精选']" class="tab-control" @tabClick="tabClick" ref="tabControl2"/>
  <goods-list :goods="goodsShow"/>
  </scroll>
  <!-- 点击backtop组件，scroll组件里的内容回到顶部 这里涉及到组件的自定义事件 -->
  <!-- vue2用 .native 修饰符  v-show判断图标什么时候显示什么时候隐藏-->
  <back-top @click.native="backClick" v-show="isShowBackTop"/>
</div>
  
</template>

<script>

// 导入轮播组件
 import HomeSwiper from './childComponent/HomeSwiper'
 import RecommendView from './childComponent/RecommendView'
 import FeatureView from './childComponent/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

// home.vue 面向 home.js开发
 import {getHomeMultidata,getHomeGoods} from 'network/home'
 import {debounce} from "@/common/utils";
 import { itemListenerMixin, backTopMixin } from "@/common/mixin.js";


export default {
  name:"Home",
  data() {
    return {
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]},
      },
      currentType:'pop',
      isShowBackTop: false,
      // tabOffsetTop: 0, 保存 tabcontrol的offsettop 也就是滚动区域
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  components:{
    // 注册 navbar组件
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins: [itemListenerMixin,backTopMixin],
  created() {
    // 1.请求多个数据
    this.getHomeMultidata()
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    // 2. $bus事件总线在main.js里面声明
    this.$bus.$on('itemImageLoad',()=>{
      // console.log("图片加载完成");
      // 这里的refresh() 用了防抖,避免每加载一张图片就得重新调用refresh()
      // 那样的话就得调用30次,显然加大了服务器的压力
      // s所以我们可以将refresh函数传入到debounce函数中, 生成一个新的函数.
      // 之后在调用非常频繁的时候, 就使用新生成的函数.
      //而新生成的函数, 并不会非常频繁的调用, 如果下一次执行来的非常快, 那么会将上一次取消掉
        refresh()
    })
  },
  computed:{
    goodsShow(){
      return this.goods[this.currentType].list
    }
  },
  activated() {
    // 当组件活跃时,将原先保留的位置传回来,并刷新
    this.$refs.scroll.scrollTo(0,this.saveY,10)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // 当组件离开时,将位置保存下来
    this.saveY = this.$refs.scroll.getScrollY();

    // 取消全局事件的监听 是因为在详情页 推荐选项的内容和首页goodslistitem内容一样
    this.$bus.$off("itemImageLoad", this.ItemImgListener);
  },
  destroyed() {
      // console.log('home destroyed');
  },
  methods: {
     /**
       * 事件监听相关的方法
       */
      tabClick(index){
         // 点击之后,修改对应的currentType,
        this.currentType = (index<1)?'pop':(index==1)?'new':'sell'
        // 让图片与标题相对应（流行...）
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
        //  switch (index) {
        //   case 0:
        //     this.currentType = 'pop'
        //     break
        //   case 1:
        //     this.currentType = 'new'
        //     break
        //   case 2:
        //     this.currentType = 'sell'
        //     break
        // }
      },
      backClick(){
        // 点击之后,通过 this.$refs.scroll 拿到 scroll 这个组件,然后获取 scroll对象里面的方法
        //  回到顶部
         this.$refs.scroll.scrollTo(0, 0,500)
      },
      contentScroll(position) {
        // 1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000

        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      // 上拉加载更多
      loadMore(){
        // 调用getHomeGoods方法传入当前的currentType
        this.getHomeGoods(this.currentType)
      },
       swiperImageLoad() {
         // tabcontrol组件OffsetTop的值,应当在图片加载完知乎再获取
        //  所有的组件都有一个属性 $el : 用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

      /**
       * 网络请求相关的方法
       */
    getHomeMultidata(){
      getHomeMultidata().then(res=>{
      this.banners=res.data.banner.list;
      this.recommends = res.data.recommend.list;
    })
    },
    getHomeGoods(type){
      // 1.初始化请求1页数据
      const page = this.goods[type].page +1
      getHomeGoods(type,page).then(res=>{
      //console.log(res);
      //2. 将请求到的res 数据存入对应的type中的list里面
      this.goods[type].list.push(...res.data.list)
      // 3. 每发送一次请求,将数据存储完之后，页码 +1
      this.goods[type].page +=1

      // 完成上拉加载更多 需要调用finishPullUp()告诉 better-scroll 数据已加载。 
      // this.$refs.scroll.scroll.finishPullUp() 原本写法
      // 因他繁琐 所以在scroll组件中封装了finnishPullUp()方法
      this.$refs.scroll.finishPullUp()
    })
    }
  },
 
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }
 .home-nav {
    background-color: var(--color-tint);
    color: #fff;
     /* 在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/ 
    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
    }
 .content {
   overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    /* position: sticky; 失效 因为用了better-scroll*/
    position: relative;
    z-index: 9;
  }
 
</style>