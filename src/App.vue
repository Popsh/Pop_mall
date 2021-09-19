<template>
  <div id="app" class="" >
    <!-- 2.使用路由 keep-alive 保留状态 exclude 不保留   -->
    <keep-alive exclude="Detail">
      <router-view/>
    </keep-alive>
    <!-- 1.使用MainTabBar -->
    <main-tab-bar/>
  </div>
</template>

<script>
import MainTabBar from "components/content/MainTabBar.vue"
  export default {
    name: 'app',
    components: {  
      MainTabBar, 
    }
  }
</script>
<style>
@import "assets/css/base.css";
</style>
