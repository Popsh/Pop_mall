<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      // 接收home组件传递过来的值
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
        message: '哈哈哈'
      }
    },

    mounted() {
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
      // probeType : 知道滚动的位置 属性值有 1 2 3
        probeType: this.probeType,
      // pullUpLoad 这个配置用于做上拉加载功能，默认为 false
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
          // position 不应该在scroll组件里打印,而是需要在home组件中打印,所以需要传出去
          // console.log(position);
          // 发射 scroll 事件给 home 父组件,并将position 传递给父组件
          this.$emit('scroll', position)
        })
      }

      // 3.监听scroll滚动到底部
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      //回到顶部 this.scroll是为了判断this.scroll对象是否有值
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      // 再一次上拉加载跟多的封装
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      getScrollY() {
        // 获取当前的位置
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
