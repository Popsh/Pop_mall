<template>
 <!-- 使用之前封装好的Swiper轮播组件 -->
 <swiper class="detail-swiper">
   <swiper-item v-for="(item,index) in topImages" :key="index">
     <img :src="item" alt="">
   </swiper-item>
 </swiper>
</template>

<script>
import {Swiper, SwiperItem} from 'components/common/swiper'
export default {
name: 'DetailSwiper',
props:{
  topImages:{
    type: Array,
    default(){
      return[]
    }
  }
},
components: { 
  Swiper, SwiperItem 
  },
}
</script>

<style scoped>
  .detail-swiper {
    height: 300px;
    overflow: hidden;
  }
</style>